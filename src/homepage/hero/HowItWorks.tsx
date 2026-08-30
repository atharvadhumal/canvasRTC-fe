const steps = [
  {
    number: "01",
    title: "Create a Room",
    description:
      "Instantly deploy an encrypted canvas workspace room with a single click.",
  },
  {
    number: "02",
    title: "Invite Your Team",
    description:
      "Share secure links with colleagues, clients, or cross-functional partners.",
  },
  {
    number: "03",
    title: "Collaborate & Chat",
    description:
      "Brainstorm, map ideas, jump into video calls on the same screen.",
  },
  {
    number: "04",
    title: "Save & Export",
    description:
      "Download vector snapshots or lock historical canvases effortlessly.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#090714] px-10 py-24 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#7C3AED]">
            Three Minutes to Launch
          </p>

          <h2 className="text-4xl font-bold tracking-tight sm:text-4xl">
            How CanvasRTC Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative text-center"
            >
              {/* Connector */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[calc(50%+35px)] top-5 hidden w-[calc(100%-70px)] border-t border-dashed border-[#292347] lg:block" />
              )}

              {/* Number */}
              <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#292347] bg-[#17132F] text-[11px] font-semibold text-[#7C3AED]">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-md font-semibold">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mx-auto max-w-[220px] text-sm leading-5 text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;