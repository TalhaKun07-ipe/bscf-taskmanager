'use client';

import React from 'react';

// Reusable SVG wrapper
const SvgBase = ({ className = 'w-4 h-4', children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {children}
  </svg>
);

// 1. Kanban Board Icon (Pastel columns with mini cards)
export function KanbanIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Outer frame */}
      <rect
        x="2.5"
        y="3"
        width="19"
        height="18"
        rx="3"
        fill="#f8fafc"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Column 1 - Yellow */}
      <rect
        x="3.5"
        y="4"
        width="5"
        height="16"
        rx="1.5"
        fill="#fef08a"
      />
      {/* Column 2 - Mint */}
      <rect
        x="9.5"
        y="4"
        width="5"
        height="16"
        rx="1.5"
        fill="#bbf7d0"
      />
      {/* Column 3 - Sky Blue */}
      <rect
        x="15.5"
        y="4"
        width="5"
        height="16"
        rx="1.5"
        fill="#bae6fd"
      />
      {/* Column dividers */}
      <line x1="9" y1="3.5" x2="9" y2="20.5" stroke="#232154" strokeWidth="1.5" />
      <line x1="15" y1="3.5" x2="15" y2="20.5" stroke="#232154" strokeWidth="1.5" />
      {/* Cards inside columns */}
      <rect x="4.5" y="7" width="3" height="4" rx="0.8" fill="#ffffff" stroke="#232154" strokeWidth="1.2" />
      <rect x="10.5" y="6.5" width="3" height="5" rx="0.8" fill="#ffffff" stroke="#232154" strokeWidth="1.2" />
      <rect x="10.5" y="13" width="3" height="4" rx="0.8" fill="#ffffff" stroke="#232154" strokeWidth="1.2" />
      <rect x="16.5" y="8" width="3" height="4" rx="0.8" fill="#ffffff" stroke="#232154" strokeWidth="1.2" />
    </SvgBase>
  );
}

// 2. Table Grid Icon (Pastel Mint Header & Matrix Grid)
export function TableGridIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <rect
        x="2.5"
        y="3"
        width="19"
        height="18"
        rx="3"
        fill="#ffffff"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Mint Header row */}
      <path
        d="M2.5 6C2.5 4.34315 3.84315 3 5.5 3H18.5C20.1569 3 21.5 4.34315 21.5 6V8H2.5V6Z"
        fill="#bbf7d0"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Internal Grid Lines */}
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#232154" strokeWidth="1.5" />
      <line x1="2.5" y1="16.5" x2="21.5" y2="16.5" stroke="#232154" strokeWidth="1.5" />
      <line x1="8.5" y1="3" x2="8.5" y2="21" stroke="#232154" strokeWidth="1.5" />
      <line x1="15" y1="3" x2="15" y2="21" stroke="#232154" strokeWidth="1.5" />
      {/* Cute dots/indicators in cells */}
      <circle cx="5.5" cy="14.2" r="1" fill="#232154" />
      <circle cx="11.8" cy="10" r="1" fill="#232154" />
      <circle cx="18.2" cy="18.8" r="1" fill="#232154" />
    </SvgBase>
  );
}

// 3. Calendar Icon (Pastel Coral/Pink Header with Date 31)
export function CalendarDateIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Top hanger loops */}
      <line x1="7" y1="1.5" x2="7" y2="4.5" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17" y1="1.5" x2="17" y2="4.5" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      {/* Body */}
      <rect
        x="3"
        y="3.5"
        width="18"
        height="18"
        rx="3"
        fill="#ffffff"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Coral/Pink Header Bar */}
      <path
        d="M3 6.5C3 4.84315 4.34315 3.5 6 3.5H18C19.6569 3.5 21 4.84315 21 6.5V8.5H3V6.5Z"
        fill="#fecdd3"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Date "31" or grid */}
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="7.5"
        fontWeight="bold"
        fill="#232154"
      >
        31
      </text>
      {/* Bottom status bar in yellow & sky */}
      <rect x="6" y="18" width="7" height="1.8" rx="0.9" fill="#fef08a" />
      <rect x="13.5" y="18" width="4.5" height="1.8" rx="0.9" fill="#bae6fd" />
    </SvgBase>
  );
}

