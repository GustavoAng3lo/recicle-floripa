import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, MapPin, Search, Trash2 } from 'lucide-react';

const Coleta = () => {
  const location = useLocation();
  const [descricao, setDescricao] = useState(location.state?.descricao || '');
  const [tipoReciclagem, setTipoReciclagem] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [localizacao, setLocalizacao] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const identificarMaterial = () => {
      const p = descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!p) {
        setTipoReciclagem('');
        return;
      }

      // LÓGICA DE RECONHECIMENTO AMPLIADA
      if (p.includes('pet') || p.includes('plastico') || p.includes('sacola') || p.includes('embalagem') || p.includes('tampa')) {
        setTipoReciclagem('Plástico');
      } 
      else if (p.includes('lata') || p.includes('latinha') || p.includes('aluminio') || p.includes('ferro') || p.includes('metal') || p.includes('prego')) {
        setTipoReciclagem('Metal');
      } 
      else if (p.includes('papel') || p.includes('papelao') || p.includes('revista') || p.includes('folha') || p.includes('caderno') || p.includes('jornal')) {
        setTipoReciclagem('Papel');
      } 
      else if (p.includes('celular') || p.includes('bateria') || p.includes('pilha') || p.includes('fio') || p.includes('carregador') || p.includes('placa')) {
        setTipoReciclagem('Eletrônico');
      } 
      else if (p.includes('garrafa') || p.includes('pote') || p.includes('copo de vidro') || p.includes('vidro') || p.includes('frasco')) {
        setTipoReciclagem('Vidro');
      } 
      else {
        setTipoReciclagem('Não Reciclável / Rejeito');
      }
    };
    identificarMaterial();
  }, [descricao]);

  const handleSalvarColeta = async () => {
    try {
      const usuario_id = localStorage.getItem('usuario_id');
      await axios.post('http://localhost:3000/residuos', {
        categoria: tipoReciclagem,
        tipo_reciclagem: descricao,
        quantidade: Number(quantidade),
        localizacao,
        usuario_id: Number(usuario_id)
      });
      alert('Coleta Registrada com Sucesso!');
      navigate('/home');
    } catch {
      alert('Erro ao salvar no banco de dados.');
    }
  };

  return (
    <main className='manual-collection-page'>
      <div className='manual-collection-shell'>
      <header className='scanner-topbar'>
        <button className='scanner-back-button' onClick={() => navigate('/scanner')} aria-label='Voltar para o scanner'><ArrowLeft size={18} /></button>
        <div><h1>Registrar descarte</h1><p>Preencha os dados do material</p></div>
        <span className='scanner-step'>2/2</span>
      </header>

      <section className='manual-collection-content'>
        <label className='manual-collection-field'>
          <span>O que você está descartando?</span>
          <div><Search size={15} /><input
              placeholder='Ex: folha de papel, copo plástico...'
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
        </label>

        {descricao && (
          <div className='manual-category-result'><span>Categoria identificada</span><strong><CheckCircle2 size={15} />{tipoReciclagem}</strong></div>
        )}

        <label className='manual-collection-field'><span>Quantidade</span><input type='number' min='1' value={quantidade} onChange={(e) => setQuantidade(e.target.value)} /></label>

        <label className='manual-collection-field'><span>Localização</span><div><MapPin size={15} /><input type='text' placeholder='Ex: Centro - Florianópolis' value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} /></div></label>

        <button className='auth-button auth-button-primary manual-save-button' onClick={handleSalvarColeta} disabled={!descricao.trim() || !localizacao.trim()}>
          <Trash2 size={16} /> Confirmar descarte (+5 pts)
        </button>
      </section>
      </div>
    </main>
  );
};

export default Coleta;