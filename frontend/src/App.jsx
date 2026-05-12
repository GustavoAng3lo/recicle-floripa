import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Servicos from './pages/Servicos';
import Coleta from './pages/Coleta'; // 1. IMPORTAÇÃO QUE FALTAVA
import Configuracoes from './pages/Configuracoes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} />
        {/* 2. ROTA QUE FALTAVA PARA A PÁGINA DE COLETA */}
        <Route path="/coleta" element={<Coleta />} /> 
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </Router>
  );
}

export default App;