// 4. Docs / Notebook Icon (Spiral Binding & Pastel Coral/Peach Page)
export function DocsNotebookIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Notebook page */}
      <rect
        x="4.5"
        y="3"
        width="16"
        height="18"
        rx="2.5"
        fill="#fecdd3"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Folded corner bottom-right */}
      <path
        d="M16 16.5L20.5 21H18C16.8954 21 16 20.1046 16 19V16.5Z"
        fill="#fde047"
        stroke="#232154"
        strokeWidth="1.5"
      />
      {/* Left spiral rings */}
      <path d="M3 5.5H5.5" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 9H5.5" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 12.5H5.5" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 16H5.5" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      {/* Content lines */}
      <line x1="8.5" y1="7.5" x2="16.5" y2="7.5" stroke="#232154" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="10.5" x2="16.5" y2="10.5" stroke="#232154" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="13.5" x2="14" y2="13.5" stroke="#232154" strokeWidth="1.5" strokeLinecap="round" />
    </SvgBase>
  );
}

// 5. Team / Committee Icon (Pastel Lavender & Pink avatars)
export function TeamGroupIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Left Member (Sky blue) */}
      <circle cx="6" cy="9.5" r="2.8" fill="#bae6fd" stroke="#232154" strokeWidth="1.6" />
      <path
        d="M2 18.5C2 15.5 4 14 6 14C7.5 14 8.7 14.8 9.5 16"
        stroke="#232154"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Right Member (Pink) */}
      <circle cx="18" cy="9.5" r="2.8" fill="#fecdd3" stroke="#232154" strokeWidth="1.6" />
      <path
        d="M14.5 16C15.3 14.8 16.5 14 18 14C20 14 22 15.5 22 18.5"
        stroke="#232154"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Center Member (Main, Lavender) */}
      <circle cx="12" cy="7.5" r="3.2" fill="#ddd6fe" stroke="#232154" strokeWidth="1.8" />
      <path
        d="M7 19C7 15.5 9.2 13.5 12 13.5C14.8 13.5 17 15.5 17 19"
        fill="#e9d5ff"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgBase>
  );
}

// 6. Search / Magnifying Glass (Mint glass, yellow handle)
export function SearchMagnifierIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Glass circle */}
      <circle
        cx="10"
        cy="10"
        r="6.5"
        fill="#bbf7d0"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Inner reflection shine */}
      <path
        d="M6.5 10C6.5 8 8 6.5 10 6.5"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Yellow handle */}
      <path
        d="M15 15L20.5 20.5"
        stroke="#fde047"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M15 15L20.5 20.5"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgBase>
  );
}

// 7. Check / Completed Icon (Coral box, mint bold check)
export function CheckmarkIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        fill="#fecdd3"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Bold checkmark */}
      <path
        d="M7 12L10.5 15.5L17 8"
        fill="none"
        stroke="#10b981"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 12L10.5 15.5L17 8"
        fill="none"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

// 8. Clock / Time Icon (Pastel Sky rim & Yellow face)
export function ClockTimeIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="#bae6fd"
        stroke="#232154"
        strokeWidth="1.8"
      />
      {/* Inner dial */}
      <circle
        cx="12"
        cy="12"
        r="5.5"
        fill="#fef08a"
        stroke="#232154"
        strokeWidth="1.2"
      />
      {/* Hands */}
      <path
        d="M12 9V12L14.5 13.5"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="0.9" fill="#232154" />
    </SvgBase>
  );
}

