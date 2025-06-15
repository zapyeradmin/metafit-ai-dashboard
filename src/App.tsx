import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AuthForm from "./components/AuthForm";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import PlanoDoDia from "./pages/PlanoDoDia";
import MeuProgresso from "./pages/MeuProgresso";
import DashboardPro from "./pages/DashboardPro";
import MeusDados from "./pages/MeusDados";
import AssistenteIA from "./pages/AssistenteIA";
import Configuracoes from "./pages/Configuracoes";
import MeuPerfil from "./pages/MeuPerfil";
import NotFound from "./pages/NotFound";
import AdminSaaSPage from "./pages/AdminSaaS";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/plano-do-dia" element={<Layout><PlanoDoDia /></Layout>} />
        <Route path="/meu-progresso" element={<Layout><MeuProgresso /></Layout>} />
        <Route path="/dashboard-pro" element={<Layout><DashboardPro /></Layout>} />
        <Route path="/meus-dados" element={<Layout><MeusDados /></Layout>} />
        <Route path="/assistente-ia" element={<Layout><AssistenteIA /></Layout>} />
        <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
        <Route path="/meu-perfil" element={<Layout><MeuPerfil /></Layout>} />
        <Route path="/admin/saas" element={<Layout><AdminSaaSPage /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
