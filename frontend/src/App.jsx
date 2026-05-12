import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Servicos from './pages/Servicos'; // Adicionei esta linha!
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        {/* Rota para a tela de busca e agendamento que criamos */}
        <Route path="/servicos" element={<Servicos />} />
      </Routes>
    </Router>
  );
}

export default App;