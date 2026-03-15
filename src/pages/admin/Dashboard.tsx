import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShoppingBag, Newspaper, Trophy, Users, Database } from 'lucide-react';
import { motion } from 'motion/react';
import { seedGroups, seedGames } from '../../utils/seedData';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    news: 0,
    games: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedGroups();
      await seedGames();
      alert('Dados da Copa importados com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Erro ao importar dados.');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, news, games, users] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'news')),
          getDocs(collection(db, 'games')),
          getDocs(collection(db, 'users'))
        ]);

        setStats({
          products: products.size,
          news: news.size,
          games: games.size,
          users: users.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Produtos', value: stats.products, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Notícias', value: stats.news, icon: Newspaper, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Jogos', value: stats.games, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Usuários', value: stats.users, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-900 border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center"
          >
            <div className={`w-16 h-16 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6`}>
              <card.icon className="w-8 h-8" />
            </div>
            <span className="text-4xl font-black mb-2">{card.value}</span>
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{card.name}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-zinc-900 border border-white/5 rounded-3xl p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Bem-vindo ao <span className="text-yellow-500">Painel Arena</span></h2>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-yellow-500 hover:text-zinc-950 transition-all disabled:opacity-50"
          >
            <Database className="w-5 h-5" />
            {seeding ? 'Importando...' : 'Importar Dados da Copa'}
          </button>
        </div>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          Aqui você pode gerenciar todo o conteúdo do portal Arena da Copa. Adicione novos produtos à loja, publique notícias quentes, cadastre os jogos do torneio e mantenha a tabela de classificação atualizada.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
