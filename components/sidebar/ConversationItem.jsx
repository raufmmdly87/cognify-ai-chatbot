'use client';

import { useEffect, useRef, useState } from 'react';

function ConversationItem({
  title,
  isActive,
  onClick,
  onDelete,
  onRename,
  isDeleting,
  isRenaming,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRenameSubmit = () => {
    const trimmedTitle = draftTitle.trim();

    if (!trimmedTitle) {
      setDraftTitle(title);
      setIsEditing(false);
      return;
    }

    if (trimmedTitle !== title) {
      onRename(trimmedTitle);
    }

    setIsEditing(false);
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`group relative flex items-center gap-2 rounded-2xl border px-4 py-3 transition ${
        isActive
          ? 'border-white/10 bg-white/15'
          : 'border-white/5 bg-white/5 hover:bg-white/10'
      }`}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleRenameSubmit();
            }

            if (event.key === 'Escape') {
              setDraftTitle(title);
              setIsEditing(false);
              setIsMenuOpen(false);
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0B1020]/80 px-2 py-1 text-sm text-slate-100 outline-none focus:border-blue-400/40"
        />
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-sm font-medium text-slate-100">
            {title}
          </span>
        </button>
      )}

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
          aria-label="Conversation options"
          title="Conversation options"
        >
          ⋯
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-9 z-20 w-28 rounded-xl border border-white/10 bg-[#11182B] p-1 shadow-xl">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              disabled={isRenaming}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Rename
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen(false);
                onDelete();
              }}
              disabled={isDeleting}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationItem;