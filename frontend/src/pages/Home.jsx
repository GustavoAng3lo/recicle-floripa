import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home as HomeIcon, Ticket, PlusCircle, MapPin, User, Menu, ChevronRight } from 'lucide-react';

const Home = () => {
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [coletas, setColetas] = useState([]); // Novo estado para armazenar a lista do banco
  const navigate = useNavigate();

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('usuarioNome');
    if (nomeSalvo) setNomeUsuario(nomeSalvo);

    // Busca as coletas do Jose (ID 2) no banco
    const buscarColetas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/residuos/2');
        setColetas(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    };

    buscarColetas();
  }, []);

  return (
    <div className="home-mobile-container">
      <header className="header-green">
        <div className="header-row">
          <span className="brand-text">Recicle</span>
          <Menu size={28} color="white" />
        </div>

        <div className="address-box">
          <div className="address-info">
            <span className="address-label">Endereço</span>
            <div className="address-details">
              <MapPin size={14} color="#757575" />
              <span>SC-401, 9301 - Santo Antonio de Lisboa</span>
            </div>
          </div>
          <ChevronRight size={24} color="white" />
        </div>

        <div className="hero-section">
          <h2 style={{ fontSize: '1.4rem' }}>Olá, {nomeUsuario}!</h2>
          <h2 style={{ fontWeight: 'bold' }}>Faça sua coleta</h2>
          <p>Sua atitude muda o mundo.</p>
          <button className="btn-mapa-white">Mapa</button>
        </div>
      </header>

      <section className="history-section">
        <h3 className="history-title">Histórico de coletas</h3>
        
        {coletas.length === 0 ? (
          <p style={{ padding: '20px', color: '#999' }}>Nenhuma coleta registrada.</p>
        ) : (
          coletas.map((item) => (
            <div className="history-card" key={item.id}>
              <div className="card-icon">
                <div className="recycle-symbol">♻️</div>
              </div>
              <div className="card-info">
                <div className="card-status-row">
                  <span className="status-text">{item.categoria}</span>
                  <span className="date-text">{item.quantidade} itens</span>
                </div>
                <p className="location-text">{item.localizacao}</p>
              </div>
              <button className="btn-detalhes">Detalhes</button>
            </div>
          ))
        )}
      </section>

      <nav className="footer-nav">
        <div className="nav-item-box active" onClick={() => navigate('/home')}>
          <HomeIcon size={24} />
          <span>Home</span>
        </div>
        <div className="nav-item-box">
          <Ticket size={24} />
          <span>Cupons</span>
        </div>
        <div className="nav-item-box plus" onClick={() => navigate('/processo-coleta')}>
          <PlusCircle size={40} color="#64bc3c" />
        </div>
        <div className="nav-item-box">
          <MapPin size={24} />
          <span>Mapa</span>
        </div>
        <div className="nav-item-box" onClick={() => navigate('/perfil')}>
          <User size={24} />
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default Home;