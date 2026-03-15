import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Newspaper, Trophy, Table, ArrowLeft } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', path: '/admin/produtos', icon: ShoppingBag },
    { name: 'Notícias', path: '/admin/noticias', icon: Newspaper },
    { name: 'Jogos', path: '/admin/jogos', icon: Trophy },
    { name: 'Tabela', path: '/admin/tabela', icon: Table },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sticky top-24">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 px-4">Menu Administrativo</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive(item.path)
                      ? 'bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-8 border-t border-white/5">
              <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar ao Site
              </Link>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <div className="mb-10">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
