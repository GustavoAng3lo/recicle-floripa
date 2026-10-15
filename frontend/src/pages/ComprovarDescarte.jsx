import { useState } from 'react';
import { ArrowLeft, Check, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import { API_BASE_URL } from '../utils/api';

export default function ComprovarDescarte() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultadoIA = location.state?.resultado || { item: 'Garrafa de vidro transparente', categoria: 'Vidro', pontosSugeridos: 5 };
  const [cameraFrame, setCameraFrame] = useState(null);
  const [localizacao, setLocalizacao] = useState('Centro - Florianópolis');
  const [carregando, setCarregando] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [erro, setErro] = useState('');
  const usuarioId = localStorage.getItem('usuario_id') || 1;

  const handleFrameCapturado = (frame) => {
    setCameraFrame(frame);
    setErro('');
  };

  const handleConfirmarDescarte = async () => {
    if (!cameraFrame) {
      setErro('Capture um frame ao vivo mostrando onde o material foi descartado.');
      return;
    }

    setCarregando(true);
    setErro('');
    setStatusMsg('A IA está auditando o frame da câmera...');

    try {
      const resIA = await fetch(`${API_BASE_URL}/ia/validar-descarte`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cameraFrame, categoria: resultadoIA.categoria, item: resultadoIA.item }),
      });
      if (!resIA.ok) {
        const falha = await resIA.json().catch(() => ({}));
        throw new Error(falha.error || 'Falha ao comunicar com o validador de IA.');
      }
      const validacao = await resIA.json();

      if (!validacao.valido) {
        setErro(`Frame reprovado pela IA: ${validacao.motivo || 'A imagem não mostra um descarte.'}`);
        setCarregando(false);
        return;
      }

      setStatusMsg('Descarte validado! Creditando pontos...');
      const resBanco = await fetch(`${API_BASE_URL}/residuos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoria: resultadoIA.categoria, tipo_reciclagem: resultadoIA.item, quantidade: '1 un', localizacao, usuario_id: usuarioId }),
      });

      if (!resBanco.ok) throw new Error('Erro ao registrar no banco de dados.');
      alert('Descarte auditado e aprovado com sucesso! +5 Pontos adicionados.');
      navigate('/home');
    } catch (error) {
      console.error(error);
      setErro(error.message || 'Erro durante a validação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className='proof-page'>
      <div className='proof-shell'>
        <header className='scanner-topbar'>
          <button className='scanner-back-button' onClick={() => navigate('/scanner')} aria-label='Voltar para o scanner'><ArrowLeft size={18} /></button>
          <div><span className='home-eyebrow'>NOVO DESCARTE</span><h1>Comprovar descarte</h1></div>
          <span className='scanner-step'>2/2</span>
        </header>

        <section className='proof-content'>
          <div className='proof-intro'><ShieldCheck size={18} /><div><strong>Última etapa</strong><p>Mostre onde o material foi descartado para receber seus pontos.</p></div></div>

          <div className='proof-item-card'><div><span className='home-eyebrow'>ITEM IDENTIFICADO</span><strong>{resultadoIA.item}</strong></div><span>{resultadoIA.categoria}</span></div>

          <CameraCapture
            onCapture={handleFrameCapturado}
            title='Mostre onde o item foi descartado'
            actionLabel='Capturar frame de comprovação'
            hasCapture={Boolean(cameraFrame)}
          />

          <label className='proof-location'><span><MapPin size={14} /> Local do descarte</span><input type='text' value={localizacao} onChange={(event) => setLocalizacao(event.target.value)} /></label>

          {erro && <div className='scanner-error'>{erro}</div>}
          {carregando && <div className='proof-status'><Sparkles size={15} /><span>{statusMsg}</span></div>}

          <button className='auth-button auth-button-primary proof-submit' onClick={handleConfirmarDescarte} disabled={carregando}>
            {carregando ? 'Auditando com IA...' : <><Check size={16} /> Confirmar e ganhar +{resultadoIA.pontosSugeridos || 5} pontos</>}
          </button>
        </section>
      </div>
    </main>
  );
}
