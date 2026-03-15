import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold tracking-tighter uppercase italic">
                Arena <span className="text-yellow-500">da Copa</span>
              </span>
            </Link>
            <p className="text-zinc-400 max-w-md">
              O seu portal definitivo para a Copa do Mundo FIFA 2026. Acompanhe jogos, resultados, notícias e garanta os melhores produtos oficiais.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Links Úteis</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-zinc-400 hover:text-yellow-500 transition-colors">Home</Link></li>
              <li><Link to="/jogos" className="text-zinc-400 hover:text-yellow-500 transition-colors">Jogos</Link></li>
              <li><Link to="/tabela" className="text-zinc-400 hover:text-yellow-500 transition-colors">Tabela</Link></li>
              <li><Link to="/noticias" className="text-zinc-400 hover:text-yellow-500 transition-colors">Notícias</Link></li>
              <li><Link to="/loja" className="text-zinc-400 hover:text-yellow-500 transition-colors">Loja</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Institucional</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">Sobre Nós</Link></li>
              <li><Link to="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">Contato</Link></li>
              <li><Link to="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">Política de Privacidade</Link></li>
              <li><Link to="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Arena da Copa. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
