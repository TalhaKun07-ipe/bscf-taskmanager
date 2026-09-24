'use client';

import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PencilEditIcon, TrashDeleteIcon } from '@/components/icons/CustomStyleIcons';
import { format, isPast, isToday } from 'date-fns';

const STATUS_CONFIG = {
  backlog: { label: 'Backlog', color: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
  todo: { label: 'To Do', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_progress: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  in_review: { label: 'In Review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
};

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  high: { label: 'High', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  medium: { label: 'Medium', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  low: { label: 'Low', color: 'bg-zinc-100 text-zinc-600 border-zinc-200' }
};

export default function TableView({
  tasks = [],
  onUpdateTask,
  onDeleteTask,
  onOpenTaskModal
}) {
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'dueDate') {
      aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="rounded-xl bg-white border border-zinc-200/90 overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/90 text-zinc-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1.5 hover:text-zinc-900 cursor-pointer"
                >
                  <span>Task Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-3">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1.5 hover:text-zinc-900 cursor-pointer"
                >
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-3">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-1.5 hover:text-zinc-900 cursor-pointer"
                >
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-3">Assignees</th>
              <th className="py-3 px-3">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center gap-1.5 hover:text-zinc-900 cursor-pointer"
                >
                  <span>Due Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-3">Subtasks</th>
              <th className="py-3 px-3">Est. Hours</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-200/80">
            {sortedTasks.map((task) => {
              const statusInfo = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
              const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              const dueDate = task.dueDate ? new Date(task.dueDate) : null;
              const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';
              const isDueToday = dueDate && isToday(dueDate);

              const subtasks = task.subtasks || [];
              const completedCount = subtasks.filter((s) => s.completed).length;

              return (
                <tr
                  key={task._id}
                  className="hover:bg-zinc-50/80 transition-colors group cursor-pointer"
                  onClick={() => onOpenTaskModal(task)}
                >
                  {/* Task Name & Project */}
                  <td className="py-3.5 px-4 font-medium text-zinc-900 max-w-xs">
                    <div className="flex items-center gap-2">
                      {task.projectId?.key && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {task.projectId.key}
                        </span>
                      )}
                      <span className="truncate font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                        {task.title}
                      </span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      aria-label="Update task status"
                      onChange={(e) => onUpdateTask(task._id, { status: e.target.value })}
                      className={`text-[11px] font-medium px-2 py-1 rounded-md border focus:outline-none cursor-pointer shadow-2xs ${statusInfo.color}`}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  {/* Priority Dropdown */}
                  <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.priority}
                      aria-label="Update task priority"
                      onChange={(e) => onUpdateTask(task._id, { priority: e.target.value })}
                      className={`text-[11px] font-medium px-2 py-1 rounded-md border focus:outline-none cursor-pointer shadow-2xs ${priorityInfo.color}`}
                    >
                      <option value="urgent">🔥 Urgent</option>
                      <option value="high">🔺 High</option>
                      <option value="medium">🔹 Medium</option>
                      <option value="low">▫️ Low</option>
                    </select>
                  </td>

                  {/* Assignees */}
                  <td className="py-3.5 px-3">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {(task.assignees || []).map((m, idx) => (
                        <img
                          key={m._id || idx}
                          src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={m.name}
                          title={`${m.name} (${m.role})`}
                          className="w-6 h-6 rounded-full ring-2 ring-white object-cover shadow-2xs"
                        />
                      ))}
                      {(!task.assignees || task.assignees.length === 0) && (
                        <span className="text-zinc-400 text-[11px] italic">Unassigned</span>
                      )}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-3">
                    {dueDate ? (
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          isOverdue
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                            : isDueToday
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'text-zinc-600 bg-zinc-100/60'
                        }`}
                      >
                        {format(dueDate, 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>

                  {/* Subtasks Progress */}
                  <td className="py-3.5 px-3">
                    {subtasks.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/60">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(completedCount / subtasks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {completedCount}/{subtasks.length}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>

                  {/* Estimated Hours */}
                  <td className="py-3.5 px-3 text-zinc-700 font-mono">
                    {task.estimatedHours ? `${task.estimatedHours}h` : '—'}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenTaskModal(task)}
                        className="p-1 rounded hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 cursor-pointer transition-colors"
                        title="Edit Task"
                      >
                        <PencilEditIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task._id)}
                        className="p-1 rounded hover:bg-rose-50 text-zinc-500 hover:text-rose-600 cursor-pointer transition-colors"
                        title="Delete Task"
                      >
                        <TrashDeleteIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {sortedTasks.length === 0 && (
              <tr>
                <td colSpan={8} className="py-16 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <p className="text-sm font-medium text-zinc-700">No records found</p>
                    <p className="text-xs text-zinc-500">Add a task or card to view items in this database view</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
