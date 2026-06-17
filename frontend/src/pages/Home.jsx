import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
<<<<<<< HEAD
import { Award, ChevronRight, Settings } from 'lucide-react';
=======
import { LogOut, MapPin, Calendar, Award, Recycle, ChevronRight, Settings } from 'lucide-react';
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
import logoRecicle from '../assets/png.png';

export default function Home() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
=======
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuarioNome') || "Usuário");
  const [coletas, setColetas] = useState([]);
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    const carregarDados = async () => {
      const id = localStorage.getItem('usuario_id');
      if (!id) return;

      try {
        // 1. Busca histórico de coletas
        const resColetas = await axios.get(`http://localhost:3000/residuos/${id}`);
        setColetas(resColetas.data);

        // 2. Busca dados do usuário para pegar os pontos atualizados
        const resUsuario = await axios.get(`http://localhost:3000/usuarios/${id}`);
        setPontos(resUsuario.data.pontos || 0);
        
      } catch (error) {
        console.error("Erro ao carregar dados do banco:", error);
      }
    };

    carregarDados();
  }, []);
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const loginDataRaw = localStorage.getItem("loginData");
      
      if (!loginDataRaw) {
        navigate('/login');
        return;
      }

      const loginData = JSON.parse(loginDataRaw);
      const userId = loginData?.user?.id;

      if (!userId) {
        console.error("ID do usuário não encontrado.");
        setLoading(false);
        return;
      }

      // Requisições paralelas para maior velocidade
      const [resUser, resHistory] = await Promise.all([
        axios.get(`http://localhost:3000/usuarios/${userId}`),
        axios.get(`http://localhost:3000/residuos/${userId}`)
      ]);

      setProfile(resUser.data);
      setHistory(resHistory.data);
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteColeta = async (coletaId) => {
    if (window.confirm("Deseja realmente excluir este registro de descarte?")) {
      try {
        await axios.delete(`http://localhost:3000/residuos/${coletaId}`);
        alert("✅ Registro excluído com sucesso!");
        setHistory(history.filter(item => item.id !== coletaId));
      } catch (error) {
        console.error("Erro ao deletar registro:", error);
        alert("❌ Não foi possível deletar o registro.");
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Carregando painel...</div>;
  }

  return (
<<<<<<< HEAD
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Exibição segura do perfil */}
      {profile && (
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold">Olá, {profile.nome || "Usuário"}!</h1>
          <p className="text-emerald-100 mt-1">Bem-vindo ao painel do Recicle Floripa.</p>
          <div className="mt-4 bg-white/20 inline-block px-4 py-2 rounded-xl">
            <span className="text-xs uppercase font-semibold tracking-wider block opacity-75">Pontuação Acumulada</span>
            <span className="text-3xl font-extrabold">{profile.pontos || 0} pts</span>
=======
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf8', fontFamily: '"Inter", sans-serif', paddingBottom: '40px' }}>
      
      {/* NAVBAR SUPERIOR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '5px', display: 'flex' }}>
            <img src={logoRecicle} alt="Logo" style={{ width: '40px', height: 'auto' }} />
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Seu Histórico de Coletas</h2>
        
<<<<<<< HEAD
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum descarte registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 font-semibold text-sm">
                  <th className="pb-3">Material</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3 text-center">Qtd</th>
                  <th className="pb-3">Localização</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 capitalize font-medium">{item.categoria}</td>
                    <td className="py-3 capitalize">{item.tipo_reciclagem}</td>
                    <td className="py-3 text-center">{item.quantidade}</td>
                    <td className="py-3">{item.localizacao || "Não informada"}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => handleDeleteColeta(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-lg text-xs transition"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
=======
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
                    status={item.categoria} 
                    material={item.tipo_reciclagem} 
                    data={item.data_descarte ? new Date(item.data_descarte).toLocaleDateString('pt-BR') : 'Sem data'} 
                    local={item.localizacao} 
                  />
                ))
              ) : (
                <div style={emptyHistoryStyle}>
                  <Recycle size={40} color="#ccc" />
                  <p>Nenhuma coleta registrada para este usuário.</p>
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
};

// COMPONENTES AUXILIARES
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

const HistoryCard = ({ status, data, local, material }) => (
  <div style={historyCardStyle}>
    <div style={recycleCircleStyle}><Recycle size={22} color="#2e7d32" /></div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: '800', color: '#2e7d32', display: 'block' }}>{status}</span>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>{material || 'Não identificado'}</span>
        </div>
        <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: '600' }}>{data}</span>
      </div>
      <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '0.95rem', fontWeight: '500' }}>{local}</p>
    </div>
  </div>
);

// ESTILOS
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5%', backgroundColor: '#2e7d32', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const heroStyle = { background: 'linear-gradient(135deg, #2e7d32 0%, #64bc3c 100%)', padding: '60px 5%', color: 'white', textAlign: 'center', marginBottom: '40px' };
const logoutButtonStyle = { backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const mapButtonStyle = { backgroundColor: 'white', color: '#2e7d32', border: 'none', padding: '18px 70px', borderRadius: '16px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' };
const sectionTitleStyle = { color: '#333', fontWeight: '900', marginBottom: '25px', fontSize: '1.3rem' };
const actionCardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #eee', textAlign: 'left', cursor: 'pointer', transition: '0.3s' };
const iconBoxStyle = { backgroundColor: '#f0f7f0', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const historyCardStyle = { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #eee' };
const recycleCircleStyle = { backgroundColor: '#f0f7f0', padding: '12px', borderRadius: '16px' };
const statsBoxStyle = { background: 'linear-gradient(135deg, #2e7d32 0%, #64bc3c 100%)', padding: '35px', borderRadius: '30px', color: 'white', position: 'sticky', top: '20px' };
const statItemStyle = { backgroundColor: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' };
const configButtonStyle = { marginTop: '10px', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: 'white', color: '#2e7d32', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' };
const emptyHistoryStyle = { textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '24px', border: '1px dashed #ccc', color: '#888' };

export default Home;
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
