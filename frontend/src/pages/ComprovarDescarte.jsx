import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ComprovarDescarte() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const resultadoIA = location.state?.resultado || {
    item: 'Garrafa de vidro transparente',
    categoria: 'Vidro',
    pontosSugeridos: 5
  };

  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [localizacao, setLocalizacao] = useState('Centro - Florianópolis');
  const [carregando, setCarregando] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [erro, setErro] = useState('');

  const fileInputRef = useRef(null);
  const usuarioId = localStorage.getItem('usuario_id') || 1;

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setImagemPreview(URL.createObjectURL(file));
      setErro('');
    }
  };

  const handleConfirmarDescarte = async () => {
    if (!imagem) {
      setErro('Por favor, selecione ou tire uma foto comprovando o descarte.');
      return;
    }

    setCarregando(true);
    setErro('');
    setStatusMsg('🤖 A IA está auditando a foto do descarte...');

    try {
      // 1. Enviar para a rota de auditoria anti-fraude
      const formData = new FormData();
      formData.append('imagem', imagem);
      formData.append('categoria', resultadoIA.categoria);
      formData.append('item', resultadoIA.item);

      const resIA = await fetch('http://localhost:3000/ia/validar-descarte', {
        method: 'POST',
        body: formData,
      });

      if (!resIA.ok) {
        throw new Error('Falha ao comunicar com o validador de IA.');
      }

      const validacao = await resIA.json();

      // Se a IA recusou a foto
      if (!validacao.valido) {
        setErro(`❌ Foto reprovada pela IA: ${validacao.motivo || 'A imagem não mostra uma lixeira, ecoponto ou ato de descarte.'}`);
        setCarregando(false);
        return;
      }

      // 2. Se a IA aprovou, grava no banco e soma pontos
      setStatusMsg('✅ Descarte validado! Creditando pontos...');

      const resBanco = await fetch('http://localhost:3000/residuos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria: resultadoIA.categoria,
          tipo_reciclagem: resultadoIA.item,
          quantidade: '1 un',
          localizacao: localizacao,
          usuario_id: usuarioId
        })
      });

      if (resBanco.ok) {
        alert('🎉 Descarte auditado e aprovado com sucesso! +5 Pontos adicionados.');
        navigate('/home');
      } else {
        throw new Error('Erro ao registrar no banco de dados.');
      }

    } catch (err) {
      console.error(err);
      setErro(err.message || 'Erro durante a validação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg">
        
        <button
          onClick={() => navigate('/scanner')}
          className="text-[#0e9f45] hover:text-[#0b8037] font-semibold mb-4 flex items-center gap-1 cursor-pointer text-sm"
        >
          ← Voltar ao Scanner
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            Comprovar Descarte ♻️
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Tire uma foto do material na lixeira ou ecoponto para a IA auditar e liberar seus <span className="font-bold text-[#0e9f45]">+5 Pontos</span>.
          </p>
        </div>

        {/* Resumo do Item */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              ITEM IDENTIFICADO
            </span>
            <span className="text-sm font-bold text-gray-800">
              {resultadoIA.item}
            </span>
          </div>
          <span className="text-xs bg-[#0e9f45] text-white px-3 py-1 rounded-full font-bold">
            {resultadoIA.categoria}
          </span>
        </div>

        {/* Upload da Imagem */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all bg-white overflow-hidden mb-4 ${
            imagemPreview ? 'border-emerald-500' : 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImagemChange}
          />

          {imagemPreview ? (
            <img
              src={imagemPreview}
              alt="Foto do descarte"
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0e9f45] mx-auto flex items-center justify-center text-2xl">
                📷
              </div>
              <h4 className="font-bold text-gray-800 text-sm">
                Fotografar descarte na lixeira
              </h4>
              <p className="text-[11px] text-gray-400">
                Clique aqui para abrir a câmera ou galeria
              </p>
            </div>
          )}
        </div>

        {/* Campo de Localização */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Local / Ponto de Coleta:
          </label>
          <input
            type="text"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0e9f45]"
          />
        </div>

        {/* Mensagens de Feedback */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-4 font-medium text-center">
            {erro}
          </div>
        )}

        {carregando && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs mb-4 font-medium text-center animate-pulse">
            {statusMsg}
          </div>
        )}

        {/* Botão de Validação */}
        <button
          onClick={handleConfirmarDescarte}
          disabled={carregando}
          className={`w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            carregando
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#0e9f45] hover:bg-[#0b8037] active:scale-[0.99]'
          }`}
        >
          {carregando ? (
            'Auditando com IA...'
          ) : (
            <>
              <span>✓</span> Confirmar e Resgatar +5 Pontos
            </>
          )}
        </button>

      </div>
    </div>
  );
}