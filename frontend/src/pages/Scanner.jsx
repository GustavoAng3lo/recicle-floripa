import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import { API_BASE_URL } from '../utils/api';

const coresLixeira = {
  Plástico: { bg: '#e53935', border: '#b71c1c', texto: '#fff', tag: 'Lixeira vermelha • Plástico' },
  Papel: { bg: '#1e88e5', border: '#0d47a1', texto: '#fff', tag: 'Lixeira azul • Papel' },
  Vidro: { bg: '#43a047', border: '#1b5e20', texto: '#fff', tag: 'Lixeira verde • Vidro' },
  Metal: { bg: '#fbc02d', border: '#f57f17', texto: '#212121', tag: 'Lixeira amarela • Metal' },
  Orgânico: { bg: '#8d6e63', border: '#4e342e', texto: '#fff', tag: 'Lixeira marrom • Orgânico' },
  'Não Reciclável / Rejeito': { bg: '#616161', border: '#212121', texto: '#fff', tag: 'Lixeira cinza • Rejeito' },
  Eletrônico: { bg: '#ff9800', border: '#e65100', texto: '#fff', tag: 'Ponto especial • Eletrônico' },
};

export default function Scanner() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const analisarFrameComIA = async (cameraFrame) => {
    setCarregando(true);
    setErro('');
    setResultado(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ia/analisar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cameraFrame),
      });
      if (!response.ok) {
        const falha = await response.json().catch(() => ({}));
        throw new Error(falha.error || 'Falha ao identificar o objeto da câmera.');
      }
      setResultado(await response.json());
    } catch (error) {
      console.error(error);
      setErro(error.message || 'Erro ao identificar o objeto. Verifique a conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  const iniciarNovoEscaneamento = () => {
    setResultado(null);
    setErro('');
    setCarregando(false);
  };

  const lixeiraInfo = resultado ? coresLixeira[resultado.categoria] || coresLixeira['Não Reciclável / Rejeito'] : null;

  return (
    <main className='scanner-page'>
      <div className='scanner-shell'>
        <header className='scanner-topbar'>
          <button className='scanner-back-button' onClick={() => navigate('/home')} aria-label='Voltar para o início'><ArrowLeft size={18} /></button>
          <div><h1>Novo Descarte</h1><p>Identifique o material reciclável</p></div>
          <span className='scanner-step'>1/2</span>
        </header>

        <section className='scanner-content'>
          <CameraCapture onCapture={analisarFrameComIA} busy={carregando} />
          <p className='scanner-typing-hint'>Aponte a câmera para o objeto e toque em “Identificar objeto”.</p>

          {erro && <div className='scanner-error'>{erro}</div>}

          {resultado && <article className='scanner-result'>
            <div className='scanner-result-emojis'>♻️ 🎉</div>
            <span className='home-eyebrow'>RESULTADO DA ANÁLISE</span>
            <h2>Material identificado!</h2>
            <strong className='scanner-result-item'>{resultado.item}</strong>
            <span className={`scanner-status ${resultado.reciclavel ? 'is-recyclable' : ''}`}><CheckCircle2 size={13} />{resultado.reciclavel ? resultado.categoria : 'Não reciclável'}</span>
            <div className='scanner-points-award'>+{resultado.pontosSugeridos || 5} PONTOS CONCEDIDOS!</div>
            <div className='scanner-instruction'><strong>Como preparar</strong><p>{resultado.instrucaoPreparo}</p></div>
            <div className='scanner-bin' style={{ background: lixeiraInfo.bg, borderColor: lixeiraInfo.border, color: lixeiraInfo.texto }}>{lixeiraInfo.tag}</div>
            <button className='auth-button auth-button-secondary scanner-confirm' onClick={iniciarNovoEscaneamento}><RefreshCw size={15} /> Escanear outro material</button>
            <button className='auth-button auth-button-secondary scanner-confirm' onClick={() => navigate('/comprovar-descarte', { state: { resultado } })}>Vou descartar agora <ArrowRight size={15} /></button>
          </article>}
        </section>
      </div>
    </main>
  );
}
