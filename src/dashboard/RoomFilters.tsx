import React from 'react';
import { FiSearch } from 'react-icons/fi';
import type { TabType } from './types';

interface RoomFiltersProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const RoomFilters: React.FC<RoomFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="mt-10 flex items-center justify-between border-b border-[#1c1935] pb-2">
      {/* Filter Tabs */}
      <div className="flex items-center gap-8 text-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 font-semibold transition relative ${
            activeTab === 'all'
              ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7c3aed]'
              : 'text-[#8f8bb1] hover:text-white'
          }`}
        >
          All Rooms
        </button>
        <button
          onClick={() => setActiveTab('owned')}
          className={`pb-3 font-semibold transition relative ${
            activeTab === 'owned'
              ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7c3aed]'
              : 'text-[#8f8bb1] hover:text-white'
          }`}
        >
          Owned by me
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`pb-3 font-semibold transition relative ${
            activeTab === 'joined'
              ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7c3aed]'
              : 'text-[#8f8bb1] hover:text-white'
          }`}
        >
          Joined
        </button>
      </div>

      {/* Search Box */}
      <div className="relative w-80 mb-2">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#585375] text-base" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rooms or templates..."
          className="w-full h-10 bg-[#120f26] border border-[#211e3b] focus:border-[#7c3aed] rounded-xl pl-10 pr-4 text-xs text-white placeholder-[#585375] outline-none transition"
        />
      </div>
    </div>
  );
};