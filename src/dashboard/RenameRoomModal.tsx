import React, { useState, useEffect } from 'react';

interface RenameRoomModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onRename: (newTitle: string) => Promise<void>;
}

export const RenameRoomModal: React.FC<RenameRoomModalProps> = ({
  isOpen,
  currentTitle,
  onClose,
  onRename,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onRename(title.trim());
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#110f22] border border-[#211e3b] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-1">Rename Board</h2>
        <p className="text-xs text-[#8f8bb1] mb-5">Enter a new title for this whiteboard room.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 bg-[#1a172f]/80 border border-[#2a264a] focus:border-[#7c3aed] rounded-xl px-4 text-sm text-white outline-none transition"
          />

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8f8bb1] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition"
            >
              {loading ? 'Saving...' : 'Save Title'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};