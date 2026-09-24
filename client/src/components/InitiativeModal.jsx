'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderInitiativeIcon,
  CloseCrossIcon
} from '@/components/icons/CustomStyleIcons';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

const PRESET_COLORS = [
  { name: 'Orange', value: '#ea580c' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Sky Blue', value: '#0284c7' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Indigo', value: '#4f46e5' }
];

export default function InitiativeModal({
  isOpen,
  onClose,
  onCreateProject
}) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [color, setColor] = useState('#ea580c');
  const [description, setDescription] = useState('');
  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setKey('');
      setColor('#ea580c');
      setDescription('');
      setIsKeyManuallyEdited(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-generate key initials as user types name
  const handleNameChange = (val) => {
    setName(val);
    if (!isKeyManuallyEdited) {
      const words = val.trim().split(/\s+/).filter(Boolean);
      if (words.length > 1) {
        setKey(words.map((w) => w[0]).join('').slice(0, 5).toUpperCase());
      } else if (words.length === 1) {
        setKey(words[0].slice(0, 3).toUpperCase());
      } else {
        setKey('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject({
      name: name.trim(),
      key: (key.trim() || name.slice(0, 3)).toUpperCase(),
      color,
      description: description.trim(),
      icon: '🎯'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/70 flex items-center justify-center p-1 shadow-2xs">
              <FolderInitiativeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900">New Initiative / Program</h3>
              <p className="text-[11px] text-zinc-500 font-medium">Create a strategic BSCF initiative</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <CloseCrossIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Initiative Name <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Youth Leadership Summit 2026"
              required
              className="w-full text-xs bg-zinc-50/80 border border-zinc-200 text-zinc-900 rounded-lg p-2.5 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-2xs placeholder:text-zinc-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Initiative Code / Key
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  setIsKeyManuallyEdited(true);
                  setKey(e.target.value.toUpperCase());
                }}
                maxLength={6}
                placeholder="YLS"
                className="w-full text-xs font-mono font-bold bg-zinc-50/80 border border-zinc-200 text-zinc-900 rounded-lg p-2.5 focus:outline-none focus:border-orange-500 focus:bg-white uppercase transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Badge Color
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    title={c.name}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                      color === c.value
                        ? 'scale-115 ring-2 ring-orange-500 ring-offset-1 border-white'
                        : 'border-black/10 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Description or Objective (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the initiative scope and objectives..."
              className="w-full text-xs bg-zinc-50/80 border border-zinc-200 text-zinc-900 rounded-lg p-2.5 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-2xs placeholder:text-zinc-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3.5 py-2 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <InteractiveHoverButton
              type="submit"
              text="Create Initiative"
              className="border-orange-500/40 text-orange-800 bg-orange-50/70 hover:border-orange-600 min-w-36"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
