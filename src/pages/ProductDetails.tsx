import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-yellow-500 font-black italic uppercase tracking-tighter text-4xl">Carregando...</div>;
  if (!product) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Produto não encontrado.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-500 selection:text-zinc-950">
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/loja" className="inline-flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
            <ChevronLeft className="w-4 h-4" /> Voltar para a loja
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800'} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-8 left-8 px-4 py-2 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-xl">
                  Últimas unidades
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Produto Oficial Licenciado</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-5xl font-black text-yellow-500 tracking-tighter">R$ {product.price.toFixed(2)}</span>
              </div>

              <div className="space-y-6 mb-12">
                <p className="text-zinc-400 text-lg leading-relaxed">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Truck className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Frete grátis para todo Brasil</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <ShieldCheck className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Qualidade Premium Garantida</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <RotateCcw className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">7 dias para devolução</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                {product.stock > 0 ? (
                  <a 
                    href={product.link_checkout} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-6 bg-yellow-500 text-zinc-950 font-black uppercase italic tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all hover:scale-[1.02] shadow-2xl shadow-yellow-500/20"
                  >
                    <ShoppingBag className="w-6 h-6" /> Comprar Agora
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full py-6 bg-zinc-800 text-zinc-500 font-black uppercase italic tracking-widest rounded-2xl flex items-center justify-center gap-3 cursor-not-allowed"
                  >
                    Produto Esgotado
                  </button>
                )}
                <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  Pagamento 100% seguro via Mercado Pago ou Stripe
                </p>
              </div>
            </motion.div>
          </div>

          {/* Additional Details Section */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-20">
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Especificações</h3>
              <ul className="space-y-3 text-zinc-400 text-sm">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="font-bold">Material</span>
                  <span>100% Poliéster Premium</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="font-bold">Coleção</span>
                  <span>FIFA World Cup 2026</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="font-bold">Origem</span>
                  <span>Importado</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Sobre o Produto</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Celebre a maior Copa do Mundo da história com produtos oficiais licenciados. Cada item foi desenvolvido com os mais altos padrões de qualidade para garantir durabilidade e conforto. Seja no estádio ou em casa, mostre sua paixão pelo futebol com o Arena da Copa.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
