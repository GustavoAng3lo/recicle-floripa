import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, List, Settings, ShieldCheck, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import logoRecicle from '../assets/png.png';

export default function Configuracoes() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuarioNome') || 'Usuário');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [pontos, setPontos] = useState(0);
  const [feedback, setFeedback] = useState({ msg: '', tipo: '' });

  // Puxa o ID de forma flexível (suporta usuario_id ou loginData)
  let userId = localStorage.getItem('usuario_id');
  const loginDataRaw = localStorage.getItem("loginData");
  let loginData = null;

  if (loginDataRaw) {
    loginData = JSON.parse(loginDataRaw);
    if (!userId) userId = loginData?.user?.id;
  }

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3000/usuarios/${userId}`)
      .then(res => {
        setPontos(res.data.pontos || 0);
        if (res.data.nome) setNomeUsuario(res.data.nome);
        if (res.data.email) setEmail(res.data.email);
        if (res.data.cpf) setCpf(res.data.cpf);
      })
      .catch(err => console.error("Erro ao buscar dados do perfil:", err));
  }, [userId]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await axios.put(`http://localhost:3000/usuarios/${userId}`, {
        nome: nomeUsuario,
        email: email,
        cpf: cpf
      });

      // Sincroniza os storages para não quebrar os cabeçalhos do resto do app
      localStorage.setItem('usuarioNome', nomeUsuario);
      if (loginData) {
        loginData.user.nome = nomeUsuario;
        loginData.user.email = email;
        localStorage.setItem("loginData", JSON.stringify(loginData));
      }

      setFeedback({ msg: '✅ Perfil atualizado com sucesso!', tipo: 'sucesso' });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setFeedback({ msg: '❌ Falha ao atualizar dados.', tipo: 'erro' });
    }
    setTimeout(() => setFeedback({ msg: '', tipo: '' }), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf8', fontFamily: '"Inter", sans-serif', paddingBottom: '40px' }}>
      
      {/* HEADER DE NAVEGAÇÃO */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 5%', backgroundColor: 'white', borderBottom: '1px solid #eee', gap: '20px' }}>
        <button 
          onClick={() => navigate('/home')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2e7d32', fontWeight: '700', gap: '5px' }}
        >
          <ArrowLeft size={18} /> Voltar para Home
        </button>
      </div>

      <main style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '650px', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', fontWeight: '800', color: '#333' }}>Configurações da Conta</h1>
            <p style={{ margin: 0, color: '#666', fontWeight: '600' }}>Seus Pontos: <span style={{ color: '#2e7d32' }}>{pontos} pts</span></p>
          </div>

          <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Nome Completo</label>
              <input
                type="text"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>E-mail de Contato</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ConfigItem icon={<User size={20} color="#2e7d32" />} title="Perfil Público" desc="Gerencie como seu nome de Eco-Cidadão aparece." />
              <ConfigItem icon={<MapPin size={20} color="#2e7d32" />} title="Endereço Padrão" desc="Florianópolis, Santa Catarina" />
              <ConfigItem icon={<List size={20} color="#2e7d32" />} title="Minhas Coletas" desc="Gerencie os agendamentos feitos no app." />
              <ConfigItem icon={<ShieldCheck size={20} color="#2e7d32" />} title="Login e Segurança" desc="Mantenha suas credenciais seguras." />
            </div>

            {feedback.msg && (
              <div style={{
                color: feedback.tipo === 'sucesso' ? '#2e7d32' : '#d32f2f',
                backgroundColor: feedback.tipo === 'sucesso' ? '#f0f7f0' : '#fff5f5',
                border: `1px solid ${feedback.tipo === 'sucesso' ? '#2e7d32' : '#fc8181'}`,
                borderRadius: '12px', padding: '12px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '600'
              }}>
                {feedback.msg}
              </div>
            )}

            <button type="submit" style={buttonStyle}>
              Salvar Alterações
            </button>
          </form>
          
        </div>
      </main>
    </div>
  );
}

// Componente Interno Auxiliar
const ConfigItem = ({ icon, title, desc }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#fdfdfd', border: '1px solid #f0f0f0', borderRadius: '14px' }}>
    <div style={{ backgroundColor: '#f0f7f0', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#333' }}>{title}</h4>
      <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#777' }}>{desc}</p>
    </div>
  </div>
);

// Estilos Reutilizáveis
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#444', display: 'block', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', fontFamily: '"Inter", sans-serif' };
const buttonStyle = { width: '100%', marginTop: '10px', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#2e7d32', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', transition: '0.2s' };