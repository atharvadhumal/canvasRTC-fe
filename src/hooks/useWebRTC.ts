import { useEffect, useRef, useState } from 'react';
import { WS_BASE } from '../config';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface UseWebRTCProps {
  roomId: string;
  userId: string;
}

type CaptureStreamCanvas = HTMLCanvasElement & {
  captureStream?: (fps?: number) => MediaStream;
};

// Fallback synthetic video stream when no physical camera is detected
function createFallbackStream(): MediaStream {
  const canvas = document.createElement('canvas') as CaptureStreamCanvas;
  canvas.width = 320;
  canvas.height = 240;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#110f22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#7c3aed';
    ctx.font = '16px sans-serif';
    ctx.fillText('No Camera Detected', 80, 125);
  }

  return canvas.captureStream ? canvas.captureStream(10) : new MediaStream();
}

async function getLocalMediaStream(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } catch {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch {
      try {
        return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      } catch {
        console.warn('No physical media devices found. Using fallback placeholder.');
        return createFallbackStream();
      }
    }
  }
}

export function useWebRTC({ roomId, userId }: UseWebRTCProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Record<string, MediaStream>>({});

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    const currentPeerConnections = peerConnections.current;
    socketRef.current = ws;

    async function init() {
      const stream = await getLocalMediaStream();
      localStreamRef.current = stream;
      setLocalStream(stream);

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'JOIN_ROOM',
            roomId,
            userId,
          })
        );
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          const { type, payload, userId: senderId } = message;

          switch (type) {
            case 'EXISTING_PEERS': {
              const existingPeers: string[] = payload.peers;
              existingPeers.forEach((peerId) => {
                if (peerId !== userId) {
                  createPeerConnection(peerId, true);
                }
              });
              break;
            }

            case 'USER_JOINED': {
              if (payload.newPeerId !== userId) {
                createPeerConnection(payload.newPeerId, false);
              }
              break;
            }

            case 'SIGNAL_OFFER': {
              const pc = peerConnections.current[senderId] || createPeerConnection(senderId, false);
              await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);

              ws.send(
                JSON.stringify({
                  type: 'SIGNAL_ANSWER',
                  roomId,
                  userId,
                  targetId: senderId,
                  payload: { answer },
                })
              );
              break;
            }

            case 'SIGNAL_ANSWER': {
              const pc = peerConnections.current[senderId];
              if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
              }
              break;
            }

            case 'ICE_CANDIDATE': {
              const pc = peerConnections.current[senderId];
              if (pc && payload.candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
              }
              break;
            }

            case 'USER_LEFT': {
              const pc = peerConnections.current[senderId];
              if (pc) {
                pc.close();
                delete peerConnections.current[senderId];
              }
              setPeers((prev) => {
                const updated = { ...prev };
                delete updated[senderId];
                return updated;
              });
              break;
            }
          }
        } catch (err) {
          console.error('Signaling parse error:', err);
        }
      };
    }

    function createPeerConnection(peerId: string, isInitiator: boolean) {
      if (peerConnections.current[peerId]) {
        return peerConnections.current[peerId];
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnections.current[peerId] = pc;

      pc.ontrack = (event) => {
        setPeers((prev) => ({
          ...prev,
          [peerId]: event.streams[0],
        }));
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.send(
            JSON.stringify({
              type: 'ICE_CANDIDATE',
              roomId,
              userId,
              targetId: peerId,
              payload: { candidate: event.candidate },
            })
          );
        }
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      if (isInitiator) {
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            socketRef.current?.send(
              JSON.stringify({
                type: 'SIGNAL_OFFER',
                roomId,
                userId,
                targetId: peerId,
                payload: { offer: pc.localDescription },
              })
            );
          })
          .catch((err) => console.error('Failed to create offer:', err));
      }

      return pc;
    }

    void init();

    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      Object.values(currentPeerConnections).forEach((pc) => pc.close());
      ws.close();
      socketRef.current = null;
    };
  }, [roomId, userId]);

  return { localStream, peers, socketRef };
}