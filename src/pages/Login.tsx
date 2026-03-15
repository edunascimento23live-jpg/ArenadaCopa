import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../firebase';

const Login: React.FC = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/admin" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      let message = 'Erro ao processar solicitação.';
      if (err.code === 'auth/user-not-found') message = 'Usuário não encontrado.';
      if (err.code === 'auth/wrong-password') message = 'Senha incorreta.';
      if (err.code === 'auth/email-already-in-use') message = 'Este e-mail já está em uso.';
      if (err.code === 'auth/weak-password') message = 'A senha deve ter pelo menos 6 caracteres.';
      if (err.code === 'auth/operation-not-allowed') message = 'Login por e-mail/senha não está ativado no Firebase.';
      if (err.code === 'auth/invalid-credential') message = 'Credenciais inválidas.';
      
      setError(message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-white/5 rounded-3xl p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            {isRegistering ? 'Criar' : 'Acesso'} <span className="text-yellow-500">{isRegistering ? 'Conta' : 'Restrito'}</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            {isRegistering ? 'Crie sua conta de administrador.' : 'Área exclusiva para administradores da Arena da Copa.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-yellow-500 text-zinc-950 font-black uppercase italic tracking-tighter rounded-2xl hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Processando...' : (isRegistering ? 'Criar Conta' : 'Entrar no Painel')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-zinc-500 hover:text-yellow-500 transition-colors font-bold uppercase tracking-widest"
          >
            {isRegistering ? 'Já tenho conta? Entrar' : 'Não tem conta? Criar agora'}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <button
            onClick={() => loginWithGoogle()}
            className="text-xs text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest"
          >
            Ou entrar com Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
