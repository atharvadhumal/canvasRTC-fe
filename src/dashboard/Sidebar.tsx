import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiTrash2,
  FiClock,
  FiStar,
  FiLayout,
  FiGrid,
  FiHome,
  FiUser,
  FiUsers,
  FiLogOut,
} from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSelectSection }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'rooms', label: 'Rooms', icon: FiGrid, badge: 'LIVE' },
    { id: 'templates', label: 'Templates', icon: FiLayout },
    { id: 'starred', label: 'Starred', icon: FiStar },
    { id: 'recents', label: 'Recents', icon: FiClock },
    { id: 'trash', label: 'Trash', icon: FiTrash2 },
  ];

  return (
    <aside className="w-64 border-r border-[#1a172f] bg-[#0c0a1a] flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="h-20 flex items-center gap-2.5 px-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#9333ea] flex items-center justify-center text-white text-base shadow-lg shadow-[#7c3aed]/30">
            <IoSparkles />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Canvas<span className="text-[#7c3aed]">RTC</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
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
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Workspaces Section */}
        <div className="mt-8 px-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#585375]">
            Workspaces
          </span>
          <div className="mt-2.5 flex flex-col gap-1 -mx-3">
            <button
              onClick={() => onSelectSection('personal')}
              className={`flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                currentSection === 'personal'
                  ? 'bg-[#1b1738] text-white'
                  : 'text-[#8f8bb1] hover:text-white hover:bg-[#15122b]'
              }`}
            >
              <FiUser className="text-lg" />
              <span>Personal</span>
            </button>
            <button
              onClick={() => onSelectSection('team')}
              className={`flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                currentSection === 'team'
                  ? 'bg-[#1b1738] text-white'
                  : 'text-[#8f8bb1] hover:text-white hover:bg-[#15122b]'
              }`}
            >
              <FiUsers className="text-lg" />
              <span>Team Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-[#1a172f] flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <button className="flex items-center gap-2 text-xs text-[#8f8bb1] hover:text-white transition">
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

        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white font-bold overflow-hidden border border-[#2c2652]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-semibold text-white truncate">
              {user?.name || 'John Doe'}
            </span>
            <span className="text-[10px] text-[#8f8bb1] truncate">
              {user?.email || 'user@canvasrtc.com'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};