// 9. Fire / Flame / Urgent Icon (Dual-tone Yellow & Coral)
export function FlameUrgentIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Outer flame (Coral/Orange) */}
      <path
        d="M12 2C10.5 5 7 7.5 7 12C7 15.3137 9.23858 19 12 19C14.7614 19 17 15.3137 17 12C17 7.5 13.5 5 12 2Z"
        fill="#fecdd3"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Inner flame (Pastel Yellow) */}
      <path
        d="M12 9C11 11 9.5 12.5 9.5 14.5C9.5 16.5 10.6 18 12 18C13.4 18 14.5 16.5 14.5 14.5C14.5 12.5 13 11 12 9Z"
        fill="#fde047"
        stroke="#232154"
        strokeWidth="1.4"
      />
    </SvgBase>
  );
}

// 10. Trash Can / Delete Icon (Lavender body with lines)
export function TrashDeleteIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Lid handle */}
      <path d="M10 3.5H14" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      {/* Lid */}
      <path
        d="M5 6H19"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Can body */}
      <path
        d="M6.5 6L7.5 19C7.5 19.8 8.2 20.5 9 20.5H15C15.8 20.5 16.5 19.8 16.5 19L17.5 6"
        fill="#e9d5ff"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Fluting lines */}
      <line x1="9.5" y1="9" x2="9.5" y2="17" stroke="#232154" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="9" x2="12" y2="17" stroke="#232154" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="9" x2="14.5" y2="17" stroke="#232154" strokeWidth="1.5" strokeLinecap="round" />
    </SvgBase>
  );
}

// 11. Pencil / Edit Icon (Mint body, Pink eraser)
export function PencilEditIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <g transform="rotate(45 12 12)">
        {/* Eraser (Pink) */}
        <rect x="10" y="2" width="4" height="3" rx="0.5" fill="#fecdd3" stroke="#232154" strokeWidth="1.5" />
        {/* Body (Mint) */}
        <rect x="10" y="5" width="4" height="11" fill="#bbf7d0" stroke="#232154" strokeWidth="1.5" />
        {/* Tip (Yellow with dark lead) */}
        <path d="M10 16L12 21L14 16H10Z" fill="#fef08a" stroke="#232154" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 18.5L12 21L13 18.5H11Z" fill="#232154" />
      </g>
    </SvgBase>
  );
}

// 12. Chat / Comment Icon (Sky blue bubble with dots)
export function CommentChatIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <path
        d="M12 3.5C6.75 3.5 2.5 7.08 2.5 11.5C2.5 13.9 3.6 16.03 5.4 17.5L4 21L8 19.5C9.25 19.95 10.6 20.2 12 20.2C17.25 20.2 21.5 16.62 21.5 12.2C21.5 7.78 17.25 3.5 12 3.5Z"
        fill="#bae6fd"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 3 dots inside */}
      <circle cx="8" cy="11.5" r="1.2" fill="#232154" />
      <circle cx="12" cy="11.5" r="1.2" fill="#232154" />
      <circle cx="16" cy="11.5" r="1.2" fill="#232154" />
    </SvgBase>
  );
}

// 13. Tag / Label Icon (Yellow front, coral back)
export function TagLabelIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Back tag (coral) */}
      <path
        d="M5 14L10 19L18 11V6H13L5 14Z"
        fill="#fecdd3"
        stroke="#232154"
        strokeWidth="1.5"
      />
      {/* Front tag (yellow) */}
      <path
        d="M3 11L8 16L16 8V3H11L3 11Z"
        fill="#fde047"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Tag hole */}
      <circle cx="13" cy="6" r="1.3" fill="#ffffff" stroke="#232154" strokeWidth="1.5" />
    </SvgBase>
  );
}

// 14. Folder / Initiatives Icon (Mint folder with paper)
export function FolderInitiativeIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Paper sticking out */}
      <rect x="6.5" y="4" width="11" height="8" rx="1.5" fill="#ffffff" stroke="#232154" strokeWidth="1.5" />
      <line x1="8.5" y1="7" x2="15.5" y2="7" stroke="#232154" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8.5" y1="9.5" x2="13.5" y2="9.5" stroke="#232154" strokeWidth="1.2" strokeLinecap="round" />
      {/* Folder body (Mint) */}
      <path
        d="M2.5 8C2.5 6.9 3.4 6 4.5 6H8L10 8H19.5C20.6 8 21.5 8.9 21.5 10V18C21.5 19.1 20.6 20 19.5 20H4.5C3.4 20 2.5 19.1 2.5 18V8Z"
        fill="#bbf7d0"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

