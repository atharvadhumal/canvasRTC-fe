import React, { useState } from 'react';
import { Tldraw, useTldrawCurrentUser, type TLUserPreferences } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync';
import 'tldraw/tldraw.css';

interface TLDrawCanvasProps {
  roomId: string;
  userId: string;
  userName: string;
}

export const TLDrawCanvas: React.FC<TLDrawCanvasProps> = ({ roomId, userId, userName }) => {
  const store = useSyncDemo({ roomId });

  const [userPreferences, setUserPreferences] = useState<TLUserPreferences>({
    id: userId,
    name: userName,
    color: '#7c3aed',
    colorScheme: 'light',
  });

  const user = useTldrawCurrentUser({
    userPreferences,
    setUserPreferences,
  });

  return (
    <div className="w-full h-full relative">
      <Tldraw store={store} user={user} autoFocus />
    </div>
  );
};

export default TLDrawCanvas;