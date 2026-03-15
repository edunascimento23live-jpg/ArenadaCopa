import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X, Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { logout } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jogos', path: '/jogos' },
    { name: 'Tabela', path: '/tabela' },
    { name: 'Notícias', path: '/noticias' },
    { name: 'Loja', path: '/loja' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Trophy className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold tracking-tighter uppercase italic">
                Arena <span className="text-yellow-500">da Copa</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-yellow-500 bg-white/5'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            {user && (
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-white/5"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-yellow-500 bg-white/5'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-white/5"
                >
                  Sair
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
