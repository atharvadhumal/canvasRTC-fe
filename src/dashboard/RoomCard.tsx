import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiMoreVertical, FiCopy, FiTrash2, FiEdit2 } from 'react-icons/fi';
import type { Room } from './types';

interface RoomCardProps {
  room: Room;
  onDeleteRoom: (roomId: string) => void;
  onRenameRoom: (roomId: string, currentTitle: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onDeleteRoom, onRenameRoom }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    const roomUrl = `${window.location.origin}/room/${room.code}`;
    navigator.clipboard.writeText(roomUrl);
    alert('Room link copied to clipboard!');
    setMenuOpen(false);
  };

  const getRelativeTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `Last updated ${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `Last updated ${Math.floor(diff / 3600)} hour ago`;
    if (diff < 172800) return 'Last updated Yesterday';
    return `Last updated ${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="flex items-center justify-between bg-[#110f22]/90 border border-[#211e3b] hover:border-[#383161] rounded-2xl px-6 py-4.5 transition group relative">
      {/* Left Icon + Title Details */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1b1738] border border-[#2c2652] flex items-center justify-center text-[#7c3aed] text-xl">
          <FiGrid />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white text-base tracking-tight">
              {room.title}
            </span>
            {room.isLive && (
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40">
                LIVE
              </span>
            )}
          </div>
          <span className="text-xs text-[#6e6a8d] mt-1">
            {getRelativeTime(room.updatedAt)}
          </span>
        </div>
      </div>

      {/* Right Actions, Avatars & Dropdown */}
      <div className="flex items-center gap-6">
        {/* Avatars Stack */}
        <div className="flex items-center -space-x-2 overflow-hidden">
          {room.members?.slice(0, 3).map((m, idx) => (
            <div
              key={idx}
              className="w-7 h-7 rounded-full bg-[#272147] border-2 border-[#110f22] flex items-center justify-center text-[10px] font-bold text-white"
            >
              {m.user?.name ? m.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          ))}
          {room.members?.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-[#1f1b3a] border-2 border-[#110f22] flex items-center justify-center text-[10px] font-medium text-[#8f8bb1]">
              +{room.members.length - 3}
            </div>
          )}
        </div>

        {/* Enter Room Button */}
        <button
          onClick={() => navigate(`/room/${room.code}`)}
          className="h-9 px-5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs rounded-xl transition shadow-md shadow-[#7c3aed]/20"
        >
          Enter Room
        </button>

        {/* Options Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#585375] hover:text-white transition p-1.5 rounded-lg hover:bg-[#1b1738] text-lg"
          >
            <FiMoreVertical />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-44 bg-[#141129] border border-[#27224d] rounded-xl shadow-2xl py-1.5 z-30 flex flex-col">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#8f8bb1] hover:text-white hover:bg-[#1e193b] transition text-left"
              >
                <FiCopy className="text-sm text-[#7c3aed]" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRenameRoom(room.id, room.title);
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#8f8bb1] hover:text-white hover:bg-[#1e193b] transition text-left"
              >
                <FiEdit2 className="text-sm" />
                <span>Rename Board</span>
              </button>

              <div className="h-px bg-[#201c3d] my-1"></div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteRoom(room.id);
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
              >
                <FiTrash2 className="text-sm" />
                <span>Delete Room</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};