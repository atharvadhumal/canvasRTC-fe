import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';

const Navbar = () => {


  const navItems = [
    {
      label: "Features",
      href: "/",
      //icon: <AiOutlineHome />
    },
    {
      label: "How it Works",
      href: "/about",
      //icon: <AiOutlineUser />
    },
    {
      label: "Pricing",
      href: "/projects",
      //icon: <AiOutlineFundProjectionScreen />
    },
    {
      label: "Docs",
      href: "/resume",
      //icon: <CgFileDocument />
    },
    {
      label: "Contact Us",
      href: "/contact",
      //icon: <LuContactRound />
    },
  ];
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center py-6 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 backdrop-blur-md border-b border-neutral-700/80 ">
      <div className="flex items-center gap-1 sm:gap-2 font-bold text-white">
        <img src={logo} alt="logo" />
        <span className="text-xl">
          Canvas<span className="text-all-button font-extrabold">RTC</span>
        </span>
      </div>

      <div className="flex items-center gap-10 list-none text-white/80">
        {navItems.map((item, index) => (
          <li key={index}>
            <a href={item.href}></a>
            <span>{item.label}</span>
          </li>
        ))}
      </div>

      <div className="flex items-center gap-6 text-white font-semibold">
        <Link to="/login" className="transition hover:text-white/90">
          Login
        </Link>

        <Link
          to="/register"
          className="bg-all-button hover:bg-all-button-hover text-white px-5 py-2 rounded-xl inline-block transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
