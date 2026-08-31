import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiMoreVertical, FiCopy, FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';
import type { LiveParticipant, Room } from './types';
import { UserAvatar } from '../components/UserAvatar';

interface RoomCardProps {
  room: Room;
  onDeleteRoom: (roomId: string) => void;
  onRenameRoom: (roomId: string, currentTitle: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onDeleteRoom, onRenameRoom }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const copiedTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    };
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyLink = () => {
    const roomUrl = `${window.location.origin}/room/${room.code}`;
    void navigator.clipboard.writeText(roomUrl);
    setMenuOpen(false);
  };

  const getRelativeTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) {
      const minutes = Math.max(1, Math.floor(diff / 60));
      return `${minutes} min ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const livePeople: LiveParticipant[] = room.liveParticipants ?? [];
  const visiblePeople =
    livePeople.length > 0
      ? livePeople
      : (room.members ?? []).map((member) => ({
          id: member.user.id,
          name: member.user.name,
          avatarUrl: member.user.avatarUrl,
        }));
  const extraCount = Math.max(0, visiblePeople.length - 3);

  return (
    <div className="flex items-center justify-between bg-[#110f22]/90 border border-[#211e3b] hover:border-[#383161] rounded-2xl px-5 py-3.5 transition group relative gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-[7.5rem] h-[4.25rem] rounded-xl bg-[#1b1738] border border-[#2c2652] overflow-hidden shrink-0">
          {room.thumbnail ? (
            <img
              src={room.thumbnail}
              alt={`${room.title} preview`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#7c3aed] text-xl">
              <FiGrid />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-bold text-white text-base tracking-tight truncate">
              {room.title}
            </span>
            {room.isLive && (
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 shrink-0">
                Live now
              </span>
            )}
          </div>
          <span className="text-xs text-[#6e6a8d] mt-1">
            {getRelativeTime(room.updatedAt)}
            {room.isLive && livePeople.length > 0
              ? ` · ${livePeople.length} inside`
              : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center -space-x-2">
          {visiblePeople.slice(0, 3).map((person) => (
            <UserAvatar
              key={person.id}
              name={person.name}
              avatarUrl={person.avatarUrl}
              size={28}
              className={`border-2 border-[#110f22] ${room.isLive ? 'ring-2 ring-emerald-400/80' : ''}`}
            />
          ))}
          {extraCount > 0 && (
            <div className="w-7 h-7 rounded-full bg-[#1f1b3a] border-2 border-[#110f22] flex items-center justify-center text-[10px] font-medium text-[#8f8bb1]">
              +{extraCount}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleCopyCode()}
          title="Copy join code"
          className="h-9 px-3 border border-[#2a264a] bg-[#141129] hover:bg-[#1b1738] text-[#d5d1ee] font-semibold text-xs rounded-xl flex items-center gap-2 transition"
        >
          {copied ? (
            <FiCheck className="text-sm text-emerald-400" />
          ) : (
            <FiCopy className="text-sm text-[#7c3aed]" />
          )}
          <span className="font-mono tracking-wide">{copied ? 'Copied' : room.code}</span>
        </button>

        <button
          onClick={() => navigate(`/room/${room.code}`)}
          className="h-9 px-5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs rounded-xl transition shadow-md shadow-[#7c3aed]/20"
        >
          Enter Room
        </button>

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
                onClick={() => {
                  setMenuOpen(false);
                  void handleCopyCode();
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#8f8bb1] hover:text-white hover:bg-[#1e193b] transition text-left"
              >
                <FiCopy className="text-sm text-[#7c3aed]" />
                <span>Copy join code</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#8f8bb1] hover:text-white hover:bg-[#1e193b] transition text-left"
              >
                <FiCopy className="text-sm" />
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
