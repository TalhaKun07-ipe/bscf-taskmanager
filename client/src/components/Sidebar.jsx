'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  KanbanIcon,
  TableGridIcon,
  CalendarDateIcon,
  DocsNotebookIcon,
  TeamGroupIcon,
  SearchMagnifierIcon,
  PlusAddIcon,
  TrashDeleteIcon,
  FolderInitiativeIcon,
  ArrowRightChunkyIcon
} from '@/components/icons/CustomStyleIcons';

// Interactive Hover Workspace Button for the sidebar in the new playful pastel style
function SidebarInteractiveButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  badge,
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl px-3 py-2 text-xs font-semibold shadow-2xs transition-all duration-300 cursor-pointer select-none text-left flex items-center justify-between border',
        isActive
          ? 'bg-orange-50 text-orange-950 border-orange-300 font-bold shadow-xs'
          : 'bg-white text-zinc-700 border-zinc-200/90 hover:border-orange-500 hover:shadow-xs',
        className
      )}
    >
      {/* Default Idle Content (slides right & fades out on hover) */}
      <div className="flex items-center gap-2.5 transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0 min-w-0">
        {Icon && (
          <div className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110">
            <Icon className="w-full h-full" />
          </div>
        )}
        <span className="truncate">{label}</span>
      </div>

      {badge && !isActive && (
        <span className="text-[10px] text-zinc-400 font-mono transition-all duration-300 group-hover:opacity-0 shrink-0">
          {badge}
        </span>
      )}

      {/* Hover Reveal Content (White with ArrowRight) */}
      <div className="absolute inset-0 z-10 flex h-full w-full translate-x-10 items-center justify-between px-3 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 font-bold">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="w-4 h-4 shrink-0 brightness-150">
              <Icon className="w-full h-full" />
            </div>
          )}
          <span className="truncate">{label}</span>
        </div>
        <ArrowRightChunkyIcon className="w-4 h-4 shrink-0" />
      </div>

      {/* Expanding Dot Background */}
      <div className="absolute left-[12%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-orange-600 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[2] group-hover:bg-orange-600 pointer-events-none"></div>
    </button>
  );
}

