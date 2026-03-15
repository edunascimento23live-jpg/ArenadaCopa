import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ShoppingBag, ExternalLink, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando loja...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Loja <span className="text-yellow-500">Oficial</span></h1>
          <p className="text-zinc-400">Produtos exclusivos e licenciados da Copa do Mundo 2026</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-white/5 text-sm font-bold text-zinc-400">
          <Tag className="w-4 h-4" /> {products.length} Itens disponíveis
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.length > 0 ? products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            className="bg-zinc-900 border border-white/5 rounded-3xl p-5 flex flex-col group shadow-2xl"
          >
            <Link to={`/loja/${product.id}`} className="aspect-square rounded-2xl overflow-hidden mb-6 bg-zinc-800 relative block">
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=400'} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Últimas unidades
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="px-4 py-2 bg-zinc-900 text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/10">
                    Esgotado
                  </span>
                </div>
              )}
            </Link>
            
            <Link to={`/loja/${product.id}`}>
              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">{product.name}</h3>
            </Link>
            <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{product.description}</p>
            
            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Preço</span>
                <span className="text-2xl font-black text-white">R$ {product.price.toFixed(2)}</span>
              </div>
              <Link 
                to={`/loja/${product.id}`}
                className={`p-4 rounded-2xl transition-all shadow-lg ${
                  product.stock > 0 
                    ? 'bg-yellow-500 text-zinc-950 hover:bg-yellow-400 hover:scale-110' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-white/10">
            <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">Nenhum produto cadastrado na loja.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
