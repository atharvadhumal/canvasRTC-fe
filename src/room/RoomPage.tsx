import React, { useRef, useEffect, useId } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUsers, FiShare2, FiArrowLeft } from "react-icons/fi";
import { TLDrawCanvas } from "./TLDrawCanvas";
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

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const activeRoomId = roomId || "default-room";
  const navigate = useNavigate();
  const { user } = useAuth();

  // Stable guest identifier fallback without impure useMemo
  const generatedId = useId();
  const userId = user?.id || `guest-${generatedId.replace(/:/g, "")}`;
  const userName = user?.name || "Guest User";

  // Connect WebRTC video mesh
  const { localStream, peers } = useWebRTC({ roomId: activeRoomId, userId });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room invite link copied to clipboard!");
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141129] border border-[#231e42] rounded-lg text-xs text-[#8f8bb1]">
            <FiUsers className="text-xs text-[#7c3aed]" />
            <span>{Object.keys(peers).length + 1} Online</span>
          </div>
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
      <div className="w-full h-full pt-14">
        <TLDrawCanvas
          roomId={activeRoomId}
          userId={userId}
          userName={userName}
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
