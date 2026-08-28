import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  X, 
  Sparkles, 
  Loader2, 
  Building2,
  ChevronRight
} from 'lucide-react';
import { SearchTarget, LocationMode } from '../types';
import { searchSingaporeAddress, POPULAR_SG_LOCATIONS } from '../services/onemap';

interface SearchControlProps {
  currentTarget: SearchTarget;
  onSelectTarget: (target: SearchTarget) => void;
  mode: LocationMode;
  onModeChange: (mode: LocationMode) => void;
  onTriggerNearMe: () => void;
  isLocating: boolean;
  locationError: string | null;
}

export const SearchControl: React.FC<SearchControlProps> = ({
  currentTarget,
  onSelectTarget,
  mode,
  onModeChange,
  onTriggerNearMe,
  isLocating,
  locationError,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchTarget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchSingaporeAddress(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (target: SearchTarget) => {
    onSelectTarget(target);
    setQuery('');
    setIsOpen(false);
    onModeChange('search_destination');
  };

  const handleInstantSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // If suggestions are already available, use top suggestion
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    // Direct instant search
    setIsLoading(true);
    try {
      const results = await searchSingaporeAddress(trimmed);
      if (results.length > 0) {
        handleSelect(results[0]);
      }
    } catch (err) {
      console.error('Instant search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-20 w-full" ref={dropdownRef}>
      <div className="bg-[#13161C] dark:bg-[#13161C] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-xl p-3 shadow-2xl light:shadow-sm transition-colors duration-200">
        
        {/* Search input container */}
        <form onSubmit={handleInstantSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          <div className="relative flex-1">
            <button
              type="submit"
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 dark:text-zinc-400 light:text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
              title="Search address or postal code"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <input
              id="sg-destination-search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInstantSubmit();
                }
              }}
              onFocus={() => {
                if (query.trim() || suggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              placeholder="Enter SG postal code (e.g. 018956, 528523, 730900) or address..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 rounded-lg text-sm text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900 placeholder-zinc-500 dark:placeholder-zinc-500 light:placeholder-slate-400 focus:outline-none focus:border-white/40 dark:focus:border-white/40 light:focus:border-slate-400 focus:ring-1 focus:ring-white/40 dark:focus:ring-white/40 light:focus:ring-slate-400 transition-all font-sans"
            />

            {isLoading ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-300 dark:text-white light:text-slate-700" />
              </div>
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 dark:text-zinc-400 light:text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Quick Search Action Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
          >
            <span>Search</span>
          </button>

          {/* Quick "Near Me" button */}
          <button
            type="button"
            id="quick-near-me-btn"
            onClick={onTriggerNearMe}
            disabled={isLocating}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all shadow-sm ${
              mode === 'near_me'
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200'
            }`}
            title="Use current GPS location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap">
              {isLocating ? 'Locating...' : 'Use My GPS'}
            </span>
          </button>
        </form>

        {/* Location Error Warning if any */}
        {locationError && (
          <div className="mt-2 px-3 py-1.5 bg-rose-950/30 dark:bg-rose-950/30 light:bg-rose-50 border border-rose-800/40 dark:border-rose-800/40 light:border-rose-200 rounded-lg text-xs text-rose-300 dark:text-rose-300 light:text-rose-700 flex items-center justify-between">
            <span>{locationError}</span>
            <span className="text-zinc-500 dark:text-zinc-500 light:text-rose-500 text-[11px]">Using fallback location</span>
          </div>
        )}

        {/* Current Active Target Display */}
        <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 uppercase tracking-widest text-[10px]">Center:</span>
            <span className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800 truncate">
              {currentTarget.label}
            </span>
            {currentTarget.postalCode && (
              <span className="px-1.5 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 text-[10px] font-mono">
                S({currentTarget.postalCode})
              </span>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono hidden sm:inline">
            [{currentTarget.latitude.toFixed(4)}, {currentTarget.longitude.toFixed(4)}]
          </span>
        </div>

        {/* Quick Location Preset Pills */}
        <div className="mt-2.5 pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 uppercase tracking-widest font-semibold whitespace-nowrap mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-zinc-400 dark:text-zinc-400 light:text-slate-500" /> Hotspots:
          </span>
          {POPULAR_SG_LOCATIONS.slice(0, 6).map((preset) => {
            const isSelected = currentTarget.label === preset.label;
            return (
              <button
                key={preset.label}
                id={`preset-${preset.postalCode}`}
                onClick={() => handleSelect(preset)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white font-bold shadow-sm'
                    : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800/80 dark:hover:bg-zinc-800/80 light:hover:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-200'
                }`}
              >
                <span>{preset.label.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Autocomplete Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#13161C] dark:bg-[#13161C] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5 dark:divide-white/5 light:divide-slate-100">
          <div className="px-3 py-2 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 text-[10px] uppercase tracking-widest font-semibold text-zinc-500 dark:text-zinc-500 light:text-slate-500 flex items-center justify-between border-b border-white/5 dark:border-white/5 light:border-slate-200">
            <span>ONE MAP & SG POSTAL RESULTS</span>
            <span className="font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-600">{suggestions.length} Found</span>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((item, idx) => (
              <button
                key={`${item.label}-${idx}`}
                onClick={() => handleSelect(item)}
                className="w-full px-3.5 py-2.5 text-left hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 group-hover:border-white/30 group-hover:text-white dark:group-hover:text-white light:group-hover:text-slate-900 transition-colors mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-100 dark:text-zinc-100 light:text-slate-900 group-hover:text-white dark:group-hover:text-white light:group-hover:text-slate-950 truncate">
                      {item.label}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-500 truncate">
                      {item.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {item.postalCode && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200">
                      {item.postalCode}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-600 light:text-slate-400 group-hover:text-white dark:group-hover:text-white light:group-hover:text-slate-900 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
