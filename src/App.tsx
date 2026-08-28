import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ChargingStation, 
  SearchTarget, 
  LocationMode, 
  FilterState, 
  SortBy 
} from './types';
import { INITIAL_SG_CHARGERS } from './data/mockChargers';
import { POPULAR_SG_LOCATIONS } from './services/onemap';
import { enrichStationsWithDistance } from './utils/geo';
import { 
  fetchLTAEVChargingPoints, 
  getBackendStatus, 
  normalizeLTARecordToStation,
  BackendStatus 
} from './services/backendApi';
import { Header } from './components/Header';
import { SearchControl } from './components/SearchControl';
import { RadiusStatsBanner } from './components/RadiusStatsBanner';
import { FilterBar } from './components/FilterBar';
import { ChargerMap } from './components/ChargerMap';
import { StationList } from './components/StationList';
import { StationDetailModal } from './components/StationDetailModal';
import { CommunityDiscussionModal } from './components/CommunityDiscussionModal';
import { 
  Map as MapIcon, 
  ListFilter
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [stations, setStations] = useState<ChargingStation[]>(INITIAL_SG_CHARGERS);
  const [target, setTarget] = useState<SearchTarget>(POPULAR_SG_LOCATIONS[0]); // Default: Marina Bay Sands
  const [locationMode, setLocationMode] = useState<LocationMode>('search_destination');
  const [radiusMeters, setRadiusMeters] = useState<number>(500); // 500m strict boundary default
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  // 2. Geolocation & Sync State
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [dataSource, setDataSource] = useState<'lta_live' | 'curated_grid'>('curated_grid');

  // 3. Mobile View Switcher (Map vs List)
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  // 4. Filters & Sorting State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    plugTypes: [],
    speedTypes: [],
    operators: [],
    availableOnly: false,
    minPowerKw: 0,
    only24Hours: false,
    onlySheltered: false,
    radiusMeters: 500,
    strict500mOnly: false,
  });

  const [sortBy, setSortBy] = useState<SortBy>('distance_asc');

  // Check backend and LTA live status on mount
  useEffect(() => {
    getBackendStatus().then((status) => {
      setBackendStatus(status);
      if (status.services.ltaDatamall.configured) {
        setDataSource('lta_live');
      }
    });
  }, []);

  // Fetch initial live data if available
  useEffect(() => {
    async function loadData() {
      try {
        const liveData = await fetchLTAEVChargingPoints();
        if (liveData && liveData.data && liveData.data.length > 0) {
          const ltaStations: ChargingStation[] = liveData.data.map((rec: any, idx: number) =>
            normalizeLTARecordToStation(rec, idx)
          );
          setStations(ltaStations);
          setDataSource('lta_live');
        }
      } catch (err) {
        console.info('Using high-fidelity Singapore EV hubs grid dataset:', err);
      }
    }
    loadData();
  }, []);

  // Geolocation trigger
  const handleTriggerNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;

        // Check if within reasonable Singapore bounding box
        const isSG = latitude >= 1.15 && latitude <= 1.48 && longitude >= 103.58 && longitude <= 104.05;

        if (isSG) {
          setTarget({
            id: 'current-gps-loc',
            label: 'Your Current GPS Location',
            address: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            latitude,
            longitude,
            mode: 'near_me',
          });
          setLocationMode('near_me');
        } else {
          // Fallback to central Marina Bay with a friendly note
          setTarget({
            id: 'simulated-loc',
            label: 'Singapore Central (Simulated GPS)',
            address: '10 Bayfront Avenue, Singapore 018956',
            postalCode: '018956',
            latitude: 1.2834,
            longitude: 103.8607,
            mode: 'near_me',
          });
          setLocationMode('near_me');
          setLocationError('GPS is outside Singapore bounds. Centering on Singapore Central (Marina Bay).');
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        setLocationError(`GPS access: ${err.message}. Using Marina Bay Sands.`);
        // Fallback gracefully
        setTarget(POPULAR_SG_LOCATIONS[0]);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Enrich stations with distances based on current target
  const enrichedStations = useMemo(() => {
    return enrichStationsWithDistance(stations, target, radiusMeters);
  }, [stations, target, radiusMeters]);

  // Apply User Filters
  const filteredStations = useMemo(() => {
    let result = enrichedStations.filter((s) => {
      // Available bays only
      if (filters.availableOnly && s.availableBays <= 0) return false;

      // Operator filter
      if (filters.operators.length > 0 && !filters.operators.includes(s.operator)) {
        return false;
      }

      // Plug Type filter (CCS2, Type 2, etc.)
      if (filters.plugTypes.length > 0) {
        const hasMatchingPlug = s.connectors.some((c) => filters.plugTypes.includes(c.type));
        if (!hasMatchingPlug) return false;
      }

      // Minimum power filter
      if (filters.minPowerKw > 0) {
        const hasMinPower = s.connectors.some((c) => c.powerKw >= filters.minPowerKw);
        if (!hasMinPower) return false;
      }

      // 24 Hours filter
      if (filters.only24Hours && !s.is24Hours) return false;

      // Sheltered filter
      if (filters.onlySheltered && !s.isSheltered) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance_asc') {
        return (a.distanceMeters ?? 999999) - (b.distanceMeters ?? 999999);
      }
      if (sortBy === 'available_desc') {
        return b.availableBays - a.availableBays;
      }
      if (sortBy === 'speed_desc') {
        const maxA = Math.max(...a.connectors.map((c) => c.powerKw), 0);
        const maxB = Math.max(...b.connectors.map((c) => c.powerKw), 0);
        return maxB - maxA;
      }
      if (sortBy === 'price_asc') {
        return a.pricingInfo.perKwh - b.pricingInfo.perKwh;
      }
      return 0;
    });

    return result;
  }, [enrichedStations, filters, sortBy]);

  // Live Refresh Handler
  const handleRefreshData = async () => {
    setIsRefreshing(true);

    try {
      const liveData = await fetchLTAEVChargingPoints();
      if (liveData && liveData.data && liveData.data.length > 0) {
        const ltaStations: ChargingStation[] = liveData.data.map((rec: any, idx: number) =>
          normalizeLTARecordToStation(rec, idx)
        );
        setStations(ltaStations);
        setDataSource('lta_live');
        setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsRefreshing(false);
        return;
      }
    } catch {
      // Continue to local sync fallback
    }

    // Fallback sync simulation for local station dataset
    setTimeout(() => {
      setStations((prev) =>
        prev.map((station) => {
          const updatedConnectors = station.connectors.map((conn) => {
            const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
            const newAvail = Math.max(0, Math.min(conn.total, conn.available + delta));
            return {
              ...conn,
              available: newAvail,
              status: (newAvail > 0 ? 'AVAILABLE' : 'OCCUPIED') as 'AVAILABLE' | 'OCCUPIED',
            };
          });

          const totalAvail = updatedConnectors.reduce((sum, c) => sum + c.available, 0);
          const totalOcc = station.totalBays - totalAvail;

          return {
            ...station,
            availableBays: totalAvail,
            occupiedBays: totalOcc,
            connectors: updatedConnectors,
            lastUpdated: 'Just now',
          };
        })
      );
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 500);
  };

  // Interactive bay simulation toggle
  const handleToggleBayStatus = (stationId: string, connectorId: string) => {
    setStations((prev) =>
      prev.map((st) => {
        if (st.id !== stationId) return st;
        const updated = st.connectors.map((cn) => {
          if (cn.id !== connectorId) return cn;
          const nextAvail = cn.available > 0 ? cn.available - 1 : Math.min(cn.total, cn.available + 1);
          return {
            ...cn,
            available: nextAvail,
            status: (nextAvail > 0 ? 'AVAILABLE' : 'OCCUPIED') as 'AVAILABLE' | 'OCCUPIED',
          };
        });
        const totalAvail = updated.reduce((acc, c) => acc + c.available, 0);
        return {
          ...st,
          availableBays: totalAvail,
          occupiedBays: st.totalBays - totalAvail,
          connectors: updated,
          lastUpdated: 'Just now (simulated)',
        };
      })
    );

    // Update selected station modal if open
    setSelectedStation((prev) => {
      if (!prev || prev.id !== stationId) return prev;
      const updatedConnectors = prev.connectors.map((cn) => {
        if (cn.id !== connectorId) return cn;
        const nextAvail = cn.available > 0 ? cn.available - 1 : Math.min(cn.total, cn.available + 1);
        return {
          ...cn,
          available: nextAvail,
          status: (nextAvail > 0 ? 'AVAILABLE' : 'OCCUPIED') as 'AVAILABLE' | 'OCCUPIED',
        };
      });
      const totalAvail = updatedConnectors.reduce((acc, c) => acc + c.available, 0);
      return {
        ...prev,
        availableBays: totalAvail,
        occupiedBays: prev.totalBays - totalAvail,
        connectors: updatedConnectors,
        lastUpdated: 'Just now (simulated)',
      };
    });
  };

  const handleSelectStation = (station: ChargingStation) => {
    setSelectedStation(station);
    setIsDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      plugTypes: [],
      speedTypes: [],
      operators: [],
      availableOnly: false,
      minPowerKw: 0,
      only24Hours: false,
      onlySheltered: false,
      radiusMeters: 500,
      strict500mOnly: false,
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:h-screen lg:overflow-hidden bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900 font-sans transition-colors duration-200">
      
      {/* Top Application Header */}
      <Header
        mode={locationMode}
        onModeChange={(m) => {
          setLocationMode(m);
          if (m === 'near_me') handleTriggerNearMe();
        }}
        onNearMeClick={handleTriggerNearMe}
        isLocating={isLocating}
        radiusMeters={radiusMeters}
        onRadiusChange={setRadiusMeters}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        lastRefreshedTime={lastRefreshedTime}
        dataSource={dataSource}
        hasLtaKey={backendStatus?.services.ltaDatamall.configured ?? false}
        onOpenCommunity={() => setIsCommunityModalOpen(true)}
      />

      {/* Main Responsive Layout Workspace */}
      <main className="flex-1 flex flex-col min-h-0 lg:overflow-hidden relative">
        
        {/* Top Controls Container (Search, 500m Radius Stats, Filter Chips) */}
        <section aria-label="Search and zone statistics" className="flex-shrink-0 px-3 sm:px-6 py-2.5 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 border-b border-white/5 dark:border-white/5 light:border-slate-200 space-y-2.5 max-w-7xl mx-auto w-full transition-colors duration-200">
          
          {/* Row 1: Search & Destination Input */}
          <SearchControl
            currentTarget={target}
            onSelectTarget={(t) => {
              setTarget(t);
              setLocationMode(t.mode);
            }}
            mode={locationMode}
            onModeChange={setLocationMode}
            onTriggerNearMe={handleTriggerNearMe}
            isLocating={isLocating}
            locationError={locationError}
          />

          {/* Row 2: 500-Meter Radius Aggregate Summary Card */}
          <RadiusStatsBanner
            stations={enrichedStations}
            target={target}
            radiusMeters={radiusMeters}
            onFocusMapZone={() => {
              // Focus mobile view on map if on small screen
              setMobileTab('map');
            }}
            onSelectStation={handleSelectStation}
          />

          {/* Row 3: Filter & Sort Controls */}
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalFilteredCount={filteredStations.length}
          />

        </section>

        {/* Mobile View Toggle Bar (Map vs Station List) */}
        <div className="lg:hidden sticky top-0 z-20 flex border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-[#13161C] dark:bg-[#13161C] light:bg-white px-3 py-1.5 justify-center gap-2 transition-colors duration-200 shadow-sm">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'map'
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 border border-white/5 dark:border-white/5 light:border-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map & 500m Ring</span>
          </button>

          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'list'
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 border border-white/5 dark:border-white/5 light:border-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Charger List ({filteredStations.length})</span>
          </button>
        </div>

        {/* Split View Content Area (Map on Left/Center, Station Drawer List on Right) */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 lg:overflow-hidden px-2 sm:px-6 pb-6 lg:pb-2 max-w-7xl mx-auto w-full gap-3 pt-2">
          
          {/* Map Container */}
          <div className={`flex-1 h-[65vh] min-h-[380px] lg:h-full lg:min-h-0 relative rounded-xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
            <ChargerMap
              target={target}
              stations={filteredStations}
              selectedStation={selectedStation}
              onSelectStation={handleSelectStation}
              radiusMeters={radiusMeters}
            />
          </div>

          {/* Station Cards Drawer / Sidebar List */}
          <div className={`w-full lg:w-[410px] xl:w-[460px] min-h-[450px] lg:h-full flex-shrink-0 flex flex-col rounded-xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 bg-[#13161C] dark:bg-[#13161C] light:bg-white shadow-2xl light:shadow-md transition-colors duration-200 ${mobileTab === 'map' ? 'hidden lg:flex' : 'flex'}`}>
            <StationList
              stations={filteredStations}
              selectedStation={selectedStation}
              onSelectStation={handleSelectStation}
              radiusMeters={radiusMeters}
              onResetFilters={handleResetFilters}
            />
          </div>

        </div>

      </main>

      {/* Station Detail & Charging Simulator Modal (with Disqus Comments) */}
      {isDetailModalOpen && selectedStation && (
        <StationDetailModal
          station={selectedStation}
          onClose={() => {
            setIsDetailModalOpen(false);
          }}
          radiusMeters={radiusMeters}
          onToggleBayStatus={handleToggleBayStatus}
        />
      )}

      {/* General Singapore EV Drivers Community Discussion Forum Modal */}
      {isCommunityModalOpen && (
        <CommunityDiscussionModal
          onClose={() => setIsCommunityModalOpen(false)}
        />
      )}

    </div>
  );
}
