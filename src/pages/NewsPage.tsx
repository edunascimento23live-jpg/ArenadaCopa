import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { News } from '../types';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando notícias...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Últimas <span className="text-yellow-500">Notícias</span></h1>
        <p className="text-zinc-400">Tudo o que você precisa saber sobre a Copa 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {news.length > 0 ? news.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-zinc-900 shadow-2xl">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</div>
              <div className="flex items-center gap-1"><User className="w-3 h-3" /> {item.author}</div>
            </div>
            <h2 className="text-2xl font-bold mb-4 group-hover:text-yellow-500 transition-colors leading-tight">
              {item.title}
            </h2>
            <p className="text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
              {item.content}
            </p>
            <Link to={`/noticias/${item.id}`} className="flex items-center gap-2 text-yellow-500 font-bold hover:gap-3 transition-all">
              Ler notícia completa <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.article>
        )) : (
          <div className="col-span-full text-center py-20 text-zinc-500">Nenhuma notícia publicada ainda.</div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
