import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="border-t border-[#292347] bg-[#0D0A1F] px-10 py-5 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left */}
        <p className="text-sm text-gray-500">
          Created by{" "}
          <span className="text-white">Atharva Dhumal</span>
        </p>

        {/* Right */}
        <div className="flex items-center gap-4">
          <a
            href="http://www.linkedin.com/in/atharvadhumal24"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition hover:text-[#7C3AED]"
          >
            <FaLinkedin size={18} />
          </a>

          <a
            href="https://github.com/atharvadhumal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition hover:text-[#7C3AED]"
          >
            <FaGithub size={18} />
          </a>

          <a
            href="mailto:atharvadhumal256@gmail.com"
            rel="noopener noreferrer"
            className="text-gray-500 transition hover:text-[#7C3AED]"
          >
            <SiGmail  size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
