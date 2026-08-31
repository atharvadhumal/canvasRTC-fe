import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { joinRoomByCode, normalizeRoomCode } from '../api/rooms';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedCode = normalizeRoomCode(roomCode);
    if (!normalizedCode || !token) return;

    setError('');
    setLoading(true);

    try {
      const room = await joinRoomByCode(token, normalizedCode);
      onClose();
      setRoomCode('');
      navigate(`/room/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#110f22] border border-[#211e3b] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-1">Join a Room</h2>
        <p className="text-xs text-[#8f8bb1] mb-5">
          Enter the room code shared with you to jump into the live board.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <input
            type="text"
            required
            autoFocus
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="e.g. room-fc4a2b or fc4a2b"
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
              disabled={!roomCode.trim() || loading}
              className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;
