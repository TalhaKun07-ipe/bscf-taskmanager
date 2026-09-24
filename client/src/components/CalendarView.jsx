'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CalendarDateIcon,
  ClockTimeIcon,
  PlusAddIcon,
  FlameUrgentIcon
} from '@/components/icons/CustomStyleIcons';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast
} from 'date-fns';

export default function CalendarView({
  tasks = [],
  onOpenTaskModal,
  onOpenCreateTaskWithDate
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Overdue tasks
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'completed') return false;
    const d = new Date(t.dueDate);
    return isPast(d) && !isToday(d);
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
      {/* Overdue Alert Banner if any */}
      {overdueTasks.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>
              {overdueTasks.length} task{overdueTasks.length > 1 ? 's are' : ' is'} past their scheduled deadline!
            </span>
          </div>
          <div className="flex items-center gap-2">
            {overdueTasks.slice(0, 3).map((ot) => (
              <button
                key={ot._id}
                onClick={() => onOpenTaskModal(ot)}
                className="text-[11px] px-2 py-0.5 rounded bg-rose-100/80 text-rose-800 hover:bg-rose-200 truncate max-w-[150px] cursor-pointer"
              >
                {ot.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
            <span>{format(currentDate, 'MMMM yyyy')}</span>
          </h2>
          <button
            onClick={goToToday}
            className="text-xs px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 font-medium shadow-2xs cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-lg p-1 shadow-2xs">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 rounded-xl bg-white border border-zinc-200/90 overflow-hidden shadow-2xs flex flex-col min-h-[600px]">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50/90 text-center py-2.5 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y divide-zinc-200/70">
          {days.map((day, idx) => {
            const isCurrMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);

            // Tasks on this day
            const dayTasks = tasks.filter((t) => {
              if (!t.dueDate) return false;
              return isSameDay(new Date(t.dueDate), day);
            });

            return (
              <div
                key={idx}
                onClick={() => onOpenCreateTaskWithDate(day)}
                className={`min-h-[110px] p-2 transition-colors flex flex-col group cursor-pointer ${
                  isCurrMonth ? 'bg-white hover:bg-zinc-50/80' : 'bg-zinc-50/40 text-zinc-400'
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                      isDayToday
                        ? 'bg-orange-600 text-white font-bold shadow-xs'
                        : isCurrMonth
                        ? 'text-zinc-800'
                        : 'text-zinc-400'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCreateTaskWithDate(day);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-opacity cursor-pointer"
                    title="Add task on this date"
                  >
                    <PlusAddIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Task pills for this day */}
                <div className="space-y-1 flex-1 overflow-y-auto">
                  {dayTasks.map((t) => {
                    const isUrgent = t.priority === 'urgent';
                    const isDone = t.status === 'completed';

                    return (
                      <div
                        key={t._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTaskModal(t);
                        }}
                        className={`text-[11px] p-1.5 rounded-md border flex items-center justify-between gap-1 shadow-2xs transition-all hover:scale-[1.01] cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 line-through opacity-75'
                            : isUrgent
                            ? 'bg-rose-50 border-rose-200 text-rose-700 font-semibold'
                            : 'bg-zinc-50 border-zinc-200/90 text-zinc-800 hover:border-orange-400 hover:bg-white'
                        }`}
                      >
                        <span className="truncate">{t.title}</span>
                        {isUrgent && <Flame className="w-3 h-3 text-rose-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
