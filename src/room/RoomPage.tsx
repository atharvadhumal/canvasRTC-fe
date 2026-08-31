import React, { useRef, useEffect, useId } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUsers, FiShare2, FiArrowLeft } from "react-icons/fi";
import { QuickDrawCanvas } from "./TLDrawCanvas";
import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../context/AuthContext";

// Dedicated Video Tile component to cleanly manage media streams
const VideoTile: React.FC<{
  stream: MediaStream;
  label: string;
  isLocal?: boolean;
}> = ({ stream, label, isLocal }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`relative w-44 h-28 rounded-xl overflow-hidden bg-[#110f22] shadow-2xl ${
        isLocal ? "ring-2 ring-[#7c3aed]" : "ring-1 ring-[#211e3b]"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
      />
      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur">
        {label}
      </span>
    </div>
  );
};

const getParticipantColor = (value: string) => {
  const palette = [
    "#a78bfa",
    "#34d399",
    "#fbbf24",
    "#f472b6",
    "#60a5fa",
    "#fb7185",
    "#22d3ee",
    "#f87171",
  ];

  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
};

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const activeRoomId = roomId || "default-room";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [boardConnected, setBoardConnected] = React.useState(false);

  // Stable guest identifier fallback without impure useMemo
  const generatedId = useId();
  const userId = user?.id || `guest-${generatedId.replace(/:/g, "")}`;
  const userName = user?.name || "Guest User";

  // Connect WebRTC video mesh
  const { localStream, peers, socketRef } = useWebRTC({ roomId: activeRoomId, userId });

  const participants = [
    { id: userId, label: userName || "You", isYou: true },
    ...Object.keys(peers).map((peerId) => ({
      id: peerId,
      label: `Peer ${peerId.slice(0, 6)}`,
      isYou: false,
    })),
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room invite link copied to clipboard!");
  };

  const handleResetBoard = () => {
    window.dispatchEvent(new CustomEvent(`quickdraw-reset:${activeRoomId}`));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070611] font-sans">
      {/* Top Floating Action Bar */}
      <header className="absolute top-0 left-0 right-0 h-14 z-20 flex items-center justify-between px-5 bg-[#0c0a1a]/85 backdrop-blur-md border-b border-[#1a172f] text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-[#8f8bb1] hover:text-white hover:bg-[#1b1738] rounded-lg transition"
            title="Back to Dashboard"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <span className="font-semibold text-xs tracking-wide text-[#8f8bb1]">
            Room:{" "}
            <span className="text-[#a78bfa] font-mono font-bold">
              {activeRoomId}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141129] border border-[#231e42] rounded-lg text-xs text-[#8f8bb1]">
            <span className={`h-2 w-2 rounded-full ${boardConnected ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span>{boardConnected ? "Board synced" : "Board syncing"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141129] border border-[#231e42] rounded-lg text-xs text-[#8f8bb1]">
            <FiUsers className="text-xs text-[#7c3aed]" />
            <span>{Object.keys(peers).length + 1} Online</span>
          </div>
          <button
            onClick={handleResetBoard}
            className="px-3.5 py-1.5 border border-[#3a315f] bg-[#120f22] text-[#d5d1ee] text-xs font-semibold rounded-lg hover:bg-[#1b1738] transition"
          >
            Reset board
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold rounded-lg shadow-md shadow-[#7c3aed]/20 transition active:scale-[0.98]"
          >
            <FiShare2 className="text-xs" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Multi-User Synced Canvas */}
      <div className="w-full h-full pt-14 relative">
        <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2 max-w-[60%] pointer-events-none">
          {participants.map((participant) => {
            const color = getParticipantColor(participant.id);
            return (
              <div
                key={participant.id}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#120f22]/80 px-2.5 py-1.5 shadow-lg backdrop-blur-sm"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] font-semibold text-[#e7e3ff] tracking-wide">
                  {participant.label}
                </span>
              </div>
            );
          })}
        </div>

        <QuickDrawCanvas
          roomId={activeRoomId}
          userId={userId}
          userName={userName}
          socketRef={socketRef}
          onConnectionChange={setBoardConnected}
        />
      </div>

      {/* Floating WebRTC Video Mesh Sidebar Overlay */}
      <aside className="absolute bottom-6 right-6 z-30 flex flex-row-reverse items-end gap-3 pointer-events-auto">
        {localStream && (
          <VideoTile stream={localStream} label="You" isLocal={true} />
        )}

        {Object.entries(peers).map(([peerId, stream]) => (
          <VideoTile
            key={peerId}
            stream={stream}
            label={peerId}
            isLocal={false}
          />
        ))}
      </aside>
    </div>
  );
};

export default RoomPage;
