import React, { useState } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { X, MessageSquare, Globe2, Sparkles, Zap, Users } from 'lucide-react';

interface CommunityDiscussionModalProps {
  onClose: () => void;
}

export const CommunityDiscussionModal: React.FC<CommunityDiscussionModalProps> = ({ onClose }) => {
  const [language, setLanguage] = useState<string>('en');

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/community`
    : 'https://ev-charging-x.vercel.app/community';

  const disqusConfig = {
    url: pageUrl,
    identifier: 'sg-ev-community-general',
    title: 'Singapore EV Charging Community - General Discussion & Driver Tips',
    language: language,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="community-discussion-dialog"
        className="bg-[#13161C] dark:bg-[#13161C] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#F4F4F5] dark:text-[#F4F4F5] light:text-slate-900 divide-y divide-white/10 dark:divide-white/10 light:divide-slate-200 transition-colors duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white uppercase tracking-wider">
                  Disqus Community
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 border border-white/5 dark:border-white/5 light:border-slate-200">
                  Singapore EV Drivers
                </span>
              </div>
              <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight uppercase flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-300 dark:text-zinc-300 light:text-slate-700" />
                Singapore EV Charging Community Forum
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                Live feedback, tariff updates, CPO reliability reviews, and charging etiquette tips.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200 transition-colors"
              title="Close community forum"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Language selector bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0F1115] dark:bg-[#0F1115] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-300 light:text-slate-700" />
              <span>Powered by <strong>Disqus</strong> (@evchargingx)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#13161C] dark:bg-[#13161C] light:bg-white px-2.5 py-1 rounded border border-white/10 dark:border-white/10 light:border-slate-200">
              <Globe2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-slate-500" />
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white dark:text-white light:text-slate-900 text-xs font-medium focus:outline-none cursor-pointer"
                aria-label="Discussion language"
              >
                <option value="en" className="bg-[#13161C] text-white">English</option>
                <option value="zh_TW" className="bg-[#13161C] text-white">繁體中文 (Traditional Chinese)</option>
                <option value="zh_CN" className="bg-[#13161C] text-white">简体中文 (Simplified Chinese)</option>
                <option value="ms" className="bg-[#13161C] text-white">Bahasa Melayu</option>
                <option value="ta" className="bg-[#13161C] text-white">Tamil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disqus Embed Container */}
        <div className="p-5 sm:p-6 bg-white rounded-b-2xl text-slate-900 min-h-[350px]">
          <DiscussionEmbed
            shortname="evchargingx"
            config={disqusConfig}
          />
        </div>
      </div>
    </div>
  );
};
