import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const coresLixeira = {
  Plástico: { bg: '#e53935', border: '#b71c1c', texto: '#fff', tag: 'Lixeira vermelha • Plástico' },
  Papel: { bg: '#1e88e5', border: '#0d47a1', texto: '#fff', tag: 'Lixeira azul • Papel' },
  Vidro: { bg: '#43a047', border: '#1b5e20', texto: '#fff', tag: 'Lixeira verde • Vidro' },
  Metal: { bg: '#fbc02d', border: '#f57f17', texto: '#212121', tag: 'Lixeira amarela • Metal' },
  Orgânico: { bg: '#8d6e63', border: '#4e342e', texto: '#fff', tag: 'Lixeira marrom • Orgânico' },
  'Não Reciclável / Rejeito': { bg: '#616161', border: '#212121', texto: '#fff', tag: 'Lixeira cinza • Rejeito' },
  Eletrônico: { bg: '#ff9800', border: '#e65100', texto: '#fff', tag: 'Ponto especial • Eletrônico' },
};

const prepararImagemParaIA = (arquivo) => new Promise((resolve, reject) => {
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
        reject(new Error('Não foi possível preparar a imagem.'));
        return;
      }
      resolve(new File([blob], 'residuo.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.82);
  };
  imagem.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('Não foi possível ler a imagem.'));
  };
  imagem.src = url;
});

export default function Scanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [materialDigitado, setMaterialDigitado] = useState('');

  const lidarComArquivo = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setArquivoImagem(file);
    setImagemPreview(URL.createObjectURL(file));
    setMaterialDigitado(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    setResultado(null);
    setErro('');
  };

  const analisarImagemComIA = async () => {
    if (!arquivoImagem) {
      if (materialDigitado.trim()) {
        navigate('/coleta', { state: { descricao: materialDigitado.trim() } });
        return;
      }
      setErro('Digite o material ou adicione uma foto primeiro.');
      return;
    }

    setCarregando(true);
    setErro('');
    const formData = new FormData();

    try {
      const imagemOtimizada = await prepararImagemParaIA(arquivoImagem);
      formData.append('imagem', imagemOtimizada);
      const response = await fetch('http://localhost:3000/ia/analisar', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Falha ao analisar a imagem.');
      setResultado(await response.json());
    } catch (error) {
      console.error(error);
      setErro('Erro ao processar imagem. Verifique a conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
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
          <input type='file' accept='image/*' capture='environment' ref={fileInputRef} onChange={lidarComArquivo} hidden />

          <label className='scanner-material-field'>
            <span>O que você descartou?</span>
            <div>
              <input value={materialDigitado} onChange={(event) => setMaterialDigitado(event.target.value)} placeholder='Garrafa de Cerveja de Vidro' />
              <button type='button' onClick={() => fileInputRef.current.click()} aria-label='Adicionar foto do material'><Camera size={15} /></button>
            </div>
          </label>

          <p className='scanner-typing-hint'>Digite o item para registrar manualmente ou use a câmera para identificar com IA.</p>

          {erro && <div className='scanner-error'>{erro}</div>}

          <button className='auth-button auth-button-primary scanner-analyze' onClick={analisarImagemComIA} disabled={carregando || (!arquivoImagem && !materialDigitado.trim())}>
            {carregando ? 'Identificando material...' : arquivoImagem ? 'Identificar via IA' : 'Continuar registro'}
            {!carregando && <Sparkles size={16} />}
          </button>

          {resultado && <article className='scanner-result'>
            <div className='scanner-result-emojis'>♻️ 🎉</div>
            <span className='home-eyebrow'>RESULTADO DA ANÁLISE</span>
            <h2>Material identificado!</h2>
            <strong className='scanner-result-item'>{resultado.item}</strong>
            <span className={`scanner-status ${resultado.reciclavel ? 'is-recyclable' : ''}`}><CheckCircle2 size={13} />{resultado.reciclavel ? resultado.categoria : 'Não reciclável'}</span>
            <div className='scanner-points-award'>+{resultado.pontosSugeridos || 5} PONTOS CONCEDIDOS!</div>
            <div className='scanner-instruction'><strong>Como preparar</strong><p>{resultado.instrucaoPreparo}</p></div>
            <div className='scanner-bin' style={{ background: lixeiraInfo.bg, borderColor: lixeiraInfo.border, color: lixeiraInfo.texto }}>{lixeiraInfo.tag}</div>
            <button className='auth-button auth-button-secondary scanner-confirm' onClick={() => navigate('/comprovar-descarte', { state: { resultado, imagemOriginal: imagemPreview } })}>Vou descartar agora <ArrowRight size={15} /></button>
          </article>}
        </section>
      </div>
    </main>
  );
}
