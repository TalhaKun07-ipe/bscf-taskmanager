'use client';

import React from 'react';
import {
  KanbanIcon,
  TableGridIcon,
  CalendarDateIcon,
  DocsNotebookIcon,
  TeamGroupIcon,
  SearchMagnifierIcon,
  CloseCrossIcon
} from '@/components/icons/CustomStyleIcons';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function Header({
  activeView,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  selectedProjectObj,
  taskCount = 0,
  onOpenCreateTask,
  onOpenCreateDoc
}) {
  const viewInfo = {
    board: { label: 'Kanban Board', icon: KanbanIcon, desc: 'Visual task pipeline' },
    table: { label: 'Table Grid', icon: TableGridIcon, desc: 'Structured database view' },
    calendar: { label: 'Calendar', icon: CalendarDateIcon, desc: 'Timeline & scheduling' },
    docs: { label: 'Documentation', icon: DocsNotebookIcon, desc: 'Pages & notes workspace' },
    allocation: { label: 'Committee & Team', icon: TeamGroupIcon, desc: 'Member roster & assigned tasks' }
  };

  const currentView = viewInfo[activeView] || viewInfo.board;
  const ActiveIcon = currentView.icon;

  return (
    <header className="h-14 bg-white/95 px-4 sm:px-6 flex items-center justify-between gap-3 border-b border-zinc-200/80 shrink-0 select-none z-10 shadow-2xs backdrop-blur-md min-w-0">
      {/* Left: Active View Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center justify-center shrink-0 shadow-2xs p-1">
          {selectedProjectObj ? (
            <span
              className="w-3.5 h-3.5 rounded-full ring-2 ring-black/10"
              style={{ backgroundColor: selectedProjectObj.color || '#ea580c' }}
            ></span>
          ) : (
            <ActiveIcon className="w-5 h-5" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-zinc-900 tracking-tight truncate">
              {selectedProjectObj ? selectedProjectObj.name : currentView.label}
            </h2>
            {selectedProjectObj?.key && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold">
                {selectedProjectObj.key}
              </span>
            )}
          </div>
          <p className="text-[10px] font-medium text-zinc-500 truncate hidden sm:block">
            {selectedProjectObj
              ? `Initiative Pipeline • ${taskCount} task${taskCount === 1 ? '' : 's'} assigned`
              : currentView.desc}
          </p>
        </div>
      </div>

      {/* Right: Search, Priority & Action Button */}
      <div className="flex items-center gap-2 shrink-0 justify-end">
        {/* Search Bar */}
        <div className="relative shrink-0">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchMagnifierIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-28 sm:w-36 md:w-48 text-xs bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-zinc-400 shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <CloseCrossIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        {activeView !== 'docs' && (
          <div className="shrink-0">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter tasks by priority"
              className="text-xs bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 shadow-2xs cursor-pointer"
            >
              <option value="">Priority: All</option>
              <option value="urgent">🔥 Urgent</option>
              <option value="high">🔺 High</option>
              <option value="medium">🔹 Medium</option>
              <option value="low">▫️ Low</option>
            </select>
          </div>
        )}

        {/* New Task Interactive Hover Button (hidden on docs view since Docs has its own New button) */}
        {activeView !== 'docs' && (
          <div className="shrink-0">
            <InteractiveHoverButton
              text="New Task"
              onClick={onOpenCreateTask}
              className="border-orange-500/40 text-orange-800 hover:border-orange-600 bg-orange-50/50"
            />
          </div>
        )}
      </div>
    </header>
  );
}
