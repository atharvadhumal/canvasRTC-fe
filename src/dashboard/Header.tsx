import React from 'react';
import { FiPlus, FiLogIn, FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, onOpenJoinModal, onMenuToggle }) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'John';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="mt-0.5 rounded-xl border border-[#2a264a] bg-[#141129] p-2.5 text-[#dfe7ff] transition hover:bg-[#1b1738] lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu className="text-lg" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 sm:text-3xl">
            <span className="truncate">Welcome back, {firstName}</span>
            <span className="shrink-0">👋</span>
          </h1>
          <p className="text-sm text-[#8f8bb1] mt-1">
            Select an active room or deploy a fresh whiteboard session.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
        <button
          onClick={onOpenJoinModal}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#2a264a] bg-[#141129] px-4 text-sm font-semibold text-[#dfe7ff] transition hover:bg-[#1b1738] sm:flex-none"
        >
          <FiLogIn className="text-base" />
          <span>Join Room</span>
        </button>

        <button
          onClick={onOpenCreateModal}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-5 text-sm font-semibold text-white shadow-lg shadow-[#7c3aed]/25 transition hover:bg-[#6d28d9] active:scale-[0.98] sm:flex-none"
        >
          <FiPlus className="text-lg" />
          <span>Create Room</span>
        </button>
      </div>
    </div>
  );
};
