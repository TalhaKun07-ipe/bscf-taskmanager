'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Code,
  Quote,
  Eye
} from 'lucide-react';
import {
  DocsNotebookIcon,
  PlusAddIcon,
  TrashDeleteIcon,
  SearchMagnifierIcon,
  PencilEditIcon,
  CheckmarkIcon
} from '@/components/icons/CustomStyleIcons';
import { format } from 'date-fns';

const DEFAULT_ICONS = ['📄', '🚀', '🎨', '⚡', '💡', '🛡️', '📊', '🔧', '🎯'];

export default function DocsEditor({
  docs = [],
  selectedDocId,
  setSelectedDocId,
  onCreateDoc,
  onUpdateDoc,
  onDeleteDoc,
  onSearchDocs
}) {
  const activeDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [icon, setIcon] = useState('📄');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state when activeDoc changes
  useEffect(() => {
    if (activeDoc) {
      setTitle(activeDoc.title || '');
      setContent(activeDoc.content || '');
      setIcon(activeDoc.icon || '📄');
      setLastSaved(activeDoc.updatedAt ? new Date(activeDoc.updatedAt) : new Date());
    }
  }, [activeDoc?.id]);

  // Handle Save to SQLite
  const handleSave = async () => {
    if (!activeDoc) return;
    setIsSaving(true);
    try {
      await onUpdateDoc(activeDoc.id, {
        title,
        content,
        icon
      });
      setLastSaved(new Date());
    } catch (e) {
      console.error('Error saving document to SQLite:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick insert markdown helper
  const insertText = (prefix, suffix = '') => {
    const textarea = document.getElementById('doc-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setContent(newContent);
    // Auto-focus back
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Pane: Documents Navigation */}
      <div className="w-72 border-r border-zinc-200/80 bg-zinc-50/60 flex flex-col shrink-0">
        {/* Header & Create Doc */}
        <div className="p-3.5 border-b border-zinc-200/80 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <DocsNotebookIcon className="w-4 h-4" />
            <span className="text-xs font-bold text-zinc-900 tracking-wide">
              BSCF Documents
            </span>
          </div>
          <button
            onClick={onCreateDoc}
            className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium shadow-2xs transition-all cursor-pointer"
          >
            <PlusAddIcon className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        {/* SQLite Search Bar */}
        <div className="p-3 border-b border-zinc-200/60 bg-white/40">
          <div className="relative">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchMagnifierIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearchDocs(e.target.value);
              }}
              placeholder="Search documents..."
              className="w-full text-xs bg-white border border-zinc-200 text-zinc-900 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-orange-500 placeholder:text-zinc-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Docs List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {docs.map((d) => {
            const isSelected = activeDoc?.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDocId(d.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 text-orange-950 border border-orange-200 font-semibold shadow-2xs'
                    : 'text-zinc-700 hover:bg-zinc-100/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base shrink-0">{d.icon || '📄'}</span>
                  <div className="truncate">
                    <div className="text-xs font-medium truncate">{d.title || 'Untitled'}</div>
                    <div className="text-[10px] text-zinc-400 font-normal">
                      {d.updatedAt ? format(new Date(d.updatedAt), 'MMM d, HH:mm') : 'Draft'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Document Editor & Viewer */}
      {activeDoc ? (
        <div className="flex-1 flex flex-col bg-[#fbfbfa] paper-canvas overflow-hidden">
          {/* Top Doc Toolbar */}
          <div className="h-14 border-b border-zinc-200/80 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md">
            {/* Formatting Actions */}
            <div className="flex items-center gap-1 text-zinc-500">
              <button
                onClick={() => insertText('# ', '')}
                className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertText('## ', '')}
                className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertText('**', '**')}
                className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertText('*', '*')}
                className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertText('- [ ] ', '')}
                className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Checklist Item"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertText('```javascript\n', '\n```')}
                className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertText('> ', '')}
                className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Quote Block"
              >
                <Quote className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-zinc-200 mx-2"></div>

              {/* Preview Mode Toggle */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  previewMode
                    ? 'bg-orange-50 text-orange-700 border border-orange-200 font-semibold'
                    : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {previewMode ? <PencilEditIcon className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
            </div>

            {/* Save & SQLite Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                <CheckmarkIcon className="w-4 h-4" />
                <span>
                  {isSaving
                    ? 'Writing to SQLite...'
                    : lastSaved
                    ? `Saved: ${format(lastSaved, 'HH:mm:ss')}`
                    : 'Synced'}
                </span>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to SQLite</span>
              </button>

              <button
                onClick={() => onDeleteDoc(activeDoc.id)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Page from SQLite"
              >
                <TrashDeleteIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Doc Body (Paper desk aesthetic) */}
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
            {/* Icon Picker & Title */}
            <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-xl border border-zinc-200/80 shadow-2xs">
              <div className="relative group">
                <button
                  type="button"
                  className="text-3xl p-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-orange-500 cursor-pointer shadow-2xs"
                >
                  {icon}
                </button>
                {/* Icon Selector Tooltip */}
                <div className="hidden group-hover:flex absolute left-0 top-full mt-1 bg-white border border-zinc-200 rounded-xl p-2 gap-1 z-20 shadow-xl">
                  {DEFAULT_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setIcon(emoji);
                        onUpdateDoc(activeDoc.id, { icon: emoji });
                      }}
                      className="text-xl p-1 hover:bg-zinc-100 rounded cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                placeholder="Document Title..."
                className="text-2xl font-extrabold text-zinc-900 bg-transparent focus:outline-none w-full border-b border-transparent focus:border-orange-500/50 pb-1"
              />
            </div>

            {/* Document Content Canvas */}
            {previewMode ? (
              <div className="bg-white p-6 rounded-xl border border-zinc-200/80 shadow-2xs doc-editor text-zinc-800 leading-relaxed whitespace-pre-wrap min-h-[500px]">
                {content || <span className="text-zinc-400 italic">No content yet. Switch to Edit mode to write.</span>}
              </div>
            ) : (
              <textarea
                id="doc-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSave}
                placeholder="Write markdown, notes, guidelines, or specifications here..."
                className="w-full h-[600px] text-sm text-zinc-800 bg-white p-6 rounded-xl border border-zinc-200/80 shadow-2xs focus:outline-none focus:border-orange-500 resize-none font-sans leading-relaxed"
              ></textarea>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-[#fbfbfa]">
          <FileText className="w-12 h-12 mb-3 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-600">No document selected</p>
          <button
            onClick={onCreateDoc}
            className="mt-3 text-xs px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium shadow-2xs cursor-pointer"
          >
            Create first document
          </button>
        </div>
      )}
    </div>
  );
}
