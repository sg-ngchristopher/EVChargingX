import React from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Check, 
  RotateCcw, 
  Zap, 
  Clock, 
  Umbrella,
  DollarSign
} from 'lucide-react';
import { ConnectorType, OperatorName, SortBy, FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  totalFilteredCount: number;
}

const ALL_OPERATORS: OperatorName[] = [
  'SP Mobility',
  'CDG ENGIE',
  'Charge+',
  'Shell Recharge',
  'TotalEnergies',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  totalFilteredCount,
}) => {
  const togglePlugType = (type: ConnectorType) => {
    const next = filters.plugTypes.includes(type)
      ? filters.plugTypes.filter((t) => t !== type)
      : [...filters.plugTypes, type];
    onFilterChange({ ...filters, plugTypes: next });
  };

  const toggleOperator = (op: OperatorName) => {
    const next = filters.operators.includes(op)
      ? filters.operators.filter((o) => o !== op)
      : [...filters.operators, op];
    onFilterChange({ ...filters, operators: next });
  };

  const handleResetFilters = () => {
    onFilterChange({
      ...filters,
      plugTypes: [],
      operators: [],
      availableOnly: false,
      minPowerKw: 0,
      only24Hours: false,
      onlySheltered: false,
    });
  };

  const hasActiveFilters =
    filters.plugTypes.length > 0 ||
    filters.operators.length > 0 ||
    filters.availableOnly ||
    filters.minPowerKw > 0 ||
    filters.only24Hours ||
    filters.onlySheltered;

  return (
    <div className="bg-[#13161C] dark:bg-[#13161C] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-xl p-3 shadow-md light:shadow-sm space-y-2.5 transition-colors duration-200">
      
      {/* Top row: Quick toggles & Sort dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Quick filters (Available only, DC Fast, 24/7) */}
        <div className="flex flex-wrap items-center gap-1.5">
          
          {/* Available Only Toggle */}
          <button
            id="filter-available-only"
            onClick={() => onFilterChange({ ...filters, availableOnly: !filters.availableOnly })}
            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all ${
              filters.availableOnly
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filters.availableOnly ? 'bg-black dark:bg-black light:bg-emerald-400' : 'bg-emerald-500'}`}></span>
            <span>Available Only</span>
          </button>

          {/* CCS2 (DC Fast) Filter */}
          <button
            id="filter-ccs2"
            onClick={() => togglePlugType('CCS2')}
            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all ${
              filters.plugTypes.includes('CCS2')
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>CCS2 (DC Fast)</span>
          </button>

          {/* Type 2 (AC) Filter */}
          <button
            id="filter-type2"
            onClick={() => togglePlugType('Type 2')}
            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all ${
              filters.plugTypes.includes('Type 2')
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200'
            }`}
          >
            <span>Type 2 (AC)</span>
          </button>

          {/* 50kW+ High Power Filter */}
          <button
            id="filter-power-50kw"
            onClick={() => onFilterChange({ ...filters, minPowerKw: filters.minPowerKw === 50 ? 0 : 50 })}
            className={`px-2.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium flex items-center gap-1 transition-all ${
              filters.minPowerKw === 50
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white font-bold'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200'
            }`}
          >
            <span>≥50kW Rapid</span>
          </button>

          {/* 24/7 Access */}
          <button
            id="filter-24h"
            onClick={() => onFilterChange({ ...filters, only24Hours: !filters.only24Hours })}
            className={`px-2.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium flex items-center gap-1 transition-all ${
              filters.only24Hours
                ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white font-bold'
                : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>24/7</span>
          </button>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-2 py-1.5 rounded-lg text-xs uppercase tracking-wider text-rose-400 hover:text-rose-300 dark:text-rose-400 light:text-rose-600 bg-rose-950/20 dark:bg-rose-950/20 light:bg-rose-50 border border-rose-800/40 dark:border-rose-800/40 light:border-rose-200 flex items-center gap-1 transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Right: Sort options */}
        <div className="flex items-center gap-1.5 ml-auto text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-500 light:text-slate-400" />
          <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-widest text-[10px]">Sort:</span>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            aria-label="Sort charging stations"
            className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-white/40 dark:focus:border-white/40 light:focus:border-slate-400 cursor-pointer font-medium"
          >
            <option value="distance" className="bg-[#13161C] text-white">Distance (Nearest First)</option>
            <option value="available_bays" className="bg-[#13161C] text-white">Available Bays (Most First)</option>
            <option value="max_power" className="bg-[#13161C] text-white">Power Rating (Highest kW)</option>
            <option value="price" className="bg-[#13161C] text-white">Price ($/kWh Lowest)</option>
          </select>
        </div>

      </div>

      {/* Operator Filter Row */}
      <div className="pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 uppercase tracking-widest font-semibold whitespace-nowrap mr-1">
          CPO Operators:
        </span>
        {ALL_OPERATORS.map((op) => {
          const isSelected = filters.operators.includes(op);
          return (
            <button
              key={op}
              id={`filter-op-${op.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => toggleOperator(op)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white font-bold shadow-sm'
                  : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-200'
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
              <span>{op}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
