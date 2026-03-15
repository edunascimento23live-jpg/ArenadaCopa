import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { GroupStanding } from '../../types';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminStandings: React.FC = () => {
  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStanding, setEditingStanding] = useState<GroupStanding | null>(null);
  const [formData, setFormData] = useState({
    grupo: 'A',
    time: '',
    pontos: '0',
    vitorias: '0',
    empates: '0',
    derrotas: '0',
    saldo: '0'
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'group_standings'), (snapshot) => {
      setStandings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupStanding)));
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (standing?: GroupStanding) => {
    if (standing) {
      setEditingStanding(standing);
      setFormData({
        grupo: standing.grupo,
        time: standing.time,
        pontos: standing.pontos.toString(),
        vitorias: standing.vitorias.toString(),
        empates: standing.empates.toString(),
        derrotas: standing.derrotas.toString(),
        saldo: standing.saldo.toString()
      });
    } else {
      setEditingStanding(null);
      setFormData({ grupo: 'A', time: '', pontos: '0', vitorias: '0', empates: '0', derrotas: '0', saldo: '0' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      pontos: parseInt(formData.pontos),
      vitorias: parseInt(formData.vitorias),
      empates: parseInt(formData.empates),
      derrotas: parseInt(formData.derrotas),
      saldo: parseInt(formData.saldo)
    };
    try {
      if (editingStanding) {
        await updateDoc(doc(db, 'group_standings', editingStanding.id), data);
      } else {
        await addDoc(collection(db, 'group_standings'), data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving standing:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta classificação?')) {
      await deleteDoc(doc(db, 'group_standings', id));
    }
  };

  return (
    <AdminLayout title="Gerenciar Tabela">
      <div className="flex justify-end mb-8">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-zinc-950 font-bold rounded-xl hover:bg-yellow-400 transition-all"
        >
          <Plus className="w-5 h-5" /> Novo Time na Tabela
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4">Grupo</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">P</th>
              <th className="px-6 py-4">V/E/D</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.sort((a, b) => a.grupo.localeCompare(b.grupo)).map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-yellow-500">Grupo {item.grupo}</td>
                <td className="px-6 py-4 font-bold">{item.time}</td>
                <td className="px-6 py-4 font-black">{item.pontos}</td>
                <td className="px-6 py-4 text-zinc-400 text-sm">{item.vitorias}/{item.empates}/{item.derrotas}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
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
                  {editingStanding ? 'Editar' : 'Novo'} <span className="text-yellow-500">Time</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Grupo</label>
                    <select
                      value={formData.grupo}
                      onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    >
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(g => (
                        <option key={g} value={g}>Grupo {g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome do Time</label>
                    <input
                      required
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pontos</label>
                    <input
                      required
                      type="number"
                      value={formData.pontos}
                      onChange={(e) => setFormData({ ...formData, pontos: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Vitórias</label>
                    <input
                      required
                      type="number"
                      value={formData.vitorias}
                      onChange={(e) => setFormData({ ...formData, vitorias: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Empates</label>
                    <input
                      required
                      type="number"
                      value={formData.empates}
                      onChange={(e) => setFormData({ ...formData, empates: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Derrotas</label>
                    <input
                      required
                      type="number"
                      value={formData.derrotas}
                      onChange={(e) => setFormData({ ...formData, derrotas: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Saldo de Gols</label>
                    <input
                      required
                      type="number"
                      value={formData.saldo}
                      onChange={(e) => setFormData({ ...formData, saldo: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
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
                    <Save className="w-5 h-5" /> Salvar Classificação
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

export default AdminStandings;
