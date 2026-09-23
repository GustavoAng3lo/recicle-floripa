import { useRef, useState } from 'react';
import { ArrowLeft, Camera, Check, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const prepararImagemParaAuditoria = (arquivo) => new Promise((resolve, reject) => {
  const imagem = new Image();
  const url = URL.createObjectURL(arquivo);

  imagem.onload = () => {
    const limite = 1280;
    const escala = Math.min(1, limite / Math.max(imagem.naturalWidth, imagem.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(imagem.naturalWidth * escala);
    canvas.height = Math.round(imagem.naturalHeight * escala);
    canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(url);
      if (!blob) {
        reject(new Error('Não foi possível preparar a foto.'));
        return;
      }
      resolve(new File([blob], 'comprovacao.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.82);
  };
  imagem.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('Não foi possível ler a foto.'));
  };
  imagem.src = url;
});

export default function ComprovarDescarte() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultadoIA = location.state?.resultado || { item: 'Garrafa de vidro transparente', categoria: 'Vidro', pontosSugeridos: 5 };
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [localizacao, setLocalizacao] = useState('Centro - Florianópolis');
  const [carregando, setCarregando] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [erro, setErro] = useState('');
  const fileInputRef = useRef(null);
  const usuarioId = localStorage.getItem('usuario_id') || 1;

  const handleImagemChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImagem(file);
    setImagemPreview(URL.createObjectURL(file));
    setErro('');
  };

  const handleConfirmarDescarte = async () => {
    if (!imagem) {
      setErro('Selecione ou tire uma foto comprovando o descarte.');
      return;
    }

    setCarregando(true);
    setErro('');
    setStatusMsg('A IA está auditando a foto do descarte...');

    try {
      const imagemOtimizada = await prepararImagemParaAuditoria(imagem);
      const formData = new FormData();
      formData.append('imagem', imagemOtimizada);
      formData.append('categoria', resultadoIA.categoria);
      formData.append('item', resultadoIA.item);
      const resIA = await fetch('http://localhost:3000/ia/validar-descarte', { method: 'POST', body: formData });
      if (!resIA.ok) throw new Error('Falha ao comunicar com o validador de IA.');
      const validacao = await resIA.json();

      if (!validacao.valido) {
        setErro(`Foto reprovada pela IA: ${validacao.motivo || 'A imagem não mostra um descarte.'}`);
        setCarregando(false);
        return;
      }

      setStatusMsg('Descarte validado! Creditando pontos...');
      const resBanco = await fetch('http://localhost:3000/residuos', {
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

          <button className={`proof-upload ${imagemPreview ? 'has-preview' : ''}`} onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type='file' accept='image/*' capture='environment' hidden onChange={handleImagemChange} />
            {imagemPreview ? <img src={imagemPreview} alt='Foto do descarte' /> : <><span className='scanner-upload-icon'><Camera size={25} /></span><strong>Fotografe o descarte</strong><small>Mostre a lixeira, ecoponto ou local correto</small></>}
          </button>

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
