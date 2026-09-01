import React, { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { randomAvataaarsUrl } from '../lib/avataaars';
import { UserAvatar } from '../components/UserAvatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || randomAvataaarsUrl());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(user?.name || '');
    setAvatarUrl(user?.avatarUrl || randomAvataaarsUrl());
    setError('');
  }, [isOpen, user?.avatarUrl, user?.name]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await updateProfile({ name: name.trim(), avatarUrl });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#110f22] border border-[#211e3b] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-1">Edit profile</h2>
        <p className="text-xs text-[#8f8bb1] mb-5">
          Change your display name and pick a random Avataaars avatar.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <UserAvatar name={name} avatarUrl={avatarUrl} size={96} />
            <button
              type="button"
              onClick={() => setAvatarUrl(randomAvataaarsUrl())}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#3a315f] bg-[#120f22] text-[#d5d1ee] text-xs font-semibold rounded-lg hover:bg-[#1b1738] transition"
            >
              <FiRefreshCw className="text-xs" />
              Random avatar
            </button>
            <a
              href="https://getavataaars.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-[#8f8bb1] hover:text-[#a78bfa] transition"
            >
              Avataaars by Pablo Stanley
            </a>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8f8bb1] mb-1.5">Display name</label>
            <input
              type="text"
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 bg-[#1a172f]/80 border border-[#2a264a] focus:border-[#7c3aed] rounded-xl px-4 text-sm text-white placeholder-[#504c6f] outline-none transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8f8bb1] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition"
            >
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
