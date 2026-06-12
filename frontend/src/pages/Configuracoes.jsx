import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, List, Settings, ShieldCheck, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import logoRecicle from '../assets/png.png';

const Configuracoes = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuarioNome') || 'Usuário');
  const [pontos, setPontos] = useState(0);
  const [feedback, setFeedback] = useState({ msg: '', tipo: '' });

  useEffect(() => {
    const id = localStorage.getItem('usuario_id');
    if (!id) return;
    axios.get(`http://localhost:3000/usuarios/${id}`)
      .then(res => {
        setPontos(res.data.pontos || 0);
        if (res.data.nome) setNomeUsuario(res.data.nome);
      })
      .catch(() => {});
  }, []);

  const handleSalvar = async () => {
    const id = localStorage.getItem('usuario_id');
    if (!id) return;
    try {
      await axios.put(`http://localhost:3000/usuarios/${id}`, { nome: nomeUsuario });
      localStorage.setItem('usuarioNome', nomeUsuario);
      setFeedback({ msg: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
    } catch (error) {
      setFeedback({ msg: error.response?.data?.error || 'Erro ao salvar.', tipo: 'erro' });
    }
    setTimeout(() => setFeedback({ msg: '', tipo: '' }), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf8', fontFamily: '"Inter", sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#2e7d32' }} onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          <span style={{ fontWeight: '700' }}>Voltar</span>
        </div>
        <img src={logoRecicle} alt="Logo" style={{ width: '35px' }} />
      </nav>

      <main style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '650px', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', fontWeight: '800' }}>Olá, {nomeUsuario}!</h1>
            <p style={{ margin: 0, color: '#666', fontWeight: '600' }}>Seus Pontos: <span style={{ color: '#2e7d32' }}>{pontos} pts</span></p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#444', display: 'block', marginBottom: '6px' }}>Nome de exibição</label>
            <input
              type="text"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: '"Inter", sans-serif' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ConfigItem icon={<User size={20} />} title="Perfil" desc="Gerencie seu nome e foto de perfil." />
            <ConfigItem icon={<MapPin size={20} />} title="Endereço Salvo" desc="SC-401, 9301 - Santo Antônio de Lisboa, Florianópolis" />
            <ConfigItem icon={<List size={20} />} title="Minhas Coletas" desc="Veja o histórico de todas as suas coletas." />
            <ConfigItem icon={<Settings size={20} />} title="Configuração" desc="Preferências da conta e notificações." />
            <ConfigItem icon={<ShieldCheck size={20} />} title="Login e Segurança" desc="Altere sua senha e proteja sua conta." />
          </div>

          {feedback.msg && (
            <p style={{
              color: feedback.tipo === 'sucesso' ? '#2e7d32' : '#d32f2f',
              backgroundColor: feedback.tipo === 'sucesso' ? '#f0f7f0' : '#fff5f5',
              border: `1px solid ${feedback.tipo === 'sucesso' ? '#2e7d32' : '#fc8181'}`,
              borderRadius: '8px', padding: '10px', fontSize: '0.85rem', margin: '20px 0 0 0', textAlign: 'center'
            }}>
              {feedback.msg}
            </p>
          )}

          <button onClick={handleSalvar} style={{ width: '100%', marginTop: '16px', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#64bc3c', color: 'white', fontWeight: '800', cursor: 'pointer' }}>
            Confirmar alteração
          </button>
        </div>
      </main>
    </div>
  );
};

const ConfigItem = ({ icon, title, desc }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '18px', borderRadius: '16px', backgroundColor: '#f9f9f9', border: '1px solid #efefef', cursor: 'pointer' }}>
    <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px', color: '#2e7d32' }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <h4 style={{ margin: '0', fontSize: '1rem', fontWeight: '700' }}>{title}</h4>
      <p style={{ margin: '0', fontSize: '0.85rem', color: '#777' }}>{desc}</p>
    </div>
  </div>
);

export default Configuracoes;