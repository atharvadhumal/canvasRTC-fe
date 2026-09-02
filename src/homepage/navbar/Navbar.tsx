import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMenu, FiStar, FiX } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../../components/UserAvatar';
import { GITHUB_REPOS } from '../../config';
import logo from '../../assets/logo.png';

const navItems = [
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'How it Works', href: '#how-it-works', id: 'how-it-works' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const goToSection = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const linkClass = (id: string) =>
    `text-sm font-medium transition ${
      activeId === id ? 'text-white' : 'text-[#a8a3c7] hover:text-white'
    }`;

  const renderGitHubStarButtons = (compact = false) => (
    <div className={`flex items-center ${compact ? 'w-full flex-col gap-2' : 'gap-2'}`}>
      {GITHUB_REPOS.map((repo) => (
        <a
          key={repo.label}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2a264a] bg-[#141129] font-semibold text-[#d5d1ee] leading-none transition hover:border-[#383161] hover:bg-[#1b1738] hover:text-white ${
            compact ? 'h-11 w-full text-sm' : 'h-9 px-3 text-xs'
          }`}
        >
          <FaGithub className="text-sm" />
          <span>Star {repo.label}</span>
          <FiStar className="text-sm text-[#fbbf24]" />
        </a>
      ))}
    </div>
  );

  const renderAuthActions = (compact = false) => {
    if (isLoading) {
      return <div className="h-9 w-28 rounded-xl bg-white/5 animate-pulse" />;
    }

    if (isAuthenticated) {
      return (
        <Link
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c3aed] text-white font-semibold leading-none hover:bg-[#6d28d9] transition shadow-lg shadow-[#7c3aed]/20 ${
            compact ? 'h-11 w-full text-sm' : 'h-9 px-3.5 text-xs'
          }`}
        >
          <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} size={compact ? 22 : 20} />
          <span>Dashboard</span>
          <FiArrowRight className="text-sm opacity-80" />
        </Link>
      );
    }

    return (
      <div className={`flex items-center ${compact ? 'flex-col gap-2 w-full' : 'gap-3'}`}>
        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className={`font-semibold text-[#d5d1ee] hover:text-white transition ${
            compact
              ? 'h-11 w-full rounded-xl border border-[#2a264a] flex items-center justify-center text-sm'
              : 'text-sm px-2'
          }`}
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={() => setMenuOpen(false)}
          className={`inline-flex items-center justify-center bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold leading-none rounded-xl transition shadow-lg shadow-[#7c3aed]/20 ${
            compact ? 'h-11 w-full text-sm' : 'h-9 px-4 text-xs'
          }`}
        >
          Get Started
        </Link>
      </div>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-[#0c0a1a]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          to="/"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition"
        >
          <img src={logo} alt="CanvasRTC" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-lg font-extrabold tracking-tight">
            Canvas<span className="text-[#7c3aed]">RTC</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                goToSection(item.id);
              }}
              className={linkClass(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {renderGitHubStarButtons()}
          {renderAuthActions()}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-[#d5d1ee] hover:text-white hover:bg-white/5 transition"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0c0a1a]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  goToSection(item.id);
                }}
                className={`rounded-xl px-3 py-3 ${linkClass(item.id)} ${
                  activeId === item.id ? 'bg-white/5' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
              {renderGitHubStarButtons(true)}
              {renderAuthActions(true)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
