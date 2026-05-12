import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2, Search } from 'lucide-react';

const Coleta = () => {
  const [descricao, setDescricao] = useState('');
  const [tipoReciclagem, setTipoReciclagem] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [localizacao, setLocalizacao] = useState('Gaivotas, Florianópolis');
  const navigate = useNavigate();

  useEffect(() => {
    const identificarMaterial = () => {
      const p = descricao.toLowerCase();
      if (!p) {
        setTipoReciclagem('');
        return;
      }

      // LÓGICA DE RECONHECIMENTO AMPLIADA
      if (p.includes('garrafa') || p.includes('pote') || p.includes('copo de vidro') || p.includes('vidro') || p.includes('frasco')) {
        setTipoReciclagem('Vidro 🟢');
      } 
      else if (p.includes('lata') || p.includes('latinha') || p.includes('aluminio') || p.includes('ferro') || p.includes('metal') || p.includes('prego')) {
        setTipoReciclagem('Metal 🟡');
      } 
      else if (p.includes('papel') || p.includes('papelao') || p.includes('revista') || p.includes('folha') || p.includes('caderno') || p.includes('jornal')) {
        setTipoReciclagem('Papel 🔵');
      } 
      else if (p.includes('plastico') || p.includes('sacola') || p.includes('pet') || p.includes('copo') || p.includes('embalagem') || p.includes('tampa')) {
        setTipoReciclagem('Plástico 🔴');
      } 
      else if (p.includes('celular') || p.includes('bateria') || p.includes('pilha') || p.includes('fio') || p.includes('carregador') || p.includes('placa')) {
        setTipoReciclagem('Eletrônico ⚪');
      } 
      else {
        setTipoReciclagem('Não identificado');
      }
    };
    identificarMaterial();
  }, [descricao]);

  const handleSalvarColeta = async () => {
    try {
      const usuario_id = localStorage.getItem('usuario_id');
      await axios.post('http://localhost:3000/residuos', {
        categoria: descricao,
        tipo_reciclagem: tipoReciclagem,
        quantidade: Number(quantidade),
        localizacao,
        usuario_id: Number(usuario_id)
      });
      alert('Coleta Registrada com Sucesso!');
      navigate('/home');
    } catch (error) {
      alert('Erro ao salvar no banco de dados.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Inter' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <ArrowLeft onClick={() => navigate('/home')} style={{ cursor: 'pointer', color: '#2e7d32' }} />
        <h2 style={{ marginLeft: '20px', color: '#2e7d32', fontWeight: '800' }}>Nova Coleta</h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ fontWeight: '700', display: 'block', marginBottom: '5px' }}>O que você está descartando?</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #2e7d32', borderRadius: '12px', padding: '10px' }}>
            <Search size={20} color="#2e7d32" style={{ marginRight: '10px' }} />
            <input 
              placeholder="Ex: Folha de papel, copo plastico..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
        </div>

        {descricao && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: tipoReciclagem === 'Não identificado' ? '#fff5f5' : '#f0f7f0', 
            borderRadius: '12px', 
            border: `1px solid ${tipoReciclagem === 'Não identificado' ? '#fc8181' : '#2e7d32'}` 
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>O sistema reconheceu como:</p>
            <strong style={{ fontSize: '1.2rem', color: tipoReciclagem === 'Não identificado' ? '#c53030' : '#2e7d32' }}>
              {tipoReciclagem}
            </strong>
          </div>
        )}

        <div>
          <label style={{ fontWeight: '700' }}>Quantidade</label>
          <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <label style={{ fontWeight: '700' }}>Localização</label>
          <input type="text" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} style={inputStyle} />
        </div>

        <button onClick={handleSalvarColeta} style={buttonStyle}>
          <Trash2 size={20} style={{ marginRight: '10px' }} /> Confirmar Descarte
        </button>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' };
const buttonStyle = { backgroundColor: '#64bc3c', color: 'white', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer', marginTop: '10px' };

export default Coleta;