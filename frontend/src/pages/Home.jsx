import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, MapPin, Calendar, Award, Recycle, ChevronRight, Settings, Trash2 } from 'lucide-react';
import logoRecicle from '../assets/png.png';

export default function Home() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuarioNome') || "Usuário");
  const [coletas, setColetas] = useState([]);
  const [pontos, setPontos] = useState(0);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    // Tenta pegar o ID direto ou de dentro do loginData
    let id = localStorage.getItem('usuario_id');
    
    if (!id) {
      const loginDataRaw = localStorage.getItem("loginData");
      if (loginDataRaw) {
        const loginData = JSON.parse(loginDataRaw);
        id = loginData?.user?.id;
      }
    }

    if (!id) {
      console.error("ID do usuário não encontrado.");
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      // Requisições paralelas para maior velocidade
      const [resColetas, resUsuario] = await Promise.all([
        axios.get(`http://localhost:3000/residuos/${id}`),
        axios.get(`http://localhost:3000/usuarios/${id}`)
      ]);

      setColetas(resColetas.data || []);
      setPontos(resUsuario.data.pontos || 0);
      if (resUsuario.data.nome) {
        setNomeUsuario(resUsuario.data.nome);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do banco:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [navigate]);

  // Função para Deletar a Coleta e Atualizar os Pontos Dinamicamente
  const handleDeletarColeta = async (idDaColeta) => {
    if (!window.confirm("Tem certeza de que deseja excluir este descarte? Seus pontos acumulados diminuirão.")) {
      return;
    }

    try {
      // Chama o endpoint DELETE do backend que configuramos
      await axios.delete(`http://localhost:3000/residuos/${idDaColeta}`);
      
      // Recarrega todos os dados do banco para garantir sincronia real de pontos e histórico
      await carregarDados();
      
      alert("Descarte excluído com sucesso! Seus pontos foram atualizados.");
    } catch (error) {
      console.error("Erro ao deletar descarte:", error);
      alert("Não foi possível excluir o registro.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Carregando painel...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf8', fontFamily: '"Inter", sans-serif', paddingBottom: '40px' }}>
      
      {/* NAVBAR SUPERIOR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '5px', display: 'flex' }}>
            <img src={logoRecicle} alt="Logo" style={{ width: '40px', height: 'auto' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => navigate('/configuracoes')}>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>{nomeUsuario}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Eco-Cidadão</p>
            </div>
            <Settings size={20} style={{ opacity: 0.9 }} />
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}><LogOut size={18} /> Sair</button>
        </div>
      </nav>

      {/* SEÇÃO HERO */}
      <section style={heroStyle}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '15px' }}>Faça sua coleta</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, marginBottom: '30px' }}>Sua atitude muda o mundo, comece pelo lixo.</p>
        <button style={mapButtonStyle}>Mapa de Pontos</button>
      </section>

      {/* CONTEÚDO EM GRID */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
          <div>
            <h3 style={sectionTitleStyle}>O que você deseja fazer?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <ActionCard 
                icon={<Calendar color="#2e7d32" />} 
                title="Agendar Coleta" 
                desc="Registre um novo descarte agora." 
                onClick={() => navigate('/coleta')} 
              />
              <ActionCard icon={<MapPin color="#2e7d32" />} title="Pontos de Entrega" desc="Encontre locais de descarte em Floripa." />
              <ActionCard icon={<Award color="#2e7d32" />} title="Trocar Pontos" desc="Resgate prêmios e benefícios." />
            </div>

            <h3 style={sectionTitleStyle}>Histórico de Coletas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {coletas.length > 0 ? (
                coletas.map((item) => (
                  <HistoryCard 
                    key={item.id}
                    id={item.id}
                    status={item.categoria} 
                    material={item.tipo_reciclagem} 
                    data={item.data_descarte ? new Date(item.data_descarte).toLocaleDateString('pt-BR') : 'Sem data'} 
                    local={item.localizacao || "Não informada"} 
                    onDelete={handleDeletarColeta}
                  />
                ))
              ) : (
                <div style={emptyHistoryStyle}>
                  <Recycle size={40} color="#ccc" style={{ marginBottom: '10px' }} />
                  <p style={{ margin: 0 }}>Nenhuma coleta registrada para este usuário.</p>
                </div>
              )}
            </div>
          </div>

          <aside style={statsBoxStyle}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Olá, {nomeUsuario}! 👋</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={statItemStyle}>
                <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: '700' }}>SEUS PONTOS ACUMULADOS</span>
                <strong style={{ fontSize: '1.8rem' }}>{pontos} pts</strong>
              </div>
              <div style={statItemStyle}>
                <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: '700' }}>COLETAS REALIZADAS</span>
                <strong style={{ fontSize: '1.8rem' }}>{coletas.length}</strong>
              </div>
            </div>
            <button onClick={() => navigate('/configuracoes')} style={configButtonStyle}>Configurações da Conta</button>
          </aside>
        </div>
      </main>
    </div>
  );
}

