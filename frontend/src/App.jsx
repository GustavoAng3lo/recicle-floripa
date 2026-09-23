import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import ComprovarDescarte from './pages/ComprovarDescarte';
import PontosEntrega from './pages/PontosEntrega';
import Configuracoes from './pages/Configuracoes';
import Servicos from './pages/Servicos';
import Historico from './pages/Historico';
import Perfil from './pages/Perfil';
import Coleta from './pages/Coleta';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial redireciona para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Painel Principal */}
        <Route path="/home" element={<Home />} />

        {/* Fluxo de IA e Descarte */}
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/comprovar-descarte" element={<ComprovarDescarte />} />

        {/* Ecopontos e Mapa */}
        <Route path="/pontos" element={<PontosEntrega />} />

        {/* Configurações da Conta */}
        <Route path="/configuracoes" element={<Configuracoes />} />

        {/* Guia de descarte e coleta especial */}
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/coleta" element={<Coleta />} />

        {/* Rota coringa para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}