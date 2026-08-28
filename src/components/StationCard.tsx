import React from 'react';
import { 
  Zap, 
  MapPin, 
  Footprints, 
  Clock, 
  Navigation, 
  ArrowRight,
  Flame,
  MessageSquare
} from 'lucide-react';
import { ChargingStation } from '../types';
import { formatDistance, formatWalkingEta } from '../utils/geo';

interface StationCardProps {
  station: ChargingStation;
  isSelected: boolean;
  onSelect: (station: ChargingStation) => void;
  radiusMeters: number;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isSelected,
  onSelect,
  radiusMeters,
}) => {
  const isWithin500m = (station.distanceMeters ?? Infinity) <= radiusMeters;
  const isAllOccupied = station.availableBays === 0;

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/station/${station.id}`
    : `https://ev-charging-x.vercel.app/station/${station.id}`;

  return (
    <div
      id={`station-card-${station.id}`}
      onClick={() => onSelect(station)}
      className={`group relative rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
        isSelected
          ? 'bg-[#13161C] dark:bg-[#13161C] light:bg-white border-white dark:border-white light:border-slate-900 ring-1 ring-white/40 dark:ring-white/40 light:ring-slate-900/20 shadow-2xl scale-[1.01]'
          : 'bg-[#13161C] dark:bg-[#13161C] light:bg-white hover:bg-[#181c24] dark:hover:bg-[#181c24] light:hover:bg-slate-50/80 border-white/10 dark:border-white/10 light:border-slate-200 hover:border-white/25 dark:hover:border-white/25 light:hover:border-slate-300 shadow-lg light:shadow-sm'
      }`}
    >
      {/* 500m Strict Zone Catchment Pill */}
      {isWithin500m && (
        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-black light:bg-emerald-400"></span>
          Inside 500m Zone
        </div>
      )}

      {/* Header: Operator & Live Availability Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-200 dark:text-zinc-200 light:text-slate-800 border border-white/10 dark:border-white/10 light:border-slate-200 uppercase tracking-wider">
            {station.operator}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 border border-white/5 dark:border-white/5 light:border-slate-200">
            {station.carparkType}
          </span>
        </div>

        {/* Live Availability Pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold font-mono ${
          isAllOccupied
            ? 'bg-amber-950/30 dark:bg-amber-950/30 light:bg-amber-50 text-amber-300 dark:text-amber-300 light:text-amber-700 border border-amber-800/40 dark:border-amber-800/40 light:border-amber-200'
            : 'bg-emerald-950/30 dark:bg-emerald-950/30 light:bg-emerald-50 text-emerald-300 dark:text-emerald-300 light:text-emerald-700 border border-emerald-800/40 dark:border-emerald-800/40 light:border-emerald-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAllOccupied ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
          <span>
            {station.availableBays} / {station.totalBays} Free
          </span>
        </div>
      </div>

      {/* Station Name & Address */}
      <div className="mt-2.5">
        <h3 className="text-sm font-bold text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900 group-hover:text-white dark:group-hover:text-white light:group-hover:text-slate-950 transition-colors leading-snug line-clamp-1">
          {station.name}
        </h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 flex items-start gap-1 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-500 light:text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{station.address}</span>
        </p>
      </div>

      {/* Connectors & Power Speed Badges */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {station.connectors.map((c) => {
          const isDC = c.currentType === 'DC';
          return (
            <div
              key={c.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border-white/10 dark:border-white/10 light:border-slate-200"
            >
              {isDC ? <Flame className="w-3 h-3 text-amber-400 light:text-amber-600" /> : <Zap className="w-3 h-3 text-zinc-400 light:text-slate-500" />}
              <span className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-900">{c.type}</span>
              <span className="opacity-75 font-mono text-[11px]">{c.powerKw}kW</span>
              <span className="text-[10px] px-1 rounded bg-black/50 dark:bg-black/50 light:bg-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono">
                {c.available}/{c.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Distance, Walking ETA & Pricing Footer */}
      <div className="mt-3.5 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex items-center justify-between gap-2 text-xs">
        
        {/* Distance + ETA */}
        <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-slate-700">
          <div className="flex items-center gap-1 font-bold text-white dark:text-white light:text-slate-900">
            <Footprints className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
            <span>{formatDistance(station.distanceMeters ?? 0)}</span>
          </div>
          <span className="text-zinc-600 dark:text-zinc-600 light:text-slate-300">•</span>
          <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500">
            {formatWalkingEta(station.distanceMeters ?? 0)}
          </span>
        </div>

        {/* Price / Rate indicator */}
        <div className="text-right">
          <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-900 font-bold font-mono">
            ${station.pricingInfo.perKwh.toFixed(2)}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-normal">/kWh</span>
        </div>

      </div>

      {/* Action Strip on hover/focus */}
      <div className="mt-3 pt-2.5 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-500 dark:text-zinc-500 light:text-slate-400" />
            {station.operatingHours}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors">
            <MessageSquare className="w-3 h-3 text-zinc-500" />
            <span>Community</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 hover:border-white/20 dark:hover:border-white/20 light:hover:border-slate-300 text-xs uppercase tracking-wider font-semibold flex items-center gap-1 transition-colors"
            title="Open in Google Maps Directions"
          >
            <Navigation className="w-3 h-3 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
            <span>Directions</span>
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(station);
            }}
            className="px-3 py-1 rounded bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-sm"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
};
