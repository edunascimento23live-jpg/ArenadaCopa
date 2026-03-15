import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { News } from '../types';
import { motion } from 'motion/react';
import { Calendar, User, ChevronLeft, Share2 } from 'lucide-react';

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNews({ id: docSnap.id, ...docSnap.data() } as News);
        }
      } catch (error) {
        console.error("Error fetching news details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-yellow-500 font-black italic uppercase tracking-tighter text-4xl">Carregando...</div>;
  if (!news) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Notícia não encontrada.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-500 selection:text-zinc-950">
      <main className="pt-32 pb-20 px-4">
        <article className="max-w-4xl mx-auto">
          <Link to="/noticias" className="inline-flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
            <ChevronLeft className="w-4 h-4" /> Voltar para notícias
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 text-xs font-bold text-yellow-500 uppercase tracking-widest mb-6">
              <span className="px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">Copa 2026</span>
              <div className="flex items-center gap-1 text-zinc-500"><Calendar className="w-3 h-3" /> {news.date}</div>
              <div className="flex items-center gap-1 text-zinc-500"><User className="w-3 h-3" /> {news.author}</div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-8">
              {news.title}
            </h1>

            <div className="aspect-video rounded-[40px] overflow-hidden mb-12 bg-zinc-900 shadow-2xl border border-white/5">
              <img 
                src={news.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200'} 
                alt={news.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
              <div className="prose prose-invert prose-yellow max-w-none">
                <div className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {news.content}
                </div>
              </div>

              <aside className="space-y-8">
                <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">Compartilhar</h3>
                  <div className="flex gap-3">
                    <button className="p-3 bg-white/5 rounded-xl hover:bg-yellow-500 hover:text-zinc-950 transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">Autor</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-zinc-950 font-black">
                      {news.author?.charAt(0)}
                    </div>
                    <span className="font-bold text-sm">{news.author}</span>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        </article>
      </main>
    </div>
  );
};

export default NewsDetails;
