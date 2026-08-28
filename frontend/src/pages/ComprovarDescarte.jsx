import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ComprovarDescarte() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Recebe os dados da IA passados pelo Scanner
  const resultadoIA = location.state?.resultado;

  const [fotoComprovante, setFotoComprovante] = useState(null);
  const [bairro, setBairro] = useState('Centro - Florianópolis');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const lidarComFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoComprovante(URL.createObjectURL(file));
      setErro('');
    }
  };

  const confirmarDescarte = async () => {
    if (!fotoComprovante) {
      setErro('Por favor, tire ou selecione a foto comprovando o descarte na lixeira.');
      return;
    }

    // Busca o ID do usuário logado
    let usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
      usuarioId = loginData?.user?.id;
    }

    if (!usuarioId) {
      setErro('Usuário não autenticado. Faça login novamente.');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      // Salva no banco de dados e credita os 5 pontos automaticamente
      await axios.post('http://localhost:3000/residuos', {
        categoria: resultadoIA?.categoria || 'Reciclável',
        tipo_reciclagem: resultadoIA?.item || 'Material Reciclado',
        quantidade: 1,
        localizacao: bairro,
        usuario_id: usuarioId
      });

      alert('🎉 Parabéns! Descarte comprovado com sucesso. +5 Pontos foram adicionados à sua conta!');
      navigate('/home');
    } catch (err) {
      console.error('Erro ao registrar descarte:', err);
      setErro('Falha ao registrar descarte. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px', fontFamily: '"Inter", sans-serif' }}>
      <button 
        onClick={() => navigate('/scanner')} 
        style={{ background: 'transparent', border: 'none', color: '#2e7d32', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}
      >
        <ArrowLeft size={18} /> Voltar ao Scanner
      </button>

      <h2 style={{ color: '#1b5e20', textAlign: 'center', fontWeight: '800', marginBottom: '8px' }}>Comprovar Descarte ♻️</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '24px' }}>
        Tire uma foto do material na lixeira ou ecoponto para validar seus <strong>+5 Pontos</strong>.
      </p>

      {/* Resumo do Item Analisado */}
      {resultadoIA && (
        <div style={{ background: '#f1f8e9', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #c8e6c9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#558b2f', fontWeight: '700', textTransform: 'uppercase' }}>Item identificado</span>
            <h4 style={{ margin: '2px 0 0', color: '#2e7d32', fontSize: '16px' }}>{resultadoIA.item}</h4>
          </div>
          <span style={{ background: '#2e7d32', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
            {resultadoIA.categoria}
          </span>
        </div>
      )}

      {/* Input oculto da câmera */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={lidarComFoto} 
        style={{ display: 'none' }} 
      />

      {/* Área da Foto de Comprovação */}
      <div 
        onClick={() => fileInputRef.current.click()}
        style={{
          width: '100%',
          height: '240px',
          border: '2px dashed #81c784',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: '#fafafa',
          overflow: 'hidden',
          marginBottom: '20px'
        }}
      >
        {fotoComprovante ? (
          <img src={fotoComprovante} alt="Comprovante" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Camera size={44} color="#2e7d32" style={{ marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: '700', color: '#2e7d32' }}>Fotografar descarte na lixeira</p>
            <span style={{ fontSize: '12px', color: '#888' }}>Clique aqui para abrir a câmera</span>
          </div>
        )}
      </div>

      {/* Localização do Descarte */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
          Local / Ponto de Coleta:
        </label>
        <input 
          type="text" 
          value={bairro} 
          onChange={(e) => setBairro(e.target.value)} 
          placeholder="Ex: Ponto de Entrega Centro"
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      {erro && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
          {erro}
        </div>
      )}

      {/* Botão de Finalizar */}
      <button
        onClick={confirmarDescarte}
        disabled={enviando}
        style={{
          width: '100%',
          padding: '15px',
          background: enviando ? '#a5d6a7' : '#2e7d32',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '800',
          cursor: enviando ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <CheckCircle size={20} />
        {enviando ? 'Validando descarte...' : 'Confirmar e Resgatar +5 Pontos'}
      </button>
    </div>
  );
}