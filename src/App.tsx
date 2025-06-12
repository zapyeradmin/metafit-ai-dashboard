
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
