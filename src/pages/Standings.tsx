import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { GroupStanding } from '../types';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';
import { getFlagUrl } from '../utils/flags';

const Standings: React.FC = () => {
  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'group_standings'), orderBy('grupo', 'asc'), orderBy('pontos', 'desc'), orderBy('saldo', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStandings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupStanding)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-yellow-500 font-black italic uppercase tracking-tighter text-4xl">Carregando...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-500 selection:text-zinc-950">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4">
              Tabela de <span className="text-yellow-500">Classificação</span>
            </h1>
            <p className="text-zinc-500 font-medium uppercase tracking-widest text-sm">Acompanhe a jornada rumo à glória</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {groups.map((group) => {
              const groupTeams = standings.filter(t => t.grupo === group);
              if (groupTeams.length === 0) return null;

              return (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden"
                >
                  <div className="bg-yellow-500 px-8 py-6">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-950">Grupo {group}</h2>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <span className="flex-1">Time</span>
                      <div className="flex gap-4">
                        <span className="w-8 text-center">P</span>
                        <span className="w-8 text-center">V</span>
                        <span className="w-8 text-center">E</span>
                        <span className="w-8 text-center">D</span>
                        <span className="w-8 text-center">SG</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {groupTeams.map((team, idx) => (
                        <div key={team.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-4 flex-1">
                            <span className={`w-6 text-sm font-black ${idx < 2 ? 'text-yellow-500' : 'text-zinc-600'}`}>{idx + 1}</span>
                            <div className="flex items-center gap-3">
                              <img src={getFlagUrl(team.time) || ''} alt="" className="w-6 h-4 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                              <span className="font-bold">{team.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm font-bold">
                            <span className="w-8 text-center font-black text-yellow-500">{team.pontos}</span>
                            <span className="w-8 text-center text-zinc-400">{team.vitorias}</span>
                            <span className="w-8 text-center text-zinc-400">{team.empates}</span>
                            <span className="w-8 text-center text-zinc-400">{team.derrotas}</span>
                            <span className="w-8 text-center text-zinc-400">{team.saldo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Standings;
