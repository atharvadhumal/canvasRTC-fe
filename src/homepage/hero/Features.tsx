import { GrSecure } from "react-icons/gr";
import { FaMicrophone } from "react-icons/fa6";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaSave } from "react-icons/fa";

const features = [
  {
    icon: AiFillThunderbolt,
    title: "Real-time Canvas Sync",
    description:
      "No lag, zero friction. Instant edits across your canvas with hundreds of simultaneous collaborators.",
  },
  {
    icon: FaMicrophone,
    title: "Integrated Video & Audio",
    description:
      "High-definition WebRTC browser communication side-by-side with your brainstorm session.",
  },
  {
    icon: FaSave,
    title: "Auto Save Snapshots",
    description:
      "Every stroke and node is automatically backed up. Travel back through your workspace history instantly.",
  },
  {
    icon: GrSecure,
    title: "Secure & Scalable",
    description:
      "Fully end-to-end encrypted rooms with robust peer matching and optimized decentralized server relays.",
  },
];

const Features = () => {
  return (
    <section id="features" className="scroll-mt-24 bg-[#0D0A1F] px-10 py-24 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#7C3AED]">
            Features Built for Creative Teams
          </p>

          <h2 className="text-4xl font-bold tracking-tight">
            Everything You Need to Build Together
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            Powerful tools designed to make real-time collaboration simple,
            fast, and seamless.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="min-h-[230px] rounded-xl border border-[#292347] bg-[#17132F] p-6 transition-all duration-300 hover:border-[#7C3AED]/50 hover:bg-[#1A1636]"
              >
                {/* Icon */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#24184A]">
                  <Icon
                    size={21}
                    className="text-[#7C3AED]"
                  />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-base font-semibold">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;