import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Footer = () => {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-[#292347] bg-[#0D0A1F] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7C3AED] mb-2">
            Contact
          </p>
          <p className="text-sm text-gray-500">
            Created by <span className="text-white">Atharva Dhumal</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href="https://www.linkedin.com/in/atharvadhumal24"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 break-all text-sm text-[#a8a3c7] transition hover:text-[#7C3AED] sm:break-normal"
          >
            <FaLinkedin size={16} />
            <span>linkedin.com/in/atharvadhumal24</span>
          </a>

          <a
            href="mailto:atharvadhumal256@gmail.com"
            className="flex items-center gap-2.5 break-all text-sm text-[#a8a3c7] transition hover:text-[#7C3AED] sm:break-normal"
          >
            <SiGmail size={16} />
            <span>atharvadhumal256@gmail.com</span>
          </a>

          <a
            href="https://github.com/atharvadhumal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 break-all text-sm text-[#a8a3c7] transition hover:text-[#7C3AED] sm:break-normal"
          >
            <FaGithub size={16} />
            <span>github.com/atharvadhumal</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
