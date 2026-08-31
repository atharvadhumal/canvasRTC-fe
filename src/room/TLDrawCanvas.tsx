import React, { useEffect } from 'react';
import { Quickdraw, useQuickdrawStore } from '@quickdrawjs/react';
import '@quickdrawjs/core/quickdraw.css';

interface QuickDrawCanvasProps {
  roomId: string;
  userId: string;
  userName: string;
  socketRef: React.RefObject<WebSocket | null>;
  onConnectionChange?: (connected: boolean) => void;
}

export const QuickDrawCanvas: React.FC<QuickDrawCanvasProps> = ({
  roomId,
  userId,
  userName,
  socketRef,
  onConnectionChange,
}) => {
  const store = useQuickdrawStore();

  useEffect(() => {
    const key = `quickdraw:${roomId}:${userId}`;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (parsed && typeof parsed === 'object') {
          store.loadSnapshot(parsed as never);
        }
      }
    } catch (error) {
      console.warn('Failed to restore Quickdraw snapshot', error);
    }

    const unsubscribe = store.listen((_diff, source) => {
      if (source === 'user') {
        const snapshot = store.getSnapshot();
        localStorage.setItem(key, JSON.stringify(snapshot));

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(
            JSON.stringify({
              type: 'BOARD_SYNC',
              roomId,
              userId,
              payload: { diff: _diff, snapshot },
            })
          );
        }
      }
    });

    const resetHandler = () => {
      store.clear('user');
      localStorage.removeItem(key);
    };

    window.addEventListener(`quickdraw-reset:${roomId}`, resetHandler);

    return () => {
      unsubscribe();
      window.removeEventListener(`quickdraw-reset:${roomId}`, resetHandler);
    };
  }, [roomId, socketRef, store, userId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      onConnectionChange?.(false);
      return;
    }

    const updateStatus = () => {
      onConnectionChange?.(socket.readyState === WebSocket.OPEN);
    };

    updateStatus();

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as {
          type?: string;
          roomId?: string;
          userId?: string;
          payload?: { diff?: unknown; snapshot?: unknown };
        };

        if (message.type === 'BOARD_SYNC_REQUEST' && message.roomId === roomId) {
          socket.send(
            JSON.stringify({
              type: 'BOARD_SYNC',
              roomId,
              userId,
              payload: { snapshot: store.getSnapshot() },
            })
          );
          return;
        }

        if (message.type !== 'BOARD_SYNC' || message.roomId !== roomId || message.userId === userId) {
          return;
        }

        if (message.payload?.diff) {
          store.applyDiff(message.payload.diff as never, 'remote');
        }

        if (message.payload?.snapshot) {
          store.loadSnapshot(message.payload.snapshot as never, 'remote');
        }
      } catch (error) {
        console.warn('Quickdraw board sync error', error);
      }
    };

    const handleOpen = () => {
      updateStatus();
      socket.send(
        JSON.stringify({
          type: 'BOARD_SYNC_REQUEST',
          roomId,
          userId,
        })
      );
    };

    const handleClose = () => updateStatus();

    socket.addEventListener('message', handleMessage);
    socket.addEventListener('open', handleOpen);
    socket.addEventListener('close', handleClose);
    socket.addEventListener('error', handleClose);

    return () => {
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('close', handleClose);
      socket.removeEventListener('error', handleClose);
    };
  }, [onConnectionChange, roomId, socketRef, store, userId]);

  useEffect(() => {
    if (!userName) return;
    const board = document.querySelector('[data-board-root]');
    if (board) {
      board.setAttribute('data-author', userName);
    }
  }, [userName]);

  return (
    <div className="w-full h-full relative">
      <Quickdraw
        store={store}
        theme="dark"
        grid="lines"
        autoFit
        className="w-full h-full"
      />
    </div>
  );
};

export const TLDrawCanvas = QuickDrawCanvas;
export default QuickDrawCanvas;