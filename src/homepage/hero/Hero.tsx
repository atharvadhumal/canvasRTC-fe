import heroRightPreview from "../../assets/hero-right-preview.png";
import { HiOutlineSparkles } from "react-icons/hi";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { HiUserAdd } from "react-icons/hi";
import { TfiReload } from "react-icons/tfi";
import { MdVideoCall } from "react-icons/md";
import { GrSecure } from "react-icons/gr";

const Hero = () => {
  return (
    <section className="grid min-h-screen grid-cols-2 text-white px-10">
      {/* Left side */}
      <div className="relative flex min-h-screen flex-col justify-center p-10">
        {/* Left content */}
        <div className="flex flex-col gap-8">
          {/* Badge */}
          <div className="self-start text-[#9D4EDD] px-4 py-1 bg-[#7C3AED]/10 border border-[#9D4EDD] rounded-2xl flex items-center justify-center gap-1">
            <HiOutlineSparkles color="#9D4EDD" />
            Collaboration Engine
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold">
            Collaborate. Draw.
            <br />
            Connect in <span className="text-all-button">Real-Time.</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-gray-400">
            Experience seamless digital whiteboard collaboration combined with
            latency-free high-definition video and audio streaming, built
            directly inside your browser.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="rounded-lg bg-all-button px-5 py-3 hover:bg-all-button-hover flex items-center justify-center gap-1">
              <HiOutlinePlusSmall size={22} />
              Create a Room
            </button>

            <button className="rounded-lg border border-gray-700 px-5 py-3 hover:border-all-button hover:bg-all-button/10 flex items-center justify-center gap-1">
              <HiUserAdd />
              Join with Code
            </button>
          </div>

          {/* Features */}
          <div className="flex gap-5 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <TfiReload className="rounded-md bg-[#181432] p-3" color="#7C3AED"/>
              <p>Real-time Sync</p>
            </div>
            <div className="flex items-center gap-1">
              <MdVideoCall className="rounded-md bg-[#181432] p-3 text-[#7C3AED]" color="#7C3AED"/>
              <p>P2P Video and Audio</p>
            </div>
            <div className="flex items-center gap-1">
              <GrSecure className="rounded-md bg-[#181432] p-3 text-all-button" color="#7C3AED"/>
              <p>Secure and Private</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center">
        <img
          src={heroRightPreview}
          alt="hero-right preview"
          className="w-full max-w-xl"
        />
      </div>
    </section>
  );
};

export default Hero;
