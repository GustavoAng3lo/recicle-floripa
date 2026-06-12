import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Coleta from './pages/Coleta';
import Configuracoes from './pages/Configuracoes';
import Servicos from './pages/servicos';
import './App.css';

function App() {
  // Simulação simples de autenticação: verifica se existe um usuário no localStorage
  const isAuthenticated = () => {
    return localStorage.getItem('usuario_id') !== null;
  };

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Privadas (Protegidas) */}
        <Route 
          path="/home" 
          element={isAuthenticated() ? <Home /> : <Navigate to="/" />} 
        />
        <Route 
          path="/coleta" 
          element={isAuthenticated() ? <Coleta /> : <Navigate to="/" />} 
        />
        <Route
          path="/configuracoes"
          element={isAuthenticated() ? <Configuracoes /> : <Navigate to="/" />}
        />
        <Route
          path="/servicos"
          element={isAuthenticated() ? <Servicos /> : <Navigate to="/" />}
        />

        {/* Redirecionamento de rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;