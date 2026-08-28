import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Scanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [imagemPreview, setImagemPreview] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  // Mapeamento de cores para as lixeiras padrão CONAMA
  const coresLixeira = {
    'Plástico': { bg: '#e53935', border: '#b71c1c', texto: '#ffffff', tag: '🔴 Lixeira Vermelha (Plástico)' },
    'Papel': { bg: '#1e88e5', border: '#0d47a1', texto: '#ffffff', tag: '🔵 Lixeira Azul (Papel)' },
    'Vidro': { bg: '#43a047', border: '#1b5e20', texto: '#ffffff', tag: '🟢 Lixeira Verde (Vidro)' },
    'Metal': { bg: '#fbc02d', border: '#f57f17', texto: '#212121', tag: '🟡 Lixeira Amarela (Metal)' },
    'Orgânico': { bg: '#8d6e63', border: '#4e342e', texto: '#ffffff', tag: '🟤 Lixeira Marrom (Orgânico)' },
    'Não Reciclável / Rejeito': { bg: '#616161', border: '#212121', texto: '#ffffff', tag: '⚫ Lixeira Cinza / Rejeito' },
    'Eletrônico': { bg: '#ff9800', border: '#e65100', texto: '#ffffff', tag: '🟠 Ponto de Coleta Especial' }
  };

  const lidarComArquivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoImagem(file);
      setImagemPreview(URL.createObjectURL(file));
      setResultado(null);
      setErro('');
    }
  };

  const analisarImagemComIA = async () => {
    if (!arquivoImagem) {
      setErro('Selecione ou capture uma foto primeiro.');
      return;
    }

    setCarregando(true);
    setErro('');

    const formData = new FormData();
    formData.append('imagem', arquivoImagem);

    try {
      const response = await fetch('http://localhost:3000/ia/analisar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha ao analisar a imagem. Tente novamente.');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      setErro('Erro ao processar imagem. Verifique a conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  const lixeiraInfo = resultado ? coresLixeira[resultado.categoria] || coresLixeira['Não Reciclável / Rejeito'] : null;

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate('/home')} 
        style={{ background: 'transparent', border: 'none', color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' }}
      >
        ← Voltar para o Início
      </button>

      <h2 style={{ color: '#1b5e20', textAlign: 'center', marginBottom: '8px' }}>Escanear Material com IA 📸</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        Tire uma foto ou selecione da galeria para identificar o descarte correto.
      </p>

      {/* Input oculto para câmera/galeria */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={lidarComArquivo} 
        style={{ display: 'none' }} 
      />

      {/* Área de Visualização da Foto */}
      <div 
        onClick={() => fileInputRef.current.click()}
        style={{
          width: '100%',
          height: '260px',
          border: '2px dashed #81c784',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: '#f1f8e9',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {imagemPreview ? (
          <img src={imagemPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span style={{ fontSize: '48px' }}>📷</span>
            <p style={{ margin: '8px 0 0', fontWeight: 'bold', color: '#2e7d32' }}>Toque para abrir a câmera ou galeria</p>
          </div>
        )}
      </div>

      {erro && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginTop: '15px', fontSize: '14px', textAlign: 'center' }}>
          {erro}
        </div>
      )}

      {/* Botão de Análise */}
      <button
        onClick={analisarImagemComIA}
        disabled={carregando || !arquivoImagem}
        style={{
          width: '100%',
          padding: '14px',
          marginTop: '16px',
          background: carregando || !arquivoImagem ? '#a5d6a7' : '#2e7d32',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: carregando || !arquivoImagem ? 'not-allowed' : 'pointer'
        }}
      >
        {carregando ? 'Identificando com Inteligência Artificial...' : 'Analisar Resíduo ✨'}
      </button>

      {/* Card com o Resultado da IA */}
      {resultado && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          borderRadius: '14px',
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#333' }}>{resultado.item}</h3>
            <span style={{
              background: resultado.reciclavel ? '#e8f5e9' : '#ffebee',
              color: resultado.reciclavel ? '#2e7d32' : '#c62828',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {resultado.reciclavel ? 'RECICLÁVEL' : 'NÃO RECICLÁVEL'}
            </span>
          </div>

          {/* Tag com a Cor da Lixeira */}
          <div style={{
            background: lixeiraInfo.bg,
            color: lixeiraInfo.texto,
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '14px'
          }}>
            {lixeiraInfo.tag}
          </div>

          <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', lineHeight: '1.4' }}>
            <strong>Como preparar para o descarte:</strong><br />
            {resultado.instrucaoPreparo}
          </div>

          {/* Botão para ir para o Passo 3 */}
          <button
            onClick={() => navigate('/comprovar-descarte', { state: { resultado, imagemOriginal: imagemPreview } })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#388e3c',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Vou descartar agora (+5 Pontos) ➔
          </button>
        </div>
      )}
    </div>
  );
}