import React from 'react';
import { FiPlus, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, onOpenJoinModal }) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'John';

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Welcome back, {firstName} <span>👋</span>
        </h1>
        <p className="text-sm text-[#8f8bb1] mt-1">
          Select an active room or deploy a fresh whiteboard session.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenJoinModal}
          className="h-11 px-4 bg-[#141129] border border-[#2a264a] hover:bg-[#1b1738] text-[#dfe7ff] font-semibold text-sm rounded-xl flex items-center gap-2 transition"
        >
          <FiLogIn className="text-base" />
          <span>Join Room</span>
        </button>

        <button
          onClick={onOpenCreateModal}
          className="h-11 px-5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.98]"
        >
          <FiPlus className="text-lg" />
          <span>Create Room</span>
        </button>
      </div>
    </div>
  );
};