import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiHome,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from '../components/UserAvatar';

interface SidebarProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  onOpenProfile: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  onOpenProfile,
  mobileOpen = false,
  onMobileClose,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onMobileClose?.();
  };

  const handleSelectSection = (section: string) => {
    onSelectSection(section);
    onMobileClose?.();
  };

  const handleOpenProfile = () => {
    onOpenProfile();
    onMobileClose?.();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between border-r border-[#1a172f] bg-[#0c0a1a] transition-transform duration-300 select-none lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#9333ea] flex items-center justify-center text-white text-base shadow-lg shadow-[#7c3aed]/30">
                <IoSparkles />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Canvas<span className="text-[#7c3aed]">RTC</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-2 text-[#8f8bb1] hover:bg-[#15122b] hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          <nav className="px-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                    isActive
                      ? 'bg-[#1b1738] text-white'
                      : 'text-[#8f8bb1] hover:text-white hover:bg-[#15122b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-lg ${isActive ? 'text-[#7c3aed]' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#1a172f] flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <button
              onClick={handleOpenProfile}
              className="flex items-center gap-2 text-xs text-[#8f8bb1] hover:text-white transition"
            >
              <FiSettings className="text-sm" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition"
              title="Log Out"
            >
              <FiLogOut className="text-sm" />
              <span>Logout</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenProfile}
            className="flex items-center gap-3 px-2 pt-2 text-left hover:bg-[#15122b] rounded-xl py-2 transition"
          >
            <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} size={40} />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-semibold text-white truncate">
                {user?.name || 'John Doe'}
              </span>
              <span className="text-[10px] text-[#8f8bb1] truncate">
                {user?.email || 'user@canvasrtc.com'}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
