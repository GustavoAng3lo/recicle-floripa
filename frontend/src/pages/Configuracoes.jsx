import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, List, Settings, ShieldCheck, ArrowLeft } from 'lucide-react';
import logoRecicle from '../assets/png.png';

const Configuracoes = () => {
  const navigate = useNavigate();
  const nomeUsuario = "Luis Gustavo";

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
            <p style={{ margin: 0, color: '#666', fontWeight: '600' }}>Seus Pontos: <span style={{ color: '#2e7d32' }}>450 pts</span> (Ranking #12)</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ConfigItem icon={<User size={20} />} title="Perfil" desc="Gerencie seu nome e foto de perfil." />
            <ConfigItem icon={<MapPin size={20} />} title="Endereço Salvo" desc="SC-401, 9301 - Santo Antônio de Lisboa, Florianópolis" />
            <ConfigItem icon={<List size={20} />} title="Minhas Coletas" desc="Veja o histórico de todas as suas coletas." />
            <ConfigItem icon={<Settings size={20} />} title="Configuração" desc="Preferências da conta e notificações." />
            <ConfigItem icon={<ShieldCheck size={20} />} title="Login e Segurança" desc="Altere sua senha e proteja sua conta." />
          </div>

          <button style={{ width: '100%', marginTop: '30px', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#64bc3c', color: 'white', fontWeight: '800', cursor: 'pointer' }}>
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