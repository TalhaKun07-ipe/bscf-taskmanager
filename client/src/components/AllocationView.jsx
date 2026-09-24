'use client';

import React from 'react';
import {
  TeamGroupIcon,
  ClockTimeIcon,
  CheckmarkIcon,
  TrophyAwardIcon
} from '@/components/icons/CustomStyleIcons';

export default function AllocationView({
  allocationData = [],
  onOpenTaskModal
}) {
  const [networkTab, setNetworkTab] = React.useState('all'); // 'all', 'Core Team', 'Youth Network'
  const [searchFilter, setSearchFilter] = React.useState('');

  const coreTeamCount = allocationData.filter(
    (a) => a.member?.network === 'Core Team' || !a.member?.network
  ).length;
  const youthNetworkCount = allocationData.filter(
    (a) => a.member?.network === 'Youth Network'
  ).length;

  const filteredData = allocationData.filter((item) => {
    const m = item.member || {};
    const matchesNetwork =
      networkTab === 'all'
        ? true
        : networkTab === 'Core Team'
        ? m.network === 'Core Team' || !m.network
        : m.network === 'Youth Network';

    const matchesSearch =
      searchFilter.trim() === ''
        ? true
        : m.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
          m.role?.toLowerCase().includes(searchFilter.toLowerCase()) ||
          m.department?.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesNetwork && matchesSearch;
  });

  const totalTasks = allocationData.reduce((acc, a) => acc + (a.totalTasks || 0), 0);
  const totalInProgress = allocationData.reduce((acc, a) => acc + (a.inProgressCount || 0), 0);
  const totalCompleted = allocationData.reduce((acc, a) => acc + (a.completedCount || 0), 0);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1 font-medium">
            <span>Official BSCF Roster</span>
            <TeamGroupIcon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">{allocationData.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {coreTeamCount} Core Team · {youthNetworkCount} Youth Network
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1 font-medium">
            <span>Assigned Tasks</span>
            <TrophyAwardIcon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">{totalTasks}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Across BSCF initiatives</div>
        </div>

        <div className="rounded-xl bg-white p-4 border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1 font-medium">
            <span>In Progress</span>
            <ClockTimeIcon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">{totalInProgress}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Active team execution</div>
        </div>

        <div className="rounded-xl bg-white p-4 border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1 font-medium">
            <span>Completed</span>
            <CheckmarkIcon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">{totalCompleted}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Successfully delivered</div>
        </div>
      </div>

      {/* Member Directory & Task Summary */}
      <div>
        {/* Controls: Network Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 self-start">
            <button
              onClick={() => setNetworkTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                networkTab === 'all'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              All Members ({allocationData.length})
            </button>
            <button
              onClick={() => setNetworkTab('Core Team')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                networkTab === 'Core Team'
                  ? 'bg-white text-orange-600 shadow-2xs border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              Core Team ({coreTeamCount})
            </button>
            <button
              onClick={() => setNetworkTab('Youth Network')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                networkTab === 'Youth Network'
                  ? 'bg-white text-sky-600 shadow-2xs border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              Youth Network ({youthNetworkCount})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search member, role, dept..."
              className="text-xs bg-white border border-zinc-200 text-zinc-900 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500 w-full sm:w-64 placeholder:text-zinc-400 shadow-2xs"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredData.map((item) => {
            const m = item.member;

            return (
              <div
                key={m._id}
                className="rounded-xl bg-white p-5 border border-zinc-200/90 hover:border-orange-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Member Bio Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={m.name}
                        className="w-11 h-11 rounded-full ring-2 ring-orange-500/20 object-cover shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-zinc-900">{m.name}</h4>
                          <span
                            className={`text-[9.5px] px-1.5 py-0.5 rounded font-medium border ${
                              m.network === 'Youth Network'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : 'bg-orange-50 text-orange-700 border-orange-200'
                            }`}
                          >
                            {m.network || 'Core Team'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 font-medium">{m.role}</p>
                        <span className="text-[10px] text-zinc-500">{m.department} · {m.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Task counts summary: In Progress, To Do, Done */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/70">
                      <div className="text-xs text-zinc-500">In Progress</div>
                      <div className="text-base font-bold text-amber-600 mt-0.5">
                        {item.inProgressCount}
                      </div>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/70">
                      <div className="text-xs text-zinc-500">To Do</div>
                      <div className="text-base font-bold text-blue-600 mt-0.5">{item.todoCount}</div>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/70">
                      <div className="text-xs text-zinc-500">Done</div>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">
                        {item.completedCount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Task Pills */}
                <div>
                  <div className="text-[11px] font-semibold text-zinc-500 mb-2">
                    Current Assigned Tasks ({item.tasks.length}):
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {item.tasks.map((task) => (
                      <div
                        key={task._id}
                        onClick={() => onOpenTaskModal(task)}
                        className="p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/70 text-xs text-zinc-800 hover:text-zinc-950 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              task.status === 'completed'
                                ? 'bg-emerald-500'
                                : task.status === 'in_progress'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                          ></span>
                          <span className="truncate">{task.title}</span>
                        </div>
                      </div>
                    ))}
                    {item.tasks.length === 0 && (
                      <p className="text-xs text-zinc-400 italic py-2 text-center">
                        No active tasks currently assigned.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 rounded-xl bg-white border border-zinc-200 my-4 shadow-2xs">
            <TeamGroupIcon className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-800">No members matched this filter</p>
            <p className="text-xs text-zinc-500 mt-1">Try clearing your search query or switching between Core Team and Youth Network.</p>
          </div>
        )}
      </div>
    </div>
  );
}
