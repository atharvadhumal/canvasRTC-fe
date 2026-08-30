import React, { useState, useEffect, useCallback } from 'react';
import { FiGrid } from 'react-icons/fi';
import { Oval } from 'react-loader-spinner';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RoomFilters } from './RoomFilters';
import { RoomCard } from './RoomCard';
import { CreateRoomModal } from './CreateRoomModal';
import { RenameRoomModal } from './RenameRoomModal';
import type { Room, TabType } from './types';

export const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [renameData, setRenameData] = useState<{ id: string; title: string } | null>(null);

  const fetchRooms = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (activeTab !== 'all') queryParams.append('filter', activeTab);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

      const res = await fetch(`http://localhost:3000/api/rooms?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.rooms) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, searchQuery]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle Delete Room
  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r.id !== roomId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete room');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Handle Rename Room
  const handleRenameRoom = async (newTitle: string) => {
    if (!renameData || !token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/rooms/${renameData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        setRooms((prev) =>
          prev.map((r) => (r.id === renameData.id ? { ...r, title: newTitle } : r))
        );
      }
    } catch (err) {
      console.error('Rename error:', err);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#070611] text-slate-100 font-sans antialiased overflow-hidden selection:bg-[#7c3aed] selection:text-white">
      {/* Left Sidebar */}
      <Sidebar currentSection={currentSection} onSelectSection={setCurrentSection} />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col overflow-y-auto px-12 py-10">
        <Header onOpenCreateModal={() => setShowCreateModal(true)} />

        <RoomFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Room Cards List */}
        <div className="mt-6 flex flex-col gap-3.5">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Oval
                visible={true}
                height="32"
                width="32"
                color="#7c3aed"
                secondaryColor="#211e3b"
                strokeWidth={4}
                strokeWidthSecondary={4}
                ariaLabel="loading-rooms"
              />
            </div>
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onDeleteRoom={handleDeleteRoom}
                onRenameRoom={(id, title) => setRenameData({ id, title })}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#211e3b] rounded-2xl text-center">
              <FiGrid className="text-4xl text-[#383161] mb-3" />
              <h2 className="text-base font-semibold text-white">No rooms found</h2>
              <p className="text-xs text-[#8f8bb1] mt-1 mb-4">
                Create a new board to start live visual brainstorming.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs rounded-lg transition"
              >
                Create Room
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateRoomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      
      <RenameRoomModal
        isOpen={!!renameData}
        currentTitle={renameData?.title || ''}
        onClose={() => setRenameData(null)}
        onRename={handleRenameRoom}
      />
    </div>
  );
};

export default Dashboard;