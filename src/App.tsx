import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Games = lazy(() => import('./pages/Games'));
const Standings = lazy(() => import('./pages/Standings'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const Store = lazy(() => import('./pages/Store'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminNews = lazy(() => import('./pages/admin/News'));
const AdminGames = lazy(() => import('./pages/admin/Games'));
const AdminStandings = lazy(() => import('./pages/admin/Standings'));
const GameDetails = lazy(() => import('./pages/GameDetails'));
const NewsDetails = lazy(() => import('./pages/NewsDetails'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Login = lazy(() => import('./pages/Login'));

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Carregando...</div>;
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-yellow-400 selection:text-zinc-950">
          <Navbar />
          <main className="pt-16">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jogos" element={<Games />} />
                <Route path="/jogos/:id" element={<GameDetails />} />
                <Route path="/tabela" element={<Standings />} />
                <Route path="/noticias" element={<NewsPage />} />
                <Route path="/noticias/:id" element={<NewsDetails />} />
                <Route path="/loja" element={<Store />} />
                <Route path="/loja/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/produtos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/noticias" element={<AdminRoute><AdminNews /></AdminRoute>} />
                <Route path="/admin/jogos" element={<AdminRoute><AdminGames /></AdminRoute>} />
                <Route path="/admin/tabela" element={<AdminRoute><AdminStandings /></AdminRoute>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
