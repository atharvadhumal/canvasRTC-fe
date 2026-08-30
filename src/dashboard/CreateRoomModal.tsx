import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !title.trim()) return;
    setIsCreating(true);

    try {
      const res = await fetch(`${API_BASE}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.room) {
        onClose();
        setTitle('');
        navigate(`/room/${data.room.code}`);
      }
    } catch (err) {
      console.error('Error creating room:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#110f22] border border-[#211e3b] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-1">Create a New Board</h2>
        <p className="text-xs text-[#8f8bb1] mb-5">
          Give your collaborative workspace a title.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sprint Planning Board"
            className="w-full h-11 bg-[#1a172f]/80 border border-[#2a264a] focus:border-[#7c3aed] rounded-xl px-4 text-sm text-white placeholder-[#504c6f] outline-none transition"
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
              disabled={isCreating || !title.trim()}
              className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition"
            >
              {isCreating ? 'Creating...' : 'Deploy Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};