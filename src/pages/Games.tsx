import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Game } from '../types';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { getFlagUrl } from '../utils/flags';
import { Link } from 'react-router-dom';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('data', 'asc'), orderBy('hora', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Group games by date
  const groupedGames = games.reduce((acc, game) => {
    if (!acc[game.data]) {
      acc[game.data] = [];
    }
    acc[game.data].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  const dates = Object.keys(groupedGames).sort((a, b) => {
    const [da, ma, ya] = a.split('/').map(Number);
    const [db, mb, yb] = b.split('/').map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-yellow-500 font-black italic uppercase tracking-tighter text-4xl">Carregando...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-500 selection:text-zinc-950">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4">
              Calendário de <span className="text-yellow-500">Jogos</span>
            </h1>
            <p className="text-zinc-500 font-medium uppercase tracking-widest text-sm">Cada segundo conta na história do futebol</p>
          </motion.div>

          <div className="space-y-16">
            {dates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-white/5" />
                  <div className="flex items-center gap-2 px-6 py-2 bg-zinc-900 border border-white/5 rounded-full">
                    <Calendar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-black uppercase italic tracking-widest">{date}</span>
                  </div>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedGames[date].map((game) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-zinc-900 border border-white/5 rounded-3xl p-8 hover:border-yellow-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white/5 px-3 py-1 rounded-full">
                          {game.fase}
                        </span>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold">{game.hora}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex-1 text-center flex flex-col items-center gap-3">
                          <img src={getFlagUrl(game.time_a) || ''} alt="" className="w-12 h-8 object-cover rounded-md border border-white/10 shadow-lg" referrerPolicy="no-referrer" />
                          <div className="text-lg font-black uppercase italic tracking-tighter">{game.time_a}</div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-3xl font-black italic text-yellow-500">
                            {game.status === 'finished' ? `${game.gols_a} - ${game.gols_b}` : 'VS'}
                          </div>
                          {game.status === 'finished' && (
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Encerrado</span>
                          )}
                        </div>

                        <div className="flex-1 text-center flex flex-col items-center gap-3">
                          <img src={getFlagUrl(game.time_b) || ''} alt="" className="w-12 h-8 object-cover rounded-md border border-white/10 shadow-lg" referrerPolicy="no-referrer" />
                          <div className="text-lg font-black uppercase italic tracking-tighter">{game.time_b}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-zinc-500 mb-6">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{game.estadio}</span>
                      </div>

                      <Link to={`/jogos/${game.id}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-zinc-950 transition-all group-hover:border-yellow-500/50">
                        Ver Detalhes do Jogo <ChevronRight className="w-3 h-3" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Games;
