<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Configuracoes() {
  const [user, setUser] = useState({ nome: "", email: "", cpf: "" });
  
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  const userId = loginData?.user?.id;

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3000/usuarios/${userId}`)
      .then(res => setUser({ nome: res.data.nome, email: res.data.email, cpf: res.data.cpf || "" }))
      .catch(err => console.error("Erro ao buscar dados do perfil:", err));
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/usuarios/${userId}`, {
        nome: user.nome,
        email: user.email,
        cpf: user.cpf
      });
      
      // Sincroniza o novo nome no localStorage para atualizar os cabeçalhos do site
      if (loginData) {
        loginData.user.nome = user.nome;
        loginData.user.email = user.email;
        localStorage.setItem("loginData", JSON.stringify(loginData));
      }

      alert("✅ Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("❌ Falha ao atualizar dados.");
    }
=======
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
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Configurações da Conta</h2>
      <p className="text-gray-500 text-sm mb-6">Mantenha os dados do seu perfil atualizados.</p>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
          <input
            type="text"
            value={user.nome}
            onChange={(e) => setUser({ ...user, nome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            required
          />
        </div>

<<<<<<< HEAD
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            required
          />
=======
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
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">CPF</label>
          <input
            type="text"
            value={user.cpf}
            onChange={(e) => setUser({ ...user, cpf: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="000.000.000-00"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition mt-2 shadow-sm"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}