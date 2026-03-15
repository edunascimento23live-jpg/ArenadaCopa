import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, ShoppingBag, ChevronLeft } from 'lucide-react';
import { collection, query, limit, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Game, News, Product } from '../types';
import { getFlagUrl } from '../utils/flags';

const Hero = () => (
  <section className="relative h-[80vh] flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" 
        alt="Estádio de Futebol" 
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <span className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-bold uppercase tracking-widest mb-6 border border-yellow-500/20">
          FIFA World Cup 2026
        </span>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">
          Arena <span className="text-yellow-500">da Copa</span>
        </h1>
        <p className="text-xl text-zinc-300 mb-10 max-w-xl leading-relaxed">
          O portal definitivo para acompanhar cada lance, resultado e notícia da maior Copa do Mundo da história.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/jogos" className="px-8 py-4 bg-yellow-500 text-zinc-950 font-bold rounded-full hover:bg-yellow-400 transition-all hover:scale-105 flex items-center gap-2">
            Ver Jogos <ChevronRight className="w-5 h-5" />
          </Link>
          <Link to="/loja" className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-full border border-white/10 hover:bg-zinc-800 transition-all flex items-center gap-2">
            Visitar Loja <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const Home: React.FC = () => {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [latestResults, setLatestResults] = useState<Game[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [resultsIndex, setResultsIndex] = useState(0);

  useEffect(() => {
    // Real-time sync for Featured Games
    const qFeatured = query(
      collection(db, 'games'),
      where('status', '==', 'scheduled'),
      orderBy('data', 'asc'),
      limit(12)
    );
    const unsubFeatured = onSnapshot(qFeatured, (snap) => {
      setFeaturedGames(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game)));
    });

    // Real-time sync for Latest Results
    const qResults = query(
      collection(db, 'games'),
      where('status', '==', 'finished'),
      orderBy('data', 'desc'),
      limit(12)
    );
    const unsubResults = onSnapshot(qResults, (snap) => {
      setLatestResults(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game)));
    });

    // Real-time sync for News
    const qNews = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
    const unsubNews = onSnapshot(qNews, (snap) => {
      setNews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as News)));
    });

    // Real-time sync for Products
    const qProducts = query(collection(db, 'products'), limit(4));
    const unsubProducts = onSnapshot(qProducts, (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    });

    return () => {
      unsubFeatured();
      unsubResults();
      unsubNews();
      unsubProducts();
    };
  }, []);

  // Auto-scroll logic for Featured Games
  useEffect(() => {
    if (featuredGames.length <= 4) return; // Only scroll if more than 4 on desktop
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % (featuredGames.length - 3));
    }, 3000); // Faster: 3 seconds
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  // Auto-scroll logic for Latest Results
  useEffect(() => {
    if (latestResults.length <= 2) return; // Only scroll if more than 2 on desktop
    const interval = setInterval(() => {
      setResultsIndex((prev) => (prev + 1) % (latestResults.length - 1));
    }, 2500); // Faster: 2.5 seconds
    return () => clearInterval(interval);
  }, [latestResults.length]);

  return (
    <div className="pb-20">
      <Hero />

      {/* Jogos de Hoje Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Jogos em <span className="text-yellow-500">Destaque</span></h2>
            <p className="text-zinc-400">Acompanhe as próximas partidas do torneio</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/jogos" className="text-yellow-500 font-bold flex items-center gap-1 hover:underline mr-4">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={() => setFeaturedIndex(prev => Math.max(0, prev - 1))}
                className="p-2 bg-zinc-900 border border-white/5 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setFeaturedIndex(prev => (prev + 1) % Math.max(1, featuredGames.length - 3))}
                className="p-2 bg-zinc-900 border border-white/5 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            className="flex gap-6"
            animate={{ x: `calc(-${featuredIndex * (100 / 4)}% - ${featuredIndex * 18}px)` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {featuredGames.length > 0 ? featuredGames.map((game) => (
              <div
                key={game.id}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center group h-full"
                >
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">{game.fase}</span>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex flex-col items-center gap-2">
                      <img src={getFlagUrl(game.time_a) || undefined} alt="" className="w-10 h-7 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <span className="font-bold text-sm line-clamp-1">{game.time_a}</span>
                    </div>
                    <span className="text-zinc-600 font-black italic">VS</span>
                    <div className="flex flex-col items-center gap-2">
                      <img src={getFlagUrl(game.time_b) || undefined} alt="" className="w-10 h-7 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <span className="font-bold text-sm line-clamp-1">{game.time_b}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-6">
                    <Calendar className="w-4 h-4" />
                    {game.data} • {game.hora}
                  </div>
                  <Link to={`/jogos/${game.id}`} className="w-full py-3 mt-auto rounded-xl bg-white/5 border border-white/10 font-bold text-sm group-hover:bg-yellow-500 group-hover:text-zinc-950 transition-all">
                    Ver Detalhes
                  </Link>
                </motion.div>
              </div>
            )) : (
              <div className="w-full text-center py-10 text-zinc-500">Nenhum jogo agendado no momento.</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Últimos Resultados Section */}
      <section className="bg-zinc-900/50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Últimos <span className="text-yellow-500">Resultados</span></h2>
              <p className="text-zinc-400">Placares das partidas encerradas</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setResultsIndex(prev => Math.max(0, prev - 1))}
                className="p-2 bg-zinc-950 border border-white/5 rounded-full hover:bg-zinc-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setResultsIndex(prev => (prev + 1) % Math.max(1, latestResults.length - 1))}
                className="p-2 bg-zinc-950 border border-white/5 rounded-full hover:bg-zinc-900 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <motion.div 
              className="flex gap-6"
              animate={{ x: `calc(-${resultsIndex * (100 / 2)}% - ${resultsIndex * 12}px)` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {latestResults.length > 0 ? latestResults.map((game) => (
                <div 
                  key={game.id} 
                  className="w-full md:w-[calc(50%-12px)] flex-shrink-0"
                >
                  <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 flex items-center justify-between h-full">
                    <div className="flex items-center gap-4 flex-1">
                      <img src={getFlagUrl(game.time_a) || undefined} alt="" className="w-8 h-5 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <span className="font-bold text-lg line-clamp-1">{game.time_a}</span>
                      <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-xl font-black text-yellow-500 ml-auto">{game.gols_a}</div>
                    </div>
                    <div className="px-4 text-zinc-600 font-bold italic">X</div>
                    <div className="flex items-center gap-4 flex-1 justify-end">
                      <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-xl font-black text-yellow-500 mr-auto">{game.gols_b}</div>
                      <span className="font-bold text-lg line-clamp-1">{game.time_b}</span>
                      <img src={getFlagUrl(game.time_b) || undefined} alt="" className="w-8 h-5 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="w-full text-center py-10 text-zinc-500">Nenhum resultado disponível.</div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notícias Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Últimas <span className="text-yellow-500">Notícias</span></h2>
            <p className="text-zinc-400">Fique por dentro de tudo o que acontece</p>
          </div>
          <Link to="/noticias" className="text-yellow-500 font-bold flex items-center gap-1 hover:underline">
            Ver todas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -10 }} className="group">
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-zinc-900">
                <img src={item.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-500 transition-colors">{item.title}</h3>
              <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{item.content}</p>
              <Link to={`/noticias/${item.id}`} className="text-yellow-500 font-bold text-sm flex items-center gap-1">
                Ler notícia <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Loja Section */}
      <section className="bg-zinc-950 py-32 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-yellow-500 mb-4"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Merchandising</span>
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
                Loja <span className="text-yellow-500">Oficial</span>
              </h2>
            </div>
            <Link to="/loja" className="group flex items-center gap-4 bg-zinc-900 border border-white/5 px-8 py-4 rounded-2xl text-white font-black uppercase italic tracking-widest text-sm hover:bg-yellow-500 hover:text-zinc-950 transition-all duration-500 shadow-xl">
              Explorar Coleção <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={`/loja/${product.id}`} 
                  className="bg-zinc-900 border border-white/5 rounded-[32px] p-4 flex flex-col group hover:border-yellow-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden"
                >
                  {/* Background Glow Effect */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/5 blur-[80px] group-hover:bg-yellow-500/10 transition-colors" />
                  
                  <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-zinc-800 relative z-10">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=400'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-lg mb-1 group-hover:text-yellow-500 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6 line-clamp-1">
                      Coleção Oficial 2026
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Preço</span>
                        <span className="text-xl font-black text-white tracking-tighter">R$ {product.price.toFixed(2)}</span>
                      </div>
                      <div className="w-12 h-12 bg-zinc-800 text-white rounded-2xl flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-zinc-950 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