export default function Sidebar({
  activeView,
  setActiveView,
  projects = [],
  selectedProject,
  setSelectedProject,
  docs = [],
  selectedDocId,
  setSelectedDocId,
  onOpenCreateDoc,
  onOpenCreateProject,
  onDeleteProject,
  onDeleteDoc,
  onOpenSearch
}) {
  const views = [
    { id: 'board', label: 'Kanban Board', icon: KanbanIcon },
    { id: 'table', label: 'Table Grid', icon: TableGridIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarDateIcon },
    { id: 'docs', label: 'Documentation', icon: DocsNotebookIcon },
    { id: 'allocation', label: 'Committee & Team', icon: TeamGroupIcon }
  ];

  return (
    <aside className="w-64 h-screen flex flex-col bg-[#fbfbfa] border-r border-zinc-200/80 shrink-0 select-none">
      {/* BSCF AppFlowy Workspace Header */}
      <div className="p-3.5 border-b border-zinc-200/80 flex items-center justify-between bg-white/70">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Official BSCF Logo Container */}
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0 border border-zinc-200 overflow-hidden">
            <img
              src="/bscf-logo.png"
              alt="BSCF Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm text-zinc-900 tracking-tight truncate">
              BSCF workspace
            </h1>
            <p className="text-[10px] font-medium text-zinc-500 leading-tight">
              Bangladesh Socio-Cultural Forum
            </p>
          </div>
        </div>
      </div>

      {/* Quick Search & Actions (Interactive Hover Button) */}
      <div className="p-3 border-b border-zinc-200/60 bg-white/40">
        <button
          onClick={onOpenSearch}
          className="group relative w-full overflow-hidden rounded-xl px-3 py-2 text-xs font-semibold shadow-2xs transition-all duration-300 cursor-pointer select-none text-left flex items-center justify-between border bg-white text-zinc-700 border-zinc-200/90 hover:border-orange-500 hover:shadow-xs"
        >
          <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">
            <SearchMagnifierIcon className="w-4 h-4" />
            <span>Quick Find...</span>
          </div>
          <kbd className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 transition-all duration-300 group-hover:opacity-0">
            ⌘K
          </kbd>

          {/* Hover Reveal */}
          <div className="absolute inset-0 z-10 flex h-full w-full translate-x-10 items-center justify-between px-3 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 font-bold">
            <div className="flex items-center gap-2">
              <SearchMagnifierIcon className="w-4 h-4 brightness-150" />
              <span>Quick Find...</span>
            </div>
            <ArrowRightChunkyIcon className="w-4 h-4" />
          </div>

          {/* Expanding Dot Background */}
          <div className="absolute left-[12%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-orange-600 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[2] group-hover:bg-orange-600 pointer-events-none"></div>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {/* Main Workspace Views */}
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-2">
            Workspace Views
          </div>
          <nav className="space-y-1">
            {views.map((v) => {
              const isActive = activeView === v.id;
              return (
                <SidebarInteractiveButton
                  key={v.id}
                  icon={v.icon}
                  label={v.label}
                  isActive={isActive}
                  onClick={() => setActiveView(v.id)}
                />
              );
            })}
          </nav>
        </div>

        {/* BSCF Initiatives (Projects) */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Initiatives & Programs
            </span>
            <span className="text-[10px] text-zinc-500 bg-zinc-200/70 px-1.5 py-0.2 rounded font-mono">
              {projects.length}
            </span>
          </div>
          <div className="space-y-1">
            {/* All Initiatives button (clean, no animated dot) */}
            <button
              type="button"
              onClick={() => {
                setSelectedProject(null);
                if (activeView === 'docs' || activeView === 'allocation') {
                  setActiveView('board');
                }
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                selectedProject === null
                  ? 'bg-zinc-100 text-zinc-950 font-semibold border-zinc-200 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                <FolderInitiativeIcon className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="truncate">All Initiatives</span>
              </div>
            </button>

            {projects.map((p) => {
              const isSelected = selectedProject === p._id;
              return (
                <div
                  key={p._id}
                  className={`group/item relative flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 font-semibold border-zinc-200 shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 border-transparent'
                  }`}
                  onClick={() => {
                    setSelectedProject(p._id);
                    if (activeView === 'docs' || activeView === 'allocation') {
                      setActiveView('board');
                    }
                  }}
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10"
                      style={{ backgroundColor: p.color || '#ea580c' }}
                    ></span>
                    <span className="truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-zinc-400 font-mono group-hover/item:hidden">
                      {p.key}
                    </span>
                    {onDeleteProject && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(p._id, p.name);
                        }}
                        title={`Delete initiative ${p.name}`}
                        className="hidden group-hover/item:flex p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <TrashDeleteIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <button
                onClick={onOpenCreateProject}
                className="w-full rounded-xl px-3 py-2 text-xs font-semibold shadow-2xs transition-all cursor-pointer select-none text-left flex items-center gap-2 border border-dashed border-zinc-300 bg-white text-zinc-600 hover:border-orange-500 hover:text-orange-600"
              >
                <span>Add Initiative</span>
              </button>
            )}
          </div>
        </div>

        {/* AppFlowy Pages / Documents Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Pages & Docs</span>
            </span>
          </div>
          <div className="space-y-1">
            {docs.map((doc) => {
              const isDocActive = activeView === 'docs' && selectedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveView('docs');
                    setSelectedDocId(doc.id);
                  }}
                  className={`group/item relative flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                    isDocActive
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-2xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <span className="text-sm shrink-0">{doc.icon || '📄'}</span>
                    <span className="truncate">{doc.title}</span>
                  </div>
                  {onDeleteDoc && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDoc(doc.id, doc.title);
                      }}
                      title={`Delete document ${doc.title}`}
                      className="opacity-0 group-hover/item:opacity-100 p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-all cursor-pointer shrink-0"
                    >
                      <TrashDeleteIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}

            {docs.length === 0 && (
              <button
                onClick={() => {
                  setActiveView('docs');
                  if (onOpenCreateDoc) onOpenCreateDoc();
                }}
                className="group relative w-full overflow-hidden rounded-xl px-3 py-2 text-xs font-semibold shadow-2xs transition-all duration-300 cursor-pointer select-none text-left flex items-center justify-between border border-dashed border-zinc-300 bg-white text-zinc-600 hover:border-emerald-500 hover:text-emerald-600"
              >
                <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">
                  <PlusAddIcon className="w-4 h-4" />
                  <span>Create Doc</span>
                </div>
                <div className="absolute inset-0 z-10 flex h-full w-full translate-x-10 items-center justify-between px-3 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 font-semibold">
                  <div className="flex items-center gap-2">
                    <PlusAddIcon className="w-4 h-4 brightness-150" />
                    <span>Create Doc</span>
                  </div>
                  <ArrowRightChunkyIcon className="w-4 h-4" />
                </div>
                <div className="absolute left-[12%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-emerald-600 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[2] group-hover:bg-emerald-600 pointer-events-none"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
