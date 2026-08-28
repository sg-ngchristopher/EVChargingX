import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  CircleDot, 
  Zap, 
  Footprints, 
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ChargingStation, SearchTarget } from '../types';
import { calculateRadiusStats, formatDistance, formatWalkingEta } from '../utils/geo';

interface RadiusStatsBannerProps {
  stations: ChargingStation[];
  target: SearchTarget;
  radiusMeters: number;
  onFocusMapZone: () => void;
  onSelectStation: (station: ChargingStation) => void;
}

export const RadiusStatsBanner: React.FC<RadiusStatsBannerProps> = ({
  stations,
  target,
  radiusMeters,
  onFocusMapZone,
  onSelectStation,
}) => {
  const stats = calculateRadiusStats(stations, radiusMeters);
  const closestStation = stats.withinZoneStations.length > 0
    ? [...stats.withinZoneStations].sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0))[0]
    : null;

  const is500mStrict = radiusMeters === 500;

  return (
    <section 
      id="zone-radius-summary-card"
      aria-label="Zone summary"
      className="bg-[#13161C] dark:bg-[#13161C] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xl light:shadow-sm relative overflow-hidden transition-colors duration-200"
    >
      {/* Subtle background radar ripple aesthetic */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-500/[0.03] rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-300 light:text-slate-800 flex items-center gap-1.5">
            <CircleDot className="w-3.5 h-3.5 text-emerald-500" />
            {is500mStrict ? 'Strict 500m Zone Boundary' : `${radiusMeters}m Catchment Zone`}
          </div>
        </div>

        <button
          id="focus-zone-map-btn"
          onClick={onFocusMapZone}
          className="text-xs uppercase tracking-wider font-bold text-white dark:text-white light:text-slate-900 hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-slate-700 flex items-center gap-1.5 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-200 px-3 py-1.5 rounded transition-all"
        >
          <span>Fit Zone on Map</span>
          <ArrowRight className="w-3 h-3 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        
        {/* Metric 1: Aggregate Availability */}
        <div className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-medium flex items-center justify-between">
            <span>Aggregate Availability</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-light tracking-tighter text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900">
              {stats.availableBays}
            </span>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-500 uppercase tracking-wider">
              of {stats.totalBays} Bays Free
            </span>
          </div>
          <div className="mt-1 text-xs text-emerald-500 font-semibold">
            {stats.totalBays > 0 ? `${stats.availabilityRate}% Ready for Charging` : 'No bays in zone'}
          </div>
        </div>

        {/* Metric 2: Charging Hubs in Zone */}
        <div className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-medium flex items-center justify-between">
            <span>Charging Hubs</span>
            <Zap className="w-4 h-4 text-zinc-300 dark:text-zinc-300 light:text-slate-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-light tracking-tighter text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900">
              {stats.totalStations}
            </span>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-500 uppercase tracking-wider">
              Hub{stats.totalStations === 1 ? '' : 's'} in 500m
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
            {stats.totalStations > 0 ? 'Within ~6 min walk radius' : 'Expand radius or change location'}
          </div>
        </div>

        {/* Metric 3: DC Fast Charging Available */}
        <div className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-medium flex items-center justify-between">
            <span>DC Fast (≥50kW)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-light tracking-tighter text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900">
              {stats.fastChargersAvailable}
            </span>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-500 uppercase tracking-wider">
              of {stats.totalFastChargers} Fast Plugs
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
            CCS2 High-power rapid ports
          </div>
        </div>

      </div>

      {/* Availability Breakdown Bar */}
      <div className="mt-3 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-200">
        <div className="flex items-center justify-between text-xs mb-1.5 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-800">500m Bay Status Breakdown:</span>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <span className="w-2 h-2 rounded-sm bg-emerald-500"></span>
              {stats.availableBays} Free
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <span className="w-2 h-2 rounded-sm bg-amber-500"></span>
              {stats.occupiedBays} In Use
            </span>
            {stats.offlineBays > 0 && (
              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                <span className="w-2 h-2 rounded-sm bg-zinc-400"></span>
                {stats.offlineBays} Offline
              </span>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-200 border border-white/5 dark:border-white/5 light:border-slate-200 rounded-full overflow-hidden flex">
          {stats.totalBays > 0 ? (
            <>
              <div 
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${(stats.availableBays / stats.totalBays) * 100}%` }}
                title={`${stats.availableBays} Available`}
              />
              <div 
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${(stats.occupiedBays / stats.totalBays) * 100}%` }}
                title={`${stats.occupiedBays} Occupied`}
              />
              <div 
                className="bg-zinc-700 dark:bg-zinc-700 light:bg-slate-400 h-full transition-all duration-500"
                style={{ width: `${(stats.offlineBays / stats.totalBays) * 100}%` }}
                title={`${stats.offlineBays} Offline`}
              />
            </>
          ) : (
            <div className="w-full bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-center text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 py-0.5">
              0 Bays in 500m
            </div>
          )}
        </div>
      </div>

      {/* Closest Station Prompt */}
      {closestStation && (
        <div className="mt-3 pt-2.5 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-slate-700">
            <Footprints className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-slate-500 flex-shrink-0" />
            <span>
              Nearest: <strong className="text-white dark:text-white light:text-slate-900">{closestStation.name}</strong> ({formatDistance(closestStation.distanceMeters ?? 0)})
            </span>
            <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 hidden md:inline">
              • {formatWalkingEta(closestStation.distanceMeters ?? 0)}
            </span>
          </div>

          <button
            onClick={() => onSelectStation(closestStation)}
            className="text-xs uppercase tracking-wider font-bold text-white dark:text-white light:text-slate-900 hover:text-zinc-300 dark:hover:text-zinc-300 light:hover:text-slate-700 flex items-center gap-1 transition-colors"
          >
            <span>View Bays ({closestStation.availableBays}/{closestStation.totalBays} free)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {stats.totalStations === 0 && (
        <div className="mt-2 p-2.5 bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50 border border-amber-800/30 dark:border-amber-800/30 light:border-amber-200 rounded-lg text-xs text-amber-200 dark:text-amber-200 light:text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            No EV chargers detected within 500m of <strong>{target.label}</strong>. You can expand the radius to 1.0 km or pick a nearby destination.
          </span>
        </div>
      )}

    </section>
  );
};
