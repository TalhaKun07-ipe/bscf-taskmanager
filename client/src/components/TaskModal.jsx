'use client';

import React, { useState, useEffect } from 'react';
import {
  CloseCrossIcon,
  TrashDeleteIcon,
  TagLabelIcon,
  CommentChatIcon,
  SendPlaneIcon,
  PlusAddIcon,
  CheckmarkIcon
} from '@/components/icons/CustomStyleIcons';
import { format } from 'date-fns';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function TaskModal({
  isOpen,
  onClose,
  task,
  onSaveTask,
  onDeleteTask,
  onAddComment,
  members = [],
  projects = [],
  currentMember
}) {
  const isNew = !task?._id;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  );
  const [startDate, setStartDate] = useState(
    task?.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd') : ''
  );
  const [assigneeIds, setAssigneeIds] = useState(
    (task?.assignees || []).map((a) => (typeof a === 'object' ? a._id : a))
  );
  const [projectId, setProjectId] = useState(
    task?.projectId?._id || task?.projectId || (projects[0]?._id || '')
  );
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours || 0);
  const [tags, setTags] = useState(task?.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [assigneeNetworkTab, setAssigneeNetworkTab] = useState('all');

  // Subtasks
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Comments
  const [comments, setComments] = useState(task?.comments || []);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
      setStartDate(task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd') : '');
      setAssigneeIds((task.assignees || []).map((a) => (typeof a === 'object' ? a._id : a)));
      setProjectId(task.projectId?._id || task.projectId || projects[0]?._id || '');
      setEstimatedHours(task.estimatedHours || 0);
      setTags(task.tags || []);
      setSubtasks(task.subtasks || []);
      setComments(task.comments || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setStartDate('');
      setAssigneeIds([]);
      setEstimatedHours(0);
      setTags([]);
      setSubtasks([]);
      setComments([]);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      assignees: assigneeIds,
      projectId: projectId || null,
      estimatedHours: Number(estimatedHours) || 0,
      tags,
      subtasks
    };

    onSaveTask(payload, task?._id);
    onClose();
  };

  const handleToggleAssignee = (mId) => {
    setAssigneeIds((prev) =>
      prev.includes(mId) ? prev.filter((id) => id !== mId) : [...prev, mId]
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (idx) => {
    const updated = [...subtasks];
    updated[idx].completed = !updated[idx].completed;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (idx) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (t) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const handleSendComment = async () => {
    if (!newCommentText.trim() || !task?._id) return;
    const author = currentMember?.name || 'Current User';
    const avatar = currentMember?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';

    await onAddComment(task._id, {
      author,
      avatar,
      text: newCommentText.trim()
    });

    setComments([
      ...comments,
      { author, avatar, text: newCommentText.trim(), createdAt: new Date() }
    ]);
    setNewCommentText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white border border-zinc-200/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
              {isNew ? 'NEW TASK' : 'TASK DETAILS'}
            </span>
            <span className="text-xs text-zinc-500">
              {isNew ? 'Create initiative task for BSCF' : task?.projectId?.name || 'General Project'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDeleteTask(task._id);
                    onClose();
                  }
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Task"
              >
                <TrashDeleteIcon className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <CloseCrossIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title..."
              required
              className="w-full text-lg font-bold text-zinc-900 bg-transparent border-b border-zinc-200 focus:border-orange-500 pb-2 focus:outline-none placeholder:text-zinc-400"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80 text-xs shadow-2xs">
            {/* Status */}
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white border border-zinc-200 text-zinc-800 rounded-lg p-2 focus:outline-none focus:border-orange-500 shadow-2xs cursor-pointer"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white border border-zinc-200 text-zinc-800 rounded-lg p-2 focus:outline-none focus:border-orange-500 shadow-2xs cursor-pointer"
              >
                <option value="urgent">🔥 Urgent</option>
                <option value="high">🔺 High</option>
                <option value="medium">🔹 Medium</option>
                <option value="low">▫️ Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-zinc-200 text-zinc-800 rounded-lg p-2 focus:outline-none focus:border-orange-500 shadow-2xs"
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Est. Hours</label>
              <input
                type="number"
                min="0"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full bg-white border border-zinc-200 text-zinc-800 rounded-lg p-2 focus:outline-none focus:border-orange-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Project & Assignees Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Picker */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                Assign to Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs bg-white border border-zinc-200 text-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-orange-500 shadow-2xs cursor-pointer"
              >
                <option value="">General (No Initiative)</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>
            </div>

            {/* Assignees Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-600">
                  Assignees ({assigneeIds.length} assigned)
                </label>
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setAssigneeNetworkTab('all')}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                      assigneeNetworkTab === 'all'
                        ? 'bg-zinc-200 text-zinc-900 font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    All ({members.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssigneeNetworkTab('Core Team')}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                      assigneeNetworkTab === 'Core Team'
                        ? 'bg-orange-100 text-orange-800 font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Core ({members.filter((m) => m.network === 'Core Team' || !m.network).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssigneeNetworkTab('Youth Network')}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                      assigneeNetworkTab === 'Youth Network'
                        ? 'bg-sky-100 text-sky-800 font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Youth ({members.filter((m) => m.network === 'Youth Network').length})
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-zinc-50 rounded-lg border border-zinc-200 shadow-2xs">
                {members
                  .filter((m) =>
                    assigneeNetworkTab === 'all'
                      ? true
                      : assigneeNetworkTab === 'Core Team'
                      ? m.network === 'Core Team' || !m.network
                      : m.network === 'Youth Network'
                  )
                  .map((m) => {
                    const isAssigned = assigneeIds.includes(m._id);
                    return (
                      <button
                        type="button"
                        key={m._id}
                        onClick={() => handleToggleAssignee(m._id)}
                        title={`${m.name} (${m.role} · ${m.network || 'Core Team'})`}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                          isAssigned
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <img
                          src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                          alt={m.name}
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                        <span>{m.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Description & Specifications
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, objectives, context, or technical requirements..."
              className="w-full text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl p-3 focus:outline-none focus:border-orange-500 leading-relaxed shadow-2xs"
            ></textarea>
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                <CheckmarkIcon className="w-3.5 h-3.5" />
                <span>Checklist Subtasks</span>
              </label>
              <span className="text-[11px] text-zinc-500">
                {subtasks.filter((s) => s.completed).length}/{subtasks.length} Completed
              </span>
            </div>

            <div className="space-y-1.5 mb-2">
              {subtasks.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs shadow-2xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(idx)}
                      className="rounded border-zinc-300 text-orange-600 focus:ring-0 cursor-pointer"
                    />
                    <span
                      className={st.completed ? 'line-through text-zinc-400' : 'text-zinc-800'}
                    >
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(idx)}
                    className="text-zinc-400 hover:text-rose-600 px-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask item (press Enter)..."
                className="flex-1 text-xs bg-white border border-zinc-200 text-zinc-900 rounded-lg p-2 focus:outline-none focus:border-orange-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 rounded-lg text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium border border-zinc-200 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5 flex items-center gap-1.5">
              <TagLabelIcon className="w-3.5 h-3.5" />
              <span>Tags</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full border border-zinc-200"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-zinc-400 hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="New tag..."
                  className="text-xs bg-white border border-zinc-200 text-zinc-900 rounded-lg px-2 py-1 w-24 focus:outline-none focus:border-orange-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="text-xs text-zinc-500 hover:text-zinc-900 cursor-pointer px-1"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section (only for existing tasks) */}
          {!isNew && (
            <div className="pt-3 border-t border-zinc-200">
              <label className="block text-xs font-semibold text-zinc-700 mb-2 flex items-center gap-1.5">
                <CommentChatIcon className="w-4 h-4" />
                <span>Discussion & Activity Log</span>
              </label>

              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {comments.map((c, idx) => (
                  <div key={idx} className="flex gap-2.5 p-2 rounded-lg bg-zinc-50 border border-zinc-200/80">
                    <img
                      src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                      alt={c.author}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 shadow-2xs"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-zinc-900">{c.author}</span>
                        <span className="text-[10px] text-zinc-400">
                          {c.createdAt ? format(new Date(c.createdAt), 'MMM d, HH:mm') : ''}
                        </span>
                      </div>
                      <p className="text-zinc-700 leading-snug">{c.text}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-xs text-zinc-400 italic">No comments yet. Start the conversation!</p>
                )}
              </div>

              {/* Add comment box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                  placeholder="Type a team update or comment..."
                  className="flex-1 text-xs bg-white border border-zinc-200 text-zinc-900 rounded-lg p-2.5 focus:outline-none focus:border-orange-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleSendComment}
                  className="p-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
                >
                  <SendPlaneIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <InteractiveHoverButton
              type="submit"
              text={isNew ? 'Create Task' : 'Save Changes'}
              className="border-orange-500/40 text-orange-800 bg-orange-50/60 hover:border-orange-600"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
