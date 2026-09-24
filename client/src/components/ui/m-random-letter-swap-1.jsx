"use client";

import React from "react";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { cn } from "@/lib/utils";

export default function RandomLetterSwapNav({
  tabs = [],
  activeTab,
  onSelectTab,
  className
}) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200/80 shadow-inner shrink-0",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab && onSelectTab(tab.id)}
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer",
              isActive
                ? "bg-white text-orange-600 shadow-2xs border border-zinc-200"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isActive ? "text-orange-500" : "text-zinc-500"
                )}
              />
            )}
            <RandomLetterSwap
              label={tab.label}
              className={cn(
                "cursor-pointer font-medium text-xs",
                isActive ? "text-orange-600 font-semibold" : "text-zinc-600"
              )}
              staggerDuration={0.025}
              transition={{ duration: 0.5, type: "spring" }}
            />
          </button>
        );
      })}
    </nav>
  );
}
