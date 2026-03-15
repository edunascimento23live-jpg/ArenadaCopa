import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Product } from '../../types';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    link_checkout: '',
    stock: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        link_checkout: product.link_checkout,
        stock: product.stock.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', image: '', link_checkout: '', stock: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: new Date().toISOString() });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <AdminLayout title="Gerenciar Produtos">
      <div className="flex justify-end mb-8">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-zinc-950 font-bold rounded-xl hover:bg-yellow-400 transition-all"
        >
          <Plus className="w-5 h-5" /> Novo Produto
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Estoque</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                    <span className="font-bold">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-yellow-500">R$ {product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-zinc-400">{product.stock}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
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
                  {editingProduct ? 'Editar' : 'Novo'} <span className="text-yellow-500">Produto</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome do Produto</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Preço (R$)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Descrição Curta</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors h-24 resize-none"
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
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estoque</label>
                    <input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Link de Checkout</label>
                    <input
                      required
                      type="url"
                      value={formData.link_checkout}
                      onChange={(e) => setFormData({ ...formData, link_checkout: e.target.value })}
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
                    <Save className="w-5 h-5" /> Salvar Produto
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

export default AdminProducts;
