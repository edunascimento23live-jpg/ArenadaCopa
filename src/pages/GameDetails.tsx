import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Game } from '../types';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ChevronLeft, Trophy } from 'lucide-react';
import { getFlagUrl } from '../utils/flags';
import SoccerField from '../components/SoccerField';

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'games', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGame({ id: docSnap.id, ...docSnap.data() } as Game);
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-yellow-500 font-black italic uppercase tracking-tighter text-4xl">Carregando...</div>;
  if (!game) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Jogo não encontrado.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-500 selection:text-zinc-950">
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/jogos" className="inline-flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
            <ChevronLeft className="w-4 h-4" /> Voltar para o calendário
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header / Scoreboard */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent" />
              </div>
              
              <div className="relative z-10">
                <span className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-8 border border-yellow-500/20">
                  {game.fase}
                </span>

                <div className="flex items-center justify-between gap-8 max-w-2xl mx-auto">
                  <div className="flex-1 flex flex-col items-center gap-4">
                    <motion.img 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      src={getFlagUrl(game.time_a) || undefined} 
                      alt="" 
                      className="w-24 h-16 md:w-32 md:h-20 object-cover rounded-xl border border-white/10 shadow-2xl" 
                      referrerPolicy="no-referrer" 
                    />
                    <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">{game.time_a}</h2>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="text-5xl md:text-7xl font-black italic text-yellow-500 tracking-tighter">
                      {game.status === 'finished' ? `${game.gols_a} - ${game.gols_b}` : 'VS'}
                    </div>
                    {game.status === 'finished' && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Resultado Final</span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-4">
                    <motion.img 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      src={getFlagUrl(game.time_b) || undefined} 
                      alt="" 
                      className="w-24 h-16 md:w-32 md:h-20 object-cover rounded-xl border border-white/10 shadow-2xl" 
                      referrerPolicy="no-referrer" 
                    />
                    <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">{game.time_b}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5">
              <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                <Calendar className="w-6 h-6 text-yellow-500 mb-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Data</span>
                <span className="font-bold text-lg">{game.data}</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                <Clock className="w-6 h-6 text-yellow-500 mb-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Horário</span>
                <span className="font-bold text-lg">{game.hora}</span>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                <MapPin className="w-6 h-6 text-yellow-500 mb-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Estádio</span>
                <span className="font-bold text-lg">{game.estadio}</span>
              </div>
            </div>

            {/* Lineups Section */}
            {(game.homeLineup || game.awayLineup) && (
              <div className="px-12 pb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Escalações</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Home Team Lineup */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <img src={getFlagUrl(game.time_a) || undefined} alt="" className="w-8 h-5 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <h4 className="text-lg font-black uppercase italic tracking-tighter text-yellow-500">{game.time_a}</h4>
                    </div>
                    {game.homeLineup ? (
                      <SoccerField lineup={game.homeLineup} teamName={game.time_a} />
                    ) : (
                      <div className="bg-zinc-950/50 rounded-3xl p-8 border border-white/5 text-center">
                        <p className="text-zinc-600 text-xs italic">Escalação ainda não disponível.</p>
                      </div>
                    )}
                  </div>

                  {/* Away Team Lineup */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <img src={getFlagUrl(game.time_b) || undefined} alt="" className="w-8 h-5 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <h4 className="text-lg font-black uppercase italic tracking-tighter text-white">{game.time_b}</h4>
                    </div>
                    {game.awayLineup ? (
                      <SoccerField lineup={game.awayLineup} teamName={game.time_b} isAway />
                    ) : (
                      <div className="bg-zinc-950/50 rounded-3xl p-8 border border-white/5 text-center">
                        <p className="text-zinc-600 text-xs italic">Escalação ainda não disponível.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Extra Info */}
            <div className="px-12 pb-12">
              <div className="bg-zinc-950/50 rounded-3xl p-8 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Informações Adicionais</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Esta partida faz parte da <span className="text-white font-bold">{game.fase}</span> da Copa do Mundo FIFA 2026. 
                  O confronto entre <span className="text-white font-bold">{game.time_a}</span> e <span className="text-white font-bold">{game.time_b}</span> 
                  promete ser um dos grandes momentos do torneio no estádio <span className="text-white font-bold">{game.estadio}</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default GameDetails;
