import React, { useState } from 'react';
import { MessageSquare, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { ChargingStation } from '../types';

interface StationCommentsProps {
  station: ChargingStation;
  shortname?: string;
}

export const StationComments: React.FC<StationCommentsProps> = ({ 
  station, 
  shortname = 'evchargingx' 
}) => {
  const [reloadKey, setReloadKey] = useState(0);

  const locId = `station-${station.id}`;
  const locTitle = `${station.name} (${station.operator}) - SG EV Charging`;
  const embedSrc = `/disqus-embed.html?shortname=${shortname}&id=${encodeURIComponent(locId)}&title=${encodeURIComponent(locTitle)}`;

  return (
    <div id={`disqus-comments-${station.id}`} className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700">
              Community Reviews & Live Driver Feed
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-500">
              Share real-time charger status, ICE-ing alerts, and parking tips
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <a
            href={`https://${shortname}.disqus.com`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-white border border-white/10 transition-colors"
          >
            <span>Disqus</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-[#0F1115] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
            title="Reload comments frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Discussion Box Container */}
      <div className="p-3 sm:p-4 rounded-xl bg-white text-slate-900 border border-white/10 shadow-inner overflow-hidden min-h-[300px]">
        <iframe
          key={`${locId}-${reloadKey}`}
          src={embedSrc}
          title={`Disqus Comments for ${station.name}`}
          className="w-full min-h-[360px] md:min-h-[420px] border-0 bg-transparent"
          loading="lazy"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Live community moderation & driver updates
        </span>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh Thread</span>
        </button>
      </div>
    </div>
  );
};
