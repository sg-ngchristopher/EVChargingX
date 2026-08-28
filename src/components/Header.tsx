import React from 'react';
import { 
  Zap, 
  MapPin, 
  Navigation, 
  RefreshCw, 
  CircleDot,
  Sun,
  Moon
} from 'lucide-react';
import { LocationMode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  mode: LocationMode;
  onModeChange: (mode: LocationMode) => void;
  onNearMeClick: () => void;
  isLocating: boolean;
  radiusMeters: number;
  onRadiusChange: (radius: number) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  lastRefreshedTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onNearMeClick,
  isLocating,
  radiusMeters,
  onRadiusChange,
  onRefreshData,
  isRefreshing,
  lastRefreshedTime,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-[#0F1115]/95 dark:bg-[#0F1115]/95 light:bg-white/95 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-slate-200 sticky top-0 z-30 px-4 py-3 sm:px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Brand & Live status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tighter uppercase text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900 flex items-center gap-2">
                SG EV Charger Finder
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 dark:bg-white/5 light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 font-mono uppercase tracking-widest hidden sm:inline-block">
                  Live SG Grid
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Strict 500m zone boundary • Updated {lastRefreshedTime}
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#13161C] dark:bg-[#13161C] light:bg-slate-100 p-1 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200 text-xs">
            <button
              id="mode-near-me-btn"
              onClick={() => {
                onModeChange('near_me');
                onNearMeClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all ${
                mode === 'near_me'
                  ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
              title="Locate chargers near your current position"
            >
              <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              <span>Near Me</span>
            </button>
            <button
              id="mode-search-btn"
              onClick={() => onModeChange('search_destination')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all ${
                mode === 'search_destination'
                  ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
              title="Search by Singapore postal code or address"
            >
              <MapPin className="w-3 h-3" />
              <span>Search Destination</span>
            </button>
          </div>

          {/* Radius Selector Tag */}
          <div className="flex items-center bg-[#13161C] dark:bg-[#13161C] light:bg-slate-100 px-3 py-1.5 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700">
            <CircleDot className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-slate-500 mr-1.5" />
            <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 mr-1.5 uppercase tracking-wider text-[10px]">Radius:</span>
            <select
              value={radiusMeters}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              aria-label="Filter Radius"
              className="bg-transparent text-white dark:text-white light:text-slate-900 font-mono font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="500" className="bg-[#13161C] text-white">500m (Strict)</option>
              <option value="1000" className="bg-[#13161C] text-white">1.0 km</option>
              <option value="2000" className="bg-[#13161C] text-white">2.0 km</option>
              <option value="5000" className="bg-[#13161C] text-white">5.0 km (All)</option>
            </select>
          </div>

          {/* Real-time Refresh Sync Button */}
          <button
            id="refresh-data-btn"
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#13161C] dark:bg-[#13161C] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs uppercase tracking-wider font-semibold transition-all active:scale-95 disabled:opacity-50"
            title="Simulate / Poll live LTA DataMall & CPO availability"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white dark:text-white light:text-slate-900' : 'text-zinc-400 dark:text-zinc-400 light:text-slate-500'}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#13161C] dark:bg-[#13161C] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs uppercase tracking-wider font-semibold transition-all active:scale-95 shadow-sm"
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
