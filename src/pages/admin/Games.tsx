import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Game } from '../../types';
import { Plus, Pencil, Trash2, X, Save, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFlagUrl } from '../../utils/flags';

import { recalculateStandings } from '../../utils/standingsLogic';

const AdminGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    time_a: '',
    time_b: '',
    data: '',
    hora: '',
    estadio: '',
    fase: '',
    gols_a: '0',
    gols_b: '0',
    status: 'scheduled' as 'scheduled' | 'finished',
    homeLineup: '',
    awayLineup: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('data', 'asc'), orderBy('hora', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game)));
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (game?: Game) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        time_a: game.time_a,
        time_b: game.time_b,
        data: game.data,
        hora: game.hora,
        estadio: game.estadio,
        fase: game.fase,
        gols_a: (game.gols_a || 0).toString(),
        gols_b: (game.gols_b || 0).toString(),
        status: game.status,
        homeLineup: game.homeLineup || '',
        awayLineup: game.awayLineup || ''
      });
    } else {
      setEditingGame(null);
      setFormData({
        time_a: '', time_b: '', data: '', hora: '', estadio: '', fase: '', gols_a: '0', gols_b: '0', status: 'scheduled', homeLineup: '', awayLineup: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      gols_a: parseInt(formData.gols_a),
      gols_b: parseInt(formData.gols_b)
    };
    try {
      if (editingGame) {
        await updateDoc(doc(db, 'games', editingGame.id), data);
      } else {
        await addDoc(collection(db, 'games'), data);
      }
      await recalculateStandings();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
      await deleteDoc(doc(db, 'games', id));
      await recalculateStandings();
    }
  };

  return (
    <AdminLayout title="Gerenciar Jogos">
      <div className="flex justify-end mb-8">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-zinc-950 font-bold rounded-xl hover:bg-yellow-400 transition-all"
        >
          <Plus className="w-5 h-5" /> Novo Jogo
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4">Partida</th>
              <th className="px-6 py-4">Data/Hora</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {games.map((game) => (
              <tr key={game.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[120px] justify-end">
                      <span className="font-bold text-sm">{game.time_a}</span>
                      <img src={getFlagUrl(game.time_a) || ''} alt="" className="w-6 h-4 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-yellow-500 font-black px-2 bg-white/5 rounded">
                      {game.status === 'finished' ? `${game.gols_a} x ${game.gols_b}` : 'vs'}
                    </span>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <img src={getFlagUrl(game.time_b) || ''} alt="" className="w-6 h-4 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <span className="font-bold text-sm">{game.time_b}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-xs font-medium">{game.data} • {game.hora}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    game.status === 'finished' ? 'bg-zinc-800 text-zinc-400' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {game.status === 'finished' ? 'Encerrado' : 'Agendado'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(game)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(game.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  {editingGame ? 'Editar' : 'Novo'} <span className="text-yellow-500">Jogo</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Time A</label>
                    <div className="flex items-center gap-3">
                      <img src={getFlagUrl(formData.time_a) || ''} alt="" className="w-8 h-5 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <input
                        required
                        type="text"
                        value={formData.time_a}
                        onChange={(e) => setFormData({ ...formData, time_a: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Time B</label>
                    <div className="flex items-center gap-3">
                      <img src={getFlagUrl(formData.time_b) || ''} alt="" className="w-8 h-5 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                      <input
                        required
                        type="text"
                        value={formData.time_b}
                        onChange={(e) => setFormData({ ...formData, time_b: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Data</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: 15/06/2026"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Hora</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: 16:00"
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estádio</label>
                    <input
                      required
                      type="text"
                      value={formData.estadio}
                      onChange={(e) => setFormData({ ...formData, estadio: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Fase</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Fase de Grupos"
                      value={formData.fase}
                      onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'finished' })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    >
                      <option value="scheduled">Agendado</option>
                      <option value="finished">Encerrado</option>
                    </select>
                  </div>

                  {formData.status === 'finished' && (
                    <div className="grid grid-cols-2 gap-4 md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gols {formData.time_a || 'Time A'}</label>
                        <input
                          type="number"
                          value={formData.gols_a}
                          onChange={(e) => setFormData({ ...formData, gols_a: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-2xl font-black text-center text-yellow-500 focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gols {formData.time_b || 'Time B'}</label>
                        <input
                          type="number"
                          value={formData.gols_b}
                          onChange={(e) => setFormData({ ...formData, gols_b: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-2xl font-black text-center text-yellow-500 focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Escalação {formData.time_a || 'Time A'}</label>
                    <textarea
                      rows={4}
                      placeholder="Cole a escalação aqui..."
                      value={formData.homeLineup}
                      onChange={(e) => setFormData({ ...formData, homeLineup: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors resize-none text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Escalação {formData.time_b || 'Time B'}</label>
                    <textarea
                      rows={4}
                      placeholder="Cole a escalação aqui..."
                      value={formData.awayLineup}
                      onChange={(e) => setFormData({ ...formData, awayLineup: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors resize-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-yellow-500 text-zinc-950 font-bold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" /> Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminGames;
