import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, Calendar, Box, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import logoRecicle from '../assets/png.png';

const Servicos = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [agendado, setAgendado] = useState(false);

  // Base de dados simples para o "Guia Inteligente"
  const materiais = [
    { nome: 'Garrafa PET', tipo: 'Plástico', instrução: 'Lave para retirar resíduos e amasse para ocupar menos espaço.', cor: '#e53935' },
    { nome: 'Caixa de Leite', tipo: 'Papel/Plástico/Metal', instrução: 'Retire o excesso de líquido e descarte no lixo seco.', cor: '#1e88e5' },
    { nome: 'Lâmpada', tipo: 'Resíduo Especial', instrução: 'Não descarte no lixo comum. Leve a um ponto de coleta de eletrônicos.', cor: '#ffb300' },
    { nome: 'Óleo de Cozinha', tipo: 'Líquido Poluente', instrução: 'Coloque em uma garrafa PET bem fechada e agende a coleta.', cor: '#fb8c00' },
    { nome: 'Papelão', tipo: 'Papel', instrução: 'Mantenha seco e dobrado para facilitar o transporte.', cor: '#1e88e5' },
  ];

  const resultados = materiais.filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()));

  const handleAgendar = (e) => {
    e.preventDefault();
    setAgendado(true);
    setTimeout(() => { setAgendado(false); navigate('/home'); }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf8', fontFamily: '"Inter", sans-serif' }}>
      
      {/* NAVBAR SIMPLIFICADA */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          <span style={{ fontWeight: '700' }}>Voltar para Home</span>
        </div>
        <img src={logoRecicle} alt="Logo" style={{ width: '35px' }} />
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* SEÇÃO 1: GUIA INTELIGENTE */}
        <section style={{ marginBottom: '50px' }}>
          <h2 style={titleStyle}>Guia de Descarte Inteligente</h2>
          <p style={subtitleStyle}>Pesquise o material para saber como descartar corretamente em Floripa.</p>
          
          <div style={searchWrapperStyle}>
            <Search size={22} color="#999" />
            <input 
              type="text" 
              placeholder="Ex: Óleo de cozinha, PET, Papelão..." 
              style={searchInputStyle}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
            {busca && resultados.map((m, i) => (
              <div key={i} style={resultCardStyle}>
                <div style={{ ...typeBadgeStyle, backgroundColor: m.cor }}>{m.tipo}</div>
                <h4 style={{ margin: '10px 0' }}>{m.nome}</h4>
                <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>
                  <Info size={14} style={{ marginRight: '5px' }} /> {m.instrução}
                </p>
              </div>
            ))}
            {busca && resultados.length === 0 && (
              <p style={{ textAlign: 'center', color: '#888' }}>Material não encontrado. Tente um termo mais simples.</p>
            )}
          </div>
        </section>

        {/* SEÇÃO 2: FORMULÁRIO DE AGENDAMENTO */}
        <section style={formSectionStyle}>
          {agendado ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CheckCircle size={60} color="#2e7d32" style={{ marginBottom: '20px' }} />
              <h2 style={{ color: '#2e7d32' }}>Agendamento Confirmado!</h2>
              <p>As cooperativas parceiras foram notificadas.</p>
            </div>
          ) : (
            <>
              <h2 style={titleStyle}><Calendar style={{ marginRight: '10px' }} /> Agendar Coleta Especial</h2>
              <p style={subtitleStyle}>Use para grandes volumes, eletrônicos ou materiais perigosos.</p>

              <form onSubmit={handleAgendar} style={gridFormStyle}>
                <div style={inputGroup}>
                  <label style={labelStyle}>O que será coletado?</label>
                  <select style={inputStyle} required>
                    <option value="">Selecione o material</option>
                    <option value="eletronicos">Eletrônicos (TV, PC, etc)</option>
                    <option value="oleo">Óleo de Cozinha</option>
                    <option value="moveis">Móveis Velhos</option>
                    <option value="entulho">Grandes volumes de Recicláveis</option>
                  </select>
                </div>

                <div style={inputGroup}>
                  <label style={labelStyle}>Data sugerida</label>
                  <input type="date" style={inputStyle} required />
                </div>

                <div style={{ ...inputGroup, gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Ponto de Referência em Floripa</label>
                  <div style={inputWrapperStyle}>
                    <MapPin size={18} color="#999" />
                    <input type="text" placeholder="Ex: Próximo ao Titri" style={cleanInputStyle} />
                  </div>
                </div>

                <button type="submit" style={btnStyle}>SOLICITAR AGENDAMENTO</button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

// ESTILOS (OBJETOS)
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: 'white', borderBottom: '1px solid #eee' };
const titleStyle = { fontSize: '1.8rem', fontWeight: '800', color: '#333', marginBottom: '8px', display: 'flex', alignItems: 'center' };
const subtitleStyle = { color: '#666', marginBottom: '25px' };
const searchWrapperStyle = { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '15px 20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const searchInputStyle = { border: 'none', outline: 'none', width: '100%', marginLeft: '15px', fontSize: '1rem', fontFamily: '"Inter", sans-serif' };
const resultCardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #2e7d32', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' };
const typeBadgeStyle = { display: 'inline-block', padding: '4px 10px', borderRadius: '6px', color: 'white', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' };
const formSectionStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const gridFormStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#444' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontFamily: '"Inter", sans-serif' };
const inputWrapperStyle = { display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '10px', padding: '0 12px' };
const cleanInputStyle = { border: 'none', outline: 'none', padding: '12px', width: '100%', fontFamily: '"Inter", sans-serif' };
const btnStyle = { gridColumn: 'span 2', backgroundColor: '#64bc3c', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' };

export default Servicos;