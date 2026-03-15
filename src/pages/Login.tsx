import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, LogIn } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { loginWithGoogle } from '../firebase';

const Login: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-white/5 rounded-3xl p-10 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Trophy className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
          Bem-vindo à <span className="text-yellow-500">Arena</span>
        </h1>
        <p className="text-zinc-400 mb-10">
          Entre com sua conta Google para acessar o portal e gerenciar suas preferências.
        </p>
        
        <button
          onClick={() => loginWithGoogle()}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-zinc-950 font-bold rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Entrar com Google
        </button>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
            Portal Oficial Arena da Copa
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
