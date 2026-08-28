import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  CircleDot, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Compass
} from 'lucide-react';
import { ChargingStation } from '../types';
import { StationCard } from './StationCard';

interface StationListProps {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (station: ChargingStation) => void;
  radiusMeters: number;
  onResetFilters: () => void;
}

export const StationList: React.FC<StationListProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  radiusMeters,
  onResetFilters,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'inside_zone'>('inside_zone');

  const radiusLabel = radiusMeters >= 1000 ? `${(radiusMeters / 1000).toFixed(0)}km` : `${radiusMeters}m`;

  const insideZoneStations = stations.filter(
    (s) => (s.distanceMeters ?? Infinity) <= radiusMeters
  );
  const outsideStations = stations.filter(
    (s) => (s.distanceMeters ?? Infinity) > radiusMeters
  );

  // Auto-switch to 'all' if there are 0 chargers within the strict zone radius so user sees closest chargers
  useEffect(() => {
    if (insideZoneStations.length === 0 && stations.length > 0) {
      setActiveTab('all');
    }
  }, [insideZoneStations.length, stations.length]);

  const displayedStations = activeTab === 'inside_zone' 
    ? insideZoneStations 
    : stations;

  return (
    <div className="flex flex-col h-full bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50/70 transition-colors duration-200">
      
      {/* Tab Switcher: Inside Zone vs All Nearby */}
      <div className="p-3 bg-[#13161C] dark:bg-[#13161C] light:bg-white border-b border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between gap-2 transition-colors duration-200">
        <div className="flex items-center gap-1.5 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 p-1 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200 text-xs w-full sm:w-auto">
          <button
            id="tab-inside-zone"
            onClick={() => setActiveTab('inside_zone')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'inside_zone'
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
            }`}
          >
            <CircleDot className="w-3 h-3" />
            <span>{radiusLabel} Zone ({insideZoneStations.length})</span>
          </button>

          <button
            id="tab-all-nearby"
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>All Nearby ({stations.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono hidden md:inline uppercase tracking-wider">
          {displayedStations.length} station{displayedStations.length === 1 ? '' : 's'} listed
        </span>
      </div>

      {/* Helpful banner when showing All Nearby because zone is empty */}
      {insideZoneStations.length === 0 && stations.length > 0 && activeTab === 'all' && (
        <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-300 dark:text-amber-300 light:text-amber-800">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Showing nearest EV chargers across Singapore (sorted by distance from your search).</span>
        </div>
      )}

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 overscroll-contain touch-pan-y">
        {displayedStations.length > 0 ? (
          displayedStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isSelected={selectedStation?.id === station.id}
              onSelect={onSelectStation}
              radiusMeters={radiusMeters}
            />
          ))
        ) : (
          <div className="py-12 px-4 text-center bg-[#13161C] dark:bg-[#13161C] light:bg-white border border-dashed border-white/10 dark:border-white/10 light:border-slate-300 rounded-xl">
            <div className="w-10 h-10 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-center mx-auto text-zinc-400 dark:text-zinc-400 light:text-slate-500 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-tight">
              {activeTab === 'inside_zone'
                ? `No chargers within strict ${radiusLabel} zone`
                : 'No charging stations match your filters'}
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1 max-w-xs mx-auto">
              {activeTab === 'inside_zone'
                ? 'Switch to "All Nearby" to see chargers further away or expand your radius filter.'
                : 'Try adjusting your operator, plug type, or power speed criteria.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {activeTab === 'inside_zone' && outsideStations.length > 0 && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="px-3 py-1.5 rounded bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  View {outsideStations.length} Nearby Stations
                </button>
              )}
              <button
                onClick={onResetFilters}
                className="px-3 py-1.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 text-xs uppercase tracking-wider font-semibold border border-white/10 dark:border-white/10 light:border-slate-200 transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

