import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { News } from '../../types';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminNews: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'news'), (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News)));
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (item?: News) => {
    if (item) {
      setEditingNews(item);
      setFormData({
        title: item.title,
        content: item.content,
        image: item.image,
        author: item.author,
        date: item.date
      });
    } else {
      setEditingNews(null);
      setFormData({ title: '', content: '', image: '', author: '', date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await updateDoc(doc(db, 'news', editingNews.id), formData);
      } else {
        await addDoc(collection(db, 'news'), formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      await deleteDoc(doc(db, 'news', id));
    }
  };

  return (
    <AdminLayout title="Gerenciar Notícias">
      <div className="flex justify-end mb-8">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-zinc-950 font-bold rounded-xl hover:bg-yellow-400 transition-all"
        >
          <Plus className="w-5 h-5" /> Nova Notícia
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Autor</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold line-clamp-1">{item.title}</span>
                </td>
                <td className="px-6 py-4 text-zinc-400">{item.author}</td>
                <td className="px-6 py-4 text-zinc-400">{item.date}</td>
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
              className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  {editingNews ? 'Editar' : 'Nova'} <span className="text-yellow-500">Notícia</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Título da Notícia</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Conteúdo</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors h-40 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">URL da Imagem</label>
                    <input
                      required
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Autor</label>
                    <input
                      required
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Data</label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <Save className="w-5 h-5" /> Salvar Notícia
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

export default AdminNews;
