import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Layers, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Zap, 
  ExternalLink, 
  CircleDot,
  Compass
} from 'lucide-react';
import { ChargingStation, SearchTarget } from '../types';
import { formatDistance, formatWalkingEta } from '../utils/geo';
import { useTheme } from '../context/ThemeContext';

interface ChargerMapProps {
  target: SearchTarget;
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (station: ChargingStation) => void;
  radiusMeters: number;
  onFitZoneTriggered?: () => void;
}

type TileLayerTheme = 'dark' | 'voyager' | 'osm';

export const ChargerMap: React.FC<ChargerMapProps> = ({
  target,
  stations,
  selectedStation,
  onSelectStation,
  radiusMeters,
}) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const targetLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const circleRadiusRef = useRef<L.Circle | null>(null);

  const [tileTheme, setTileTheme] = useState<TileLayerTheme>(theme === 'dark' ? 'dark' : 'voyager');
  const [showRadiusGuide, setShowRadiusGuide] = useState(true);

  // Sync map tiles with app theme changes
  useEffect(() => {
    setTileTheme(theme === 'dark' ? 'dark' : 'voyager');
  }, [theme]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [target.latitude, target.longitude],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Add attribution in a clean corner
    L.control.attribution({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const tileUrl = getTileUrl(tileTheme);
    const tileSubdomains = tileTheme === 'osm' ? 'abc' : 'abcd';
    const tile = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: tileSubdomains,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    tileLayerRef.current = tile;
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    targetLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl = getTileUrl(tileTheme);
    const tileSubdomains = tileTheme === 'osm' ? 'abc' : 'abcd';
    const newTile = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: tileSubdomains,
      attribution: '&copy; CARTO / OpenStreetMap',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [tileTheme]);

  // Update Target Marker & 500m Boundary Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const targetGroup = targetLayerGroupRef.current;
    if (!map || !targetGroup) return;

    targetGroup.clearLayers();

    // 1. Center Target Marker (Pulsing Radar Pin)
    const targetIcon = L.divIcon({
      className: 'custom-target-marker',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 -ml-5 -mt-5">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/20 animate-ping"></div>
          <div class="absolute w-6 h-6 rounded-full bg-emerald-500/40 animate-pulse"></div>
          <div class="relative w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
          </div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([target.latitude, target.longitude], {
      icon: targetIcon,
      zIndexOffset: 1000,
    }).addTo(targetGroup);

    marker.bindTooltip(
      `<div class="text-xs font-semibold px-1 py-0.5">${target.label}</div>`,
      { permanent: false, direction: 'top', offset: [0, -10] }
    );

    // 2. Visible 500m Radius Boundary Circle Overlay
    if (showRadiusGuide) {
      const circle = L.circle([target.latitude, target.longitude], {
        radius: radiusMeters,
        color: '#10b981',
        weight: 2,
        dashArray: '6, 8',
        fillColor: '#10b981',
        fillOpacity: 0.08,
      }).addTo(targetGroup);

      circleRadiusRef.current = circle;
    }

    // Pan map to new target coordinate
    map.panTo([target.latitude, target.longitude], { animate: true, duration: 0.6 });
  }, [target, radiusMeters, showRadiusGuide]);

  // Render Charging Station Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    stations.forEach((station) => {
      const isSelected = selectedStation?.id === station.id;
      const isWithin500m = (station.distanceMeters ?? Infinity) <= radiusMeters;
      
      // Determine color based on availability:
      // Green = Available bays > 0
      // Amber/Red = 0 available (Occupied)
      // Gray = Offline
      let bgColor = 'bg-emerald-500';
      let ringColor = 'border-emerald-300';
      let textColor = 'text-slate-950';

      if (station.availableBays === 0) {
        bgColor = 'bg-amber-500';
        ringColor = 'border-amber-300';
      }
      if (station.offlineBays === station.totalBays) {
        bgColor = 'bg-slate-600';
        ringColor = 'border-slate-400';
      }

      // Special highlight for stations strictly inside the 500m zone vs outside
      const zoneBadge = isWithin500m
        ? 'ring-2 ring-emerald-400/80 shadow-emerald-950/60'
        : 'opacity-85';

      const selectedHighlight = isSelected
        ? 'scale-125 z-50 ring-4 ring-white shadow-2xl animate-bounce'
        : 'hover:scale-110';

      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 ${selectedHighlight}">
            <!-- Pin Badge -->
            <div class="flex items-center justify-center px-2 py-1 rounded-full ${bgColor} ${ringColor} ${textColor} font-bold text-xs shadow-lg border ${zoneBadge} gap-1">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span>${station.availableBays}</span>
            </div>
            <!-- Pin Tail -->
            <div class="w-1.5 h-1.5 ${bgColor} rotate-45 -mt-0.5 border-r border-b ${ringColor}"></div>
          </div>
        `,
        iconSize: [36, 32],
        iconAnchor: [18, 30],
      });

      const stationMarker = L.marker([station.latitude, station.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : isWithin500m ? 200 : 50,
      }).addTo(markersGroup);

      // Bind Click Popup Card
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 text-[#F4F4F5] min-w-[210px] font-sans';
      popupHtml.innerHTML = `
        <div class="flex items-center justify-between pb-1.5 border-b border-white/10">
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 uppercase tracking-wider">
            ${station.operator}
          </span>
          <span class="text-xs font-bold font-mono ${station.availableBays > 0 ? 'text-emerald-400' : 'text-amber-400'}">
            ${station.availableBays} / ${station.totalBays} Free
          </span>
        </div>
        <div class="mt-2 text-xs font-bold text-white leading-tight">
          ${station.name}
        </div>
        <div class="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
          ${station.address}
        </div>
        <div class="mt-2 flex items-center justify-between text-[11px] bg-black/40 p-1.5 rounded border border-white/5 font-mono">
          <span class="font-medium text-zinc-400">Distance:</span>
          <span class="font-bold text-white">${formatDistance(station.distanceMeters ?? 0)} (${formatWalkingEta(station.distanceMeters ?? 0)})</span>
        </div>
        <div class="mt-2 pt-2 border-t border-white/10 flex gap-1.5">
          <button id="popup-detail-btn-${station.id}" class="flex-1 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider py-1 px-2 rounded text-[10px] text-center transition-colors shadow-sm">
            View Details
          </button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}" target="_blank" rel="noopener noreferrer" class="bg-[#13161C] hover:bg-zinc-800 text-zinc-200 border border-white/10 font-semibold py-1 px-2.5 rounded text-xs flex items-center justify-center">
            Go
          </a>
        </div>
      `;

      stationMarker.bindPopup(popupHtml, {
        offset: [0, -25],
        closeButton: true,
        className: 'custom-leaflet-popup',
      });

      // Handle popup interactions
      stationMarker.on('popupopen', () => {
        const btn = document.getElementById(`popup-detail-btn-${station.id}`);
        if (btn) {
          btn.onclick = () => onSelectStation(station);
        }
      });

      stationMarker.on('click', () => {
        onSelectStation(station);
      });
    });
  }, [stations, selectedStation, radiusMeters]);

  // Center on Selected Station when clicked externally
  useEffect(() => {
    if (!selectedStation || !mapInstanceRef.current) return;
    mapInstanceRef.current.panTo([selectedStation.latitude, selectedStation.longitude], {
      animate: true,
      duration: 0.5,
    });
  }, [selectedStation]);

  const fitZoneBounds = () => {
    if (!mapInstanceRef.current || !circleRadiusRef.current) return;
    mapInstanceRef.current.fitBounds(circleRadiusRef.current.getBounds(), {
      padding: [40, 40],
      animate: true,
    });
  };

  const recenterOnTarget = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([target.latitude, target.longitude], 15, {
      animate: true,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-white/10 bg-[#0F1115] shadow-2xl">
      
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        id="leaflet-ev-map"
        className="w-full h-full z-10 focus:outline-none"
      />

      {/* Floating Map Controls Top-Right */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        
        {/* Layer Theme Switcher */}
        <button
          onClick={() => {
            const next: TileLayerTheme = tileTheme === 'dark' ? 'voyager' : tileTheme === 'voyager' ? 'osm' : 'dark';
            setTileTheme(next);
          }}
          className="p-2.5 rounded-lg bg-[#13161C]/90 dark:bg-[#13161C]/90 light:bg-white/90 hover:bg-[#181c24] dark:hover:bg-[#181c24] light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg backdrop-blur-md transition-all active:scale-95 text-xs flex items-center justify-center"
          title={`Switch map theme (Current: ${tileTheme})`}
        >
          <Layers className="w-4 h-4 text-zinc-300 dark:text-zinc-300 light:text-slate-700" />
        </button>

        {/* Fit 500m Zone Boundary */}
        <button
          onClick={fitZoneBounds}
          className="p-2.5 rounded-lg bg-[#13161C]/90 dark:bg-[#13161C]/90 light:bg-white/90 hover:bg-[#181c24] dark:hover:bg-[#181c24] light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Fit 500m zone boundary in view"
        >
          <Maximize2 className="w-4 h-4 text-zinc-300 dark:text-zinc-300 light:text-slate-700" />
        </button>

        {/* Recenter Target */}
        <button
          onClick={recenterOnTarget}
          className="p-2.5 rounded-lg bg-[#13161C]/90 dark:bg-[#13161C]/90 light:bg-white/90 hover:bg-[#181c24] dark:hover:bg-[#181c24] light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Recenter on search location"
        >
          <Compass className="w-4 h-4 text-zinc-300 dark:text-zinc-300 light:text-slate-700" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-lg bg-[#13161C]/90 dark:bg-[#13161C]/90 light:bg-white/90 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg backdrop-blur-md overflow-hidden">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 hover:bg-[#181c24] dark:hover:bg-[#181c24] light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 transition-colors border-b border-white/10 dark:border-white/10 light:border-slate-200"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 hover:bg-[#181c24] dark:hover:bg-[#181c24] light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Floating Legend Overlay Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-20 bg-[#13161C]/90 dark:bg-[#13161C]/90 light:bg-white/90 backdrop-blur-md border border-white/10 dark:border-white/10 light:border-slate-200 px-3 py-2 rounded-lg shadow-lg text-[11px] flex flex-wrap items-center gap-3 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium">Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-600 dark:bg-zinc-600 light:bg-slate-400"></span>
          <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 font-medium">Offline</span>
        </div>
        <div className="h-3 w-px bg-white/10 dark:bg-white/10 light:bg-slate-200 hidden sm:block"></div>
        <div className="flex items-center gap-1 text-emerald-500 font-medium hidden sm:flex">
          <CircleDot className="w-3 h-3" />
          <span>500m Ring</span>
        </div>
      </div>

    </div>
  );
};

function getTileUrl(theme: TileLayerTheme): string {
  switch (theme) {
    case 'dark':
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    case 'voyager':
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    case 'osm':
    default:
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }
}
