import { HiOutlineSparkles } from "react-icons/hi";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { HiUserAdd } from "react-icons/hi";
import { TfiReload } from "react-icons/tfi";
import { MdVideoCall } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import heroRightPreview from "../../assets/hero-right-preview.png";

interface HeroProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const Hero = ({ onCreateRoom, onJoinRoom }: HeroProps) => {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-8 px-4 py-12 text-white sm:px-6 sm:py-16 lg:min-h-screen lg:grid-cols-2 lg:gap-0 lg:px-10 lg:py-0">
      {/* Left side */}
      <div className="relative flex flex-col justify-center lg:min-h-screen lg:p-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center justify-center gap-1 self-start rounded-2xl border border-[#9D4EDD] bg-[#7C3AED]/10 px-4 py-1 text-[#9D4EDD]">
            <HiOutlineSparkles color="#9D4EDD" />
            Collaboration Engine
          </div>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Collaborate. Draw.
            <br />
            Connect in <span className="text-all-button">Real-Time.</span>
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Experience seamless digital whiteboard collaboration combined with
            latency-free high-definition video and audio streaming, built
            directly inside your browser.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={onCreateRoom}
              className="flex items-center justify-center gap-1 rounded-lg bg-all-button px-5 py-3 hover:bg-all-button-hover"
            >
              <HiOutlinePlusSmall size={22} />
              Create a Room
            </button>

            <button
              type="button"
              onClick={onJoinRoom}
              className="flex items-center justify-center gap-1 rounded-lg border border-gray-700 px-5 py-3 hover:border-all-button hover:bg-all-button/10"
            >
              <HiUserAdd />
              Join with Code
            </button>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-5">
            <div className="flex items-center gap-2">
              <TfiReload className="rounded-md bg-[#181432] p-2.5 sm:p-3" color="#7C3AED" />
              <p>Real-time Sync</p>
            </div>
            <div className="flex items-center gap-2">
              <MdVideoCall className="rounded-md bg-[#181432] p-2.5 text-[#7C3AED] sm:p-3" color="#7C3AED" />
              <p>P2P Video and Audio</p>
            </div>
            <div className="flex items-center gap-2">
              <GrSecure className="rounded-md bg-[#181432] p-2.5 text-all-button sm:p-3" color="#7C3AED" />
              <p>Secure and Private</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center px-2 lg:px-0">
        <img
          src={heroRightPreview}
          alt="hero-right preview"
          className="w-full max-w-md lg:max-w-xl"
        />
      </div>
    </section>
  );
};

export default Hero;
