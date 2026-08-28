import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  MapPin, 
  Footprints, 
  Clock, 
  Navigation, 
  ExternalLink, 
  Flame, 
  Calculator, 
  RefreshCw,
  Building2,
  MessageSquare
} from 'lucide-react';
import { ChargingStation, Connector } from '../types';
import { formatDistance, formatWalkingEta } from '../utils/geo';
import { StationComments } from './StationComments';

interface StationDetailModalProps {
  station: ChargingStation;
  onClose: () => void;
  radiusMeters: number;
  onToggleBayStatus: (stationId: string, connectorId: string) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
  radiusMeters,
  onToggleBayStatus,
}) => {
  const isWithin500m = (station.distanceMeters ?? Infinity) <= radiusMeters;
  const isAllOccupied = station.availableBays === 0;

  // Active view tab state: 'overview' | 'discussions'
  const [activeTab, setActiveTab] = useState<'overview' | 'discussions'>('overview');

  // Charging session calculator state
  const [batteryKwh, setBatteryKwh] = useState<number>(60); // standard EV battery (BYD Atto 3, Tesla Model 3)
  const [currentSoc, setCurrentSoc] = useState<number>(20);
  const [targetSoc, setTargetSoc] = useState<number>(80);
  const [selectedConnector, setSelectedConnector] = useState<Connector>(station.connectors[0]);

  // Calculate energy needed in kWh
  const socDiff = Math.max(0, targetSoc - currentSoc);
  const energyKwhNeeded = (batteryKwh * socDiff) / 100;
  const estimatedCost = energyKwhNeeded * selectedConnector.pricePerKwh;
  // Estimated charging time in minutes (accounting for taper above 80%)
  const effectivePowerKw = selectedConnector.powerKw;
  const rawChargingHours = energyKwhNeeded / effectivePowerKw;
  const estimatedMinutes = Math.round(rawChargingHours * 60 * 1.1); // 10% overhead factor

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/station/${station.id}`
    : `https://ev-charging-x.vercel.app/station/${station.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      
      <div 
        id="station-detail-dialog"
        className="bg-[#13161C] dark:bg-[#13161C] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900 divide-y divide-white/10 dark:divide-white/10 light:divide-slate-200 transition-colors duration-200"
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-800 border border-white/10 dark:border-white/10 light:border-slate-200 uppercase tracking-wider">
                  {station.operator}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 border border-white/5 dark:border-white/5 light:border-slate-200">
                  {station.carparkType}
                </span>
                {isWithin500m && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white uppercase tracking-wider">
                    Inside 500m Zone
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight uppercase">
                {station.name}
              </h2>

              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-500 light:text-slate-400 flex-shrink-0" />
                <span>{station.address}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200 transition-colors"
              title="Close details"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 p-2.5 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
              <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-widest block text-[10px]">Availability</span>
              <span className={`text-base font-bold font-mono ${isAllOccupied ? 'text-amber-400 light:text-amber-600' : 'text-emerald-400 light:text-emerald-600'}`}>
                {station.availableBays} / {station.totalBays} Free
              </span>
            </div>

            <div className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 p-2.5 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
              <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-widest block text-[10px]">Distance</span>
              <span className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono">
                {formatDistance(station.distanceMeters ?? 0)}
              </span>
            </div>

            <div className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 p-2.5 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
              <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-widest block text-[10px]">Walking ETA</span>
              <span className="text-base font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800">
                {formatWalkingEta(station.distanceMeters ?? 0)}
              </span>
            </div>

            <div className="bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 p-2.5 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
              <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-widest block text-[10px]">Rate</span>
              <span className="text-base font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-mono">
                ${station.pricingInfo.perKwh.toFixed(2)}/kWh
              </span>
            </div>
          </div>

          {/* Navigation Tabs between Overview and Disqus Discussions */}
          <div className="mt-4 flex items-center gap-2 border-b border-white/10 dark:border-white/10 light:border-slate-200 pt-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-white dark:border-white light:border-slate-900 text-white dark:text-white light:text-slate-900'
                  : 'border-transparent text-zinc-400 dark:text-zinc-400 light:text-slate-500 hover:text-zinc-200 dark:hover:text-zinc-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Specs & Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('discussions')}
              className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'discussions'
                  ? 'border-white dark:border-white light:border-slate-900 text-white dark:text-white light:text-slate-900'
                  : 'border-transparent text-zinc-400 dark:text-zinc-400 light:text-slate-500 hover:text-zinc-200 dark:hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Community & Reviews</span>
              <span className="px-1.5 py-0.2 rounded bg-white/10 dark:bg-white/10 light:bg-slate-200 text-[10px] font-mono">
                Live Feed
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'discussions' ? (
          /* Disqus Discussions Section */
          <div className="p-5 sm:p-6">
            <StationComments station={station} />
          </div>
        ) : (
          /* Standard Overview & Simulation View */
          <>
            {/* Connectors & Interactive Bay Simulation */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-300 light:text-slate-600" />
                  Charging Bays & Plugs ({station.connectors.length} Connector Types)
                </h3>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono uppercase tracking-wider">Click plug to simulate</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {station.connectors.map((connector) => {
                  const isDC = connector.currentType === 'DC';
                  const isSelected = selectedConnector.id === connector.id;

                  return (
                    <div
                      key={connector.id}
                      onClick={() => setSelectedConnector(connector)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#181c24] dark:bg-[#181c24] light:bg-slate-100 border-white dark:border-white light:border-slate-900 ring-1 ring-white/30 dark:ring-white/30 light:ring-slate-900/20'
                          : 'bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border-white/10 dark:border-white/10 light:border-slate-200 hover:border-white/20 dark:hover:border-white/20 light:hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-black/40 dark:bg-black/40 light:bg-white text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200">
                            {isDC ? <Flame className="w-4 h-4 text-amber-400 light:text-amber-600" /> : <Zap className="w-4 h-4 text-zinc-300 dark:text-zinc-300 light:text-slate-600" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white dark:text-white light:text-slate-900">{connector.type}</div>
                            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono">{connector.powerKw} kW ({connector.currentType})</div>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 font-mono">
                          ${connector.pricePerKwh.toFixed(2)}/kWh
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-200 text-xs">
                        <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                          Bays Free: <strong className="text-white dark:text-white light:text-slate-900 font-mono">{connector.available} of {connector.total}</strong>
                        </span>

                        {/* Simulation Toggle Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBayStatus(station.id, connector.id);
                          }}
                          className="px-2 py-1 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-[10px] uppercase tracking-wider font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center gap-1 transition-colors"
                          title="Simulate EV plug-in or unplug"
                        >
                          <RefreshCw className="w-3 h-3 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
                          <span>{connector.available > 0 ? 'Simulate Plug In' : 'Free Bay'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Charging Cost & Time Estimator */}
            <div className="p-5 sm:p-6 bg-[#0F1115]/50 dark:bg-[#0F1115]/50 light:bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-300 light:text-slate-600" />
                  Session Cost & Time Estimator
                </h3>
                <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono">
                  {selectedConnector.type} ({selectedConnector.powerKw}kW)
                </span>
              </div>

              {/* Sliders and presets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 block mb-1 uppercase tracking-wider text-[10px]">EV Battery Capacity</label>
                  <select
                    value={batteryKwh}
                    onChange={(e) => setBatteryKwh(Number(e.target.value))}
                    className="w-full bg-[#0F1115] dark:bg-[#0F1115] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-lg px-2.5 py-1.5 text-white dark:text-white light:text-slate-900 font-mono focus:outline-none focus:border-white/40 dark:focus:border-white/40 light:focus:border-slate-400"
                  >
                    <option value="45" className="bg-[#13161C] text-white">45 kWh (Small / BYD Dolphin)</option>
                    <option value="60" className="bg-[#13161C] text-white">60 kWh (Standard / Model 3)</option>
                    <option value="75" className="bg-[#13161C] text-white">75 kWh (Long Range / Model Y)</option>
                    <option value="100" className="bg-[#13161C] text-white">100 kWh (Taycan / EQS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 block mb-1 uppercase tracking-wider text-[10px]">Current SoC: {currentSoc}%</label>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="5"
                    value={currentSoc}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentSoc(val);
                      if (val >= targetSoc) setTargetSoc(Math.min(100, val + 10));
                    }}
                    className="w-full accent-white dark:accent-white light:accent-slate-900 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 block mb-1 uppercase tracking-wider text-[10px]">Target SoC: {targetSoc}%</label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={targetSoc}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTargetSoc(val);
                      if (val <= currentSoc) setCurrentSoc(Math.max(0, val - 10));
                    }}
                    className="w-full accent-white dark:accent-white light:accent-slate-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculator Output Banner */}
              <div className="p-3.5 bg-[#0F1115] dark:bg-[#0F1115] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 text-[10px] uppercase tracking-wider block">Energy Required</span>
                    <strong className="text-sm text-white dark:text-white light:text-slate-900 font-mono">{energyKwhNeeded.toFixed(1)} kWh</strong>
                  </div>
                  <div className="h-6 w-px bg-white/10 dark:bg-white/10 light:border-slate-200"></div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 text-[10px] uppercase tracking-wider block">Est. Charge Time</span>
                    <strong className="text-sm text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-mono">~{estimatedMinutes} mins</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 text-[10px] uppercase tracking-wider block">Estimated Cost</span>
                  <span className="text-xl font-light text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-950 font-mono tracking-tight">
                    ${estimatedCost.toFixed(2)} SGD
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Carpark Info */}
            <div className="p-5 sm:p-6 space-y-3 text-xs">
              <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
                Access & Parking Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                <div className="p-3 rounded-lg bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200">
                  <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-widest text-[10px] font-medium block">Parking Fee</span>
                  <span className="font-semibold text-white dark:text-white light:text-slate-900 mt-0.5 block">{station.pricingInfo.parkingFee}</span>
                  {station.pricingInfo.idleFee && (
                    <span className="text-amber-400 light:text-amber-600 text-[10px] font-mono mt-1 block">Idle Fee: {station.pricingInfo.idleFee}</span>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200">
                  <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-widest text-[10px] font-medium block">Operating Hours & Access</span>
                  <span className="font-semibold text-white dark:text-white light:text-slate-900 mt-0.5 block">{station.operatingHours}</span>
                  <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-[10px] mt-1 block">{station.accessType} Access • {station.isSheltered ? 'Sheltered Bay' : 'Open Air'}</span>
                </div>
              </div>

              {/* Amenities tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 text-[10px] uppercase tracking-wider mr-1">Nearby Amenities:</span>
                {station.amenities.map((am) => (
                  <span key={am} className="px-2 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200 text-[11px]">
                    {am}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Navigation & Action Footer */}
        <div className="p-4 sm:p-5 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-500 font-mono text-center sm:text-left">
            Sync: {station.lastUpdated}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://www.onemap.gov.sg/main/v2/?lat=${station.latitude}&lng=${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3 py-2 rounded bg-[#13161C] dark:bg-[#13161C] light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 text-zinc-200 dark:text-zinc-200 light:text-slate-800 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10 dark:border-white/10 light:border-slate-200"
            >
              <span>OneMap SG</span>
              <ExternalLink className="w-3 h-3 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2 rounded bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 fill-black dark:fill-black light:fill-white" />
              <span>Turn-by-Turn Navigation</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