// 15. Target / Goal Icon (Coral & Yellow rings with arrow)
export function TargetGoalIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Outer ring (Coral) */}
      <circle cx="11" cy="13" r="8" fill="#fecdd3" stroke="#232154" strokeWidth="1.8" />
      {/* Middle ring (White) */}
      <circle cx="11" cy="13" r="5.5" fill="#ffffff" stroke="#232154" strokeWidth="1.5" />
      {/* Bullseye (Yellow) */}
      <circle cx="11" cy="13" r="3" fill="#fde047" stroke="#232154" strokeWidth="1.5" />
      {/* Arrow hitting target */}
      <line x1="11" y1="13" x2="20" y2="4" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      {/* Arrow feathers (Mint) */}
      <path d="M17 3L21 4L20 8" fill="#bbf7d0" stroke="#232154" strokeWidth="1.5" strokeLinejoin="round" />
    </SvgBase>
  );
}

// 16. Plus / Add Icon (Pill shaped blue with bold plus)
export function PlusAddIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="#bae6fd"
        stroke="#232154"
        strokeWidth="1.8"
      />
      <line x1="12" y1="7.5" x2="12" y2="16.5" stroke="#232154" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="7.5" y1="12" x2="16.5" y2="12" stroke="#232154" strokeWidth="2.2" strokeLinecap="round" />
    </SvgBase>
  );
}

// 17. Arrow Right Icon (Mint filled chunky arrow)
export function ArrowRightChunkyIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <path
        d="M4 12H18M18 12L12.5 6.5M18 12L12.5 17.5"
        stroke="#232154"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

// 18. Trophy / Achievement Icon (Yellow cup with lavender base)
export function TrophyAwardIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      {/* Cup body (Yellow) */}
      <path
        d="M6 4H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V4Z"
        fill="#fde047"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Handles */}
      <path
        d="M6 6H3C2.4 6 2 6.4 2 7V9C2 10.7 3.3 12 5 12H6"
        fill="#fef08a"
        stroke="#232154"
        strokeWidth="1.6"
      />
      <path
        d="M18 6H21C21.6 6 22 6.4 22 7V9C22 10.7 20.7 12 19 12H18"
        fill="#fef08a"
        stroke="#232154"
        strokeWidth="1.6"
      />
      {/* Stem */}
      <rect x="10.5" y="16" width="3" height="3" fill="#fde047" stroke="#232154" strokeWidth="1.6" />
      {/* Base (Lavender) */}
      <rect x="7" y="19" width="10" height="3" rx="1" fill="#ddd6fe" stroke="#232154" strokeWidth="1.8" />
      {/* Star emblem */}
      <circle cx="12" cy="9.5" r="1.5" fill="#232154" />
    </SvgBase>
  );
}

// 19. Send / Paper Plane Icon (Sky Blue)
export function SendPlaneIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <path
        d="M21 3L3 10.5L10.5 13.5L13.5 21L21 3Z"
        fill="#bae6fd"
        stroke="#232154"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <line x1="10.5" y1="13.5" x2="21" y2="3" stroke="#232154" strokeWidth="1.6" strokeLinecap="round" />
    </SvgBase>
  );
}

// 20. Close / Cross Icon (Coral circle with cross)
export function CloseCrossIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <circle cx="12" cy="12" r="8.5" fill="#fecdd3" stroke="#232154" strokeWidth="1.6" />
      <line x1="9" y1="9" x2="15" y2="15" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="#232154" strokeWidth="1.8" strokeLinecap="round" />
    </SvgBase>
  );
}

// 21. CheckSquare Icon
export function CheckSquarePastelIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <SvgBase className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill="#bbf7d0" stroke="#232154" strokeWidth="1.8" />
      <path d="M7.5 12L10.5 15L16.5 8" stroke="#232154" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </SvgBase>
  );
}
