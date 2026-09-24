'use client';

import React, { useState } from 'react';
import {
  PlusAddIcon,
  FlameUrgentIcon,
  ClockTimeIcon,
  CalendarDateIcon,
  CheckSquarePastelIcon,
  TrashDeleteIcon,
  TagLabelIcon
} from '@/components/icons/CustomStyleIcons';
import { format, isPast, isToday } from 'date-fns';

const COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: '#64748b' },
  { id: 'todo', label: 'To Do', color: '#3b82f6' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'in_review', label: 'In Review', color: '#8b5cf6' },
  { id: 'completed', label: 'Completed', color: '#10b981' }
];

export default function KanbanBoard({
  tasks = [],
  onUpdateTask,
  onDeleteTask,
  onOpenTaskModal,
  onQuickCreateTask
}) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [quickTitleByCol, setQuickTitleByCol] = useState({});
  const [isAddingByCol, setIsAddingByCol] = useState({});

  // Handle HTML5 Drag and Drop
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== targetStatus) {
      await onUpdateTask(taskId, { status: targetStatus });
    }
    setDraggedTaskId(null);
  };

  const [isSubmittingQuickAdd, setIsSubmittingQuickAdd] = useState(false);

  const handleQuickAdd = async (status) => {
    const title = quickTitleByCol[status]?.trim();
    if (!title || isSubmittingQuickAdd) return;
    setIsSubmittingQuickAdd(true);
    try {
      await onQuickCreateTask({ title, status });
      setQuickTitleByCol((prev) => ({ ...prev, [status]: '' }));
      setIsAddingByCol((prev) => ({ ...prev, [status]: false }));
    } finally {
      setIsSubmittingQuickAdd(false);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-6 flex gap-5 select-none">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="w-80 shrink-0 flex flex-col rounded-xl bg-zinc-100/70 border border-zinc-200/80 shadow-2xs max-h-full"
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-zinc-200/80 flex items-center justify-between bg-white/60">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                ></span>
                <span className="font-semibold text-xs text-zinc-800 tracking-wide">
                  {col.label}
                </span>
                <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded-full border border-zinc-200">
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Quick Task Creator Form */}
            {isAddingByCol[col.id] && (
              <div className="p-2.5 border-b border-zinc-200 bg-white/80">
                <input
                  type="text"
                  autoFocus
                  placeholder="Task title..."
                  value={quickTitleByCol[col.id] || ''}
                  onChange={(e) =>
                    setQuickTitleByCol((prev) => ({ ...prev, [col.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickAdd(col.id);
                    if (e.key === 'Escape')
                      setIsAddingByCol((prev) => ({ ...prev, [col.id]: false }));
                  }}
                  className="w-full text-xs bg-white border border-zinc-300 text-zinc-900 rounded-lg p-2 focus:outline-none focus:border-orange-500 mb-2 shadow-2xs"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() =>
                      setIsAddingByCol((prev) => ({ ...prev, [col.id]: false }))
                    }
                    className="text-[11px] px-2.5 py-1 text-zinc-500 hover:text-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleQuickAdd(col.id)}
                    className="text-[11px] px-3 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-medium shadow-2xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Tasks Container */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
              {colTasks.map((task) => {
                const subtasks = task.subtasks || [];
                const completedSubtasks = subtasks.filter((s) => s.completed).length;
                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';
                const isDueToday = dueDate && isToday(dueDate);

                return (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    onClick={() => onOpenTaskModal(task)}
                    className="group bg-white hover:bg-zinc-50/80 border border-zinc-200/90 hover:border-orange-400/80 rounded-xl p-3.5 shadow-2xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing relative"
                  >
                    {/* Top Row: Project & Priority Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {task.projectId?.key && (
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                            {task.projectId.key}
                          </span>
                        )}
                        {task.priority === 'urgent' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <FlameUrgentIcon className="w-3.5 h-3.5" />
                            Urgent
                          </span>
                        )}
                        {task.priority === 'high' && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            High
                          </span>
                        )}
                        {task.priority === 'medium' && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Medium
                          </span>
                        )}
                      </div>

                      {/* Estimated hours pill & Quick Delete Button */}
                      <div className="flex items-center gap-1">
                        {task.estimatedHours > 0 && (
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <ClockTimeIcon className="w-3.5 h-3.5" />
                            {task.estimatedHours}h
                          </span>
                        )}
                        {onDeleteTask && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete task "${task.title}"?`)) {
                                onDeleteTask(task._id);
                              }
                            }}
                            title="Delete Task"
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-all cursor-pointer"
                          >
                            <TrashDeleteIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Task Title */}
                    <h3 className="text-xs font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 leading-snug">
                      {task.title}
                    </h3>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {task.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Subtask progress bar */}
                    {subtasks.length > 0 && (
                      <div className="mb-2.5">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                          <span className="flex items-center gap-1">
                            <CheckSquarePastelIcon className="w-3.5 h-3.5" />
                            Subtasks
                          </span>
                          <span>
                            {completedSubtasks}/{subtasks.length}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${(completedSubtasks / subtasks.length) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Footer Row: Due Date & Assignees */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px]">
                      {dueDate ? (
                        <div
                          className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            isOverdue
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isDueToday
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'text-zinc-500'
                          }`}
                        >
                          <CalendarDateIcon className="w-3.5 h-3.5" />
                          <span>{format(dueDate, 'MMM d')}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-400">No date</span>
                      )}

                      {/* Assignee Avatar Badges */}
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {(task.assignees || []).map((m, idx) => (
                          <img
                            key={m._id || idx}
                            src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={m.name}
                            title={m.name}
                            className="w-5 h-5 rounded-full ring-1 ring-white object-cover shadow-2xs"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="py-8 flex flex-col items-center justify-center border border-dashed border-zinc-300 rounded-xl text-zinc-400 text-xs">
                  <span>No cards</span>
                  <button
                    onClick={() =>
                      setIsAddingByCol((prev) => ({ ...prev, [col.id]: true }))
                    }
                    className="text-orange-600 hover:text-orange-700 mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer"
                  >
                    <PlusAddIcon className="w-3.5 h-3.5" /> Add card
                  </button>
                </div>
              )}

              {colTasks.length > 0 && !isAddingByCol[col.id] && (
                <button
                  onClick={() => setIsAddingByCol((prev) => ({ ...prev, [col.id]: true }))}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  <PlusAddIcon className="w-3.5 h-3.5" />
                  <span>New card</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
