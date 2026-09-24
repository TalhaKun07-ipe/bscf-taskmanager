'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  SearchMagnifierIcon,
  CloseCrossIcon,
  KanbanIcon,
  TableGridIcon,
  CalendarDateIcon,
  DocsNotebookIcon,
  TeamGroupIcon,
  CheckSquarePastelIcon,
  FolderInitiativeIcon,
  ArrowRightChunkyIcon
} from '@/components/icons/CustomStyleIcons';

export default function QuickFindModal({
  isOpen,
  onClose,
  tasks = [],
  projects = [],
  docs = [],
  members = [],
  onSelectView,
  onSelectProject,
  onSelectDoc,
  onOpenTaskModal
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const views = [
    { id: 'board', title: 'Kanban Board', category: 'Views', icon: KanbanIcon, action: () => onSelectView('board') },
    { id: 'table', title: 'Table Grid', category: 'Views', icon: TableGridIcon, action: () => onSelectView('table') },
    { id: 'calendar', title: 'Calendar & Schedule', category: 'Views', icon: CalendarDateIcon, action: () => onSelectView('calendar') },
    { id: 'docs', title: 'Documentation & Notes', category: 'Views', icon: DocsNotebookIcon, action: () => onSelectView('docs') },
    { id: 'allocation', title: 'Committee & Team Directory', category: 'Views', icon: TeamGroupIcon, action: () => onSelectView('allocation') }
  ];

  // Build searchable items
  const allItems = [
    ...views.map((v) => ({
      type: 'view',
      id: v.id,
      title: v.title,
      subtitle: 'Workspace View',
      icon: v.icon,
      action: v.action
    })),
    ...projects.map((p) => ({
      type: 'project',
      id: p._id,
      title: p.name,
      subtitle: `Initiative [${p.key || 'BSCF'}]`,
      color: p.color,
      icon: FolderInitiativeIcon,
      action: () => {
        onSelectProject(p._id);
        onSelectView('board');
      }
    })),
    ...docs.map((d) => ({
      type: 'doc',
      id: d.id,
      title: d.title,
      subtitle: 'Document Page',
      iconEmoji: d.icon || '📄',
      action: () => {
        onSelectDoc(d.id);
        onSelectView('docs');
      }
    })),
    ...tasks.map((t) => ({
      type: 'task',
      id: t._id,
      title: t.title,
      subtitle: `Task · ${t.status?.replace('_', ' ')} · ${t.priority}`,
      icon: CheckSquarePastelIcon,
      action: () => onOpenTaskModal(t)
    })),
    ...members.map((m) => ({
      type: 'member',
      id: m._id,
      title: m.name,
      subtitle: `${m.role} · ${m.network || 'Core Team'}`,
      avatar: m.avatar,
      action: () => onSelectView('allocation')
    }))
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? allItems.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q)
      )
    : allItems.slice(0, 12);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filtered[selectedIndex];
      if (current) {
        current.action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-zinc-200/80 flex items-center gap-3 bg-zinc-50/50">
          <SearchMagnifierIcon className="w-4 h-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, task, document, initiative or member..."
            className="flex-1 text-xs bg-transparent text-zinc-900 focus:outline-none placeholder:text-zinc-400 font-medium"
          />
          <kbd className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const Icon = item.icon;

            return (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-orange-50 text-orange-900 border border-orange-200/80 font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.title}
                      className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-black/10"
                    />
                  ) : item.iconEmoji ? (
                    <span className="text-base shrink-0">{item.iconEmoji}</span>
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {Icon && <Icon className="w-4 h-4" />}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{item.title}</div>
                    <div className="text-[10px] text-zinc-400 truncate font-normal">{item.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
                  {isSelected && <ArrowRightChunkyIcon className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No matching items found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer tips */}
        <div className="p-2.5 border-t border-zinc-100 bg-zinc-50/60 text-[10.5px] text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="font-mono bg-white px-1 py-0.2 rounded border border-zinc-200">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.2 rounded border border-zinc-200">↓</kbd></span>
            <span>Select <kbd className="font-mono bg-white px-1 py-0.2 rounded border border-zinc-200">↵</kbd></span>
          </div>
          <span>BSCF Workspace Quick Find</span>
        </div>
      </div>
    </div>
  );
}
