import React, { useState } from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { MessageSquare, Globe2, Sparkles, AlertCircle } from 'lucide-react';
import { ChargingStation } from '../types';
import { ErrorBoundary } from './ErrorBoundary';

interface StationCommentsProps {
  station: ChargingStation;
}

export const StationComments: React.FC<StationCommentsProps> = ({ station }) => {
  const [language, setLanguage] = useState<string>('en');

  // Stable identifier and canonical URL for this station's Disqus thread
  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/station/${station.id}`
    : `https://ev-charging-x.vercel.app/station/${station.id}`;
  
  const threadIdentifier = `station-${station.id}`;
  const threadTitle = `${station.name} (${station.operator}) - SG EV Charging Station`;

  const disqusConfig = {
    url: pageUrl,
    identifier: threadIdentifier,
    title: threadTitle,
    language: language,
  };

  return (
    <div id={`disqus-comments-${station.id}`} className="space-y-4">
      {/* Header & Language selector */}
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

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 px-2.5 py-1 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200 text-xs">
          <Globe2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-500">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-white dark:text-white light:text-slate-900 text-xs font-medium focus:outline-none cursor-pointer"
            aria-label="Discussion language"
          >
            <option value="en" className="bg-[#13161C] text-white">English</option>
            <option value="zh_TW" className="bg-[#13161C] text-white">繁體中文 (Taiwan / HK)</option>
            <option value="zh_CN" className="bg-[#13161C] text-white">简体中文</option>
            <option value="ms" className="bg-[#13161C] text-white">Bahasa Melayu</option>
            <option value="ta" className="bg-[#13161C] text-white">Tamil</option>
          </select>
        </div>
      </div>

      {/* Discussion Box Container */}
      <div className="p-4 sm:p-5 rounded-xl bg-white text-slate-900 border border-white/10 shadow-inner overflow-hidden min-h-[260px]">
        <ErrorBoundary
          fallback={
            <div className="p-4 text-center text-xs text-zinc-500 space-y-2">
              <p>Disqus community reviews are loading or restricted in this browser environment.</p>
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-medium"
              >
                Open Discussion in New Window
              </a>
            </div>
          }
        >
          <DiscussionEmbed
            shortname="evchargingx"
            config={disqusConfig}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};
