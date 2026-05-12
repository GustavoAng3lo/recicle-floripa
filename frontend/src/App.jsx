import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define o Login como a página inicial (caminho "/") */}
        <Route path="/" element={<Login />} />
        
        {/* Rota para a Home após o login bem-sucedido */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
