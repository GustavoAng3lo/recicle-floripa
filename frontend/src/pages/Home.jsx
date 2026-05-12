import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Calendar, Award, Recycle, ChevronRight } from 'lucide-react';
import logoRecicle from '../assets/png.png';

const Home = () => {
  const navigate = useNavigate();
  const nomeUsuario = "Luis Gustavo";

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8faf8', 
      fontFamily: '"Inter", sans-serif',
      paddingBottom: '40px'
    }}>
      
      {/* NAVBAR SUPERIOR - ESTILO DESKTOP */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 5%', 
        backgroundColor: '#2e7d32', 
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Logo com fundo branco para destaque sobre o verde */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '5px', display: 'flex' }}>
            <img src={logoRecicle} alt="Logo" style={{ width: '40px', height: 'auto' }} />
          </div>
          <span style={{ fontWeight: '900', fontSize: '1.4rem', letterSpacing: '1px' }}>RECICLE</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>{nomeUsuario}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Eco-Cidadão</p>
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </nav>

      {/* SEÇÃO HERO (BANNER VERDE LARGO) */}
      <section style={{ 
        background: 'linear-gradient(135deg, #2e7d32 0%, #64bc3c 100%)', 
        padding: '60px 5%', 
        color: 'white', 
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '15px' }}>Faça sua coleta</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, marginBottom: '30px' }}>
          Sua atitude muda o mundo, comece pelo lixo.
        </p>
        <button style={mapButtonStyle}>Mapa</button>
      </section>

      {/* CONTEÚDO EM GRID (LAYOUT COMPUTADOR) */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
          
          {/* COLUNA ESQUERDA: AÇÕES E HISTÓRICO */}
          <div>
            <h3 style={sectionTitleStyle}>O que você deseja fazer?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <ActionCard 
                icon={<Calendar color="#2e7d32" />} 
                title="Agendar Coleta" 
                desc="Marque um horário para coleta especial." 
                onClick={() => navigate('/servicos')}
              />
              <ActionCard 
                icon={<MapPin color="#2e7d32" />} 
                title="Pontos de Entrega" 
                desc="Encontre locais de descarte em Floripa." 
              />
              <ActionCard 
                icon={<Award color="#2e7d32" />} 
                title="Trocar Pontos" 
                desc="Resgate prêmios e benefícios." 
              />
            </div>

            <h3 style={sectionTitleStyle}>Histórico de Coletas (SQL)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <HistoryCard status="Concluída" data="13/11/2025" local="Rua das Flores" />
              <HistoryCard status="Concluída" data="10/11/2025" local="Av. Beira Mar" />
            </div>
          </div>

          {/* COLUNA DIREITA: STATUS DO USUÁRIO */}
          <aside style={statsBoxStyle}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Olá, {nomeUsuario}! 👋</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={statItemStyle}>
                <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: '700' }}>SEUS PONTOS ACUMULADOS</span>
                <strong style={{ fontSize: '1.8rem' }}>450 pts</strong>
              </div>
              <div style={statItemStyle}>
                <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: '700' }}>RANKING FLORIPA</span>
                <strong style={{ fontSize: '1.8rem' }}>#12</strong>
              </div>
            </div>
            <button style={{ 
              marginTop: '20px', 
              width: '100%', 
              padding: '12px', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: 'white', 
              color: '#2e7d32', 
              fontWeight: '800', 
              cursor: 'pointer' 
            }}>
              Ver detalhes do perfil
            </button>
          </aside>

        </div>
      </main>
    </div>
  );
};

// COMPONENTES AUXILIARES DE ESTILO
const ActionCard = ({ icon, title, desc, onClick }) => (
  <div style={actionCardStyle} onClick={onClick}>
    <div style={iconBoxStyle}>{icon}</div>
    <h4 style={{ margin: '12px 0 5px 0', fontSize: '1.1rem', fontWeight: '800', color: '#333' }}>{title}</h4>
    <p style={{ margin: 0, fontSize: '0.85rem', color: '#777', lineHeight: '1.4' }}>{desc}</p>
    <div style={{ marginTop: '15px', color: '#2e7d32', display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
      Acessar <ChevronRight size={14} />
    </div>
  </div>
);

const HistoryCard = ({ status, data, local }) => (
  <div style={historyCardStyle}>
    <div style={recycleCircleStyle}><Recycle size={22} color="#2e7d32" /></div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '800', color: '#2e7d32' }}>{status}</span>
        <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: '600' }}>{data}</span>
      </div>
      <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '0.95rem', fontWeight: '500' }}>{local}</p>
    </div>
    <button style={detailsBtnStyle}>Detalhes</button>
  </div>
);

// OBJETOS DE ESTILO (CSS-IN-JS)
const logoutButtonStyle = {
  backgroundColor: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '10px',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: '0.2s'
};

const mapButtonStyle = {
  backgroundColor: 'white',
  color: '#2e7d32',
  border: 'none',
  padding: '18px 70px',
  borderRadius: '16px',
  fontWeight: '900',
  fontSize: '1.2rem',
  cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  transition: '0.3s'
};

const sectionTitleStyle = { color: '#333', fontWeight: '900', marginBottom: '25px', fontSize: '1.3rem', letterSpacing: '-0.5px' };

const actionCardStyle = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '24px',
  border: '1px solid #eee',
  textAlign: 'left',
  cursor: 'pointer',
  transition: '0.3s',
  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
};

const iconBoxStyle = {
  backgroundColor: '#f0f7f0',
  width: '45px',
  height: '45px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const historyCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '24px',
  border: '1px solid #eee',
  transition: '0.3s'
};

const recycleCircleStyle = { backgroundColor: '#f0f7f0', padding: '12px', borderRadius: '16px' };

const detailsBtnStyle = {
  backgroundColor: '#f0f2f0',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '10px',
  fontWeight: '800',
  fontSize: '0.85rem',
  color: '#444',
  cursor: 'pointer'
};

const statsBoxStyle = {
  background: 'linear-gradient(135deg, #2e7d32 0%, #64bc3c 100%)',
  padding: '35px',
  borderRadius: '30px',
  color: 'white',
  boxShadow: '0 15px 30px rgba(46, 125, 50, 0.2)',
  position: 'sticky',
  top: '20px'
};

const statItemStyle = {
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: '20px',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  backdropFilter: 'blur(5px)'
};

export default Home;