// COMPONENTES AUXILIARES
const ActionCard = ({ icon, title, desc, onClick }) => (
  <div 
    style={actionCardStyle} 
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={iconBoxStyle}>{icon}</div>
    <h4 style={{ margin: '12px 0 5px 0', fontSize: '1.1rem', fontWeight: '800', color: '#333' }}>{title}</h4>
    <p style={{ margin: 0, fontSize: '0.85rem', color: '#777', lineHeight: '1.4' }}>{desc}</p>
    <div style={{ marginTop: '15px', color: '#2e7d32', display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
      Acessar <ChevronRight size={14} />
    </div>
  </div>
);

const HistoryCard = ({ id, status, data, local, material, onDelete }) => (
  <div style={historyCardStyle}>
    <div style={recycleCircleStyle}><Recycle size={22} color="#2e7d32" /></div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '800', color: '#2e7d32', textTransform: 'capitalize' }}>{status}</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600', display: 'block', marginTop: '2px' }}>{material || 'Não identificado'}</span>
        <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '0.95rem', fontWeight: '500' }}>{local}</p>
      </div>
      
      {/* Container da direita com data e lixeira */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '10px' }}>
        <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: '600' }}>{data}</span>
        <button 
          onClick={() => onDelete(id)}
          style={deleteButtonStyle}
          title="Excluir descarte"
          onMouseEnter={(e) => e.currentTarget.style.color = '#b91c1c'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

// ESTILOS (CSS-in-JS)
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5%', backgroundColor: '#2e7d32', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const heroStyle = { background: 'linear-gradient(135deg, #2e7d32 0%, #64bc3c 100%)', padding: '60px 5%', color: 'white', textAlign: 'center', marginBottom: '40px' };
const logoutButtonStyle = { backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const mapButtonStyle = { backgroundColor: 'white', color: '#2e7d32', border: 'none', padding: '18px 70px', borderRadius: '16px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' };
const sectionTitleStyle = { color: '#333', fontWeight: '900', marginBottom: '25px', fontSize: '1.3rem' };
const actionCardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #eee', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' };
const iconBoxStyle = { backgroundColor: '#f0f7f0', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const historyCardStyle = { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #eee' };
const recycleCircleStyle = { backgroundColor: '#f0f7f0', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center' };
const deleteButtonStyle = { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const statsBoxStyle = { background: 'linear-gradient(135deg, #2e7d32 0%, #64bc3c 100%)', padding: '35px', borderRadius: '30px', color: 'white', position: 'sticky', top: '20px' };
const statItemStyle = { backgroundColor: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' };
const configButtonStyle = { marginTop: '10px', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: 'white', color: '#2e7d32', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' };
const emptyHistoryStyle = { textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '24px', border: '1px dashed #ccc', color: '#888', display: 'flex', flexDirection: 'column', alignItems: 'center' };