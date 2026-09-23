import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Filter, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getResidueVisual, normalizeResidueText } from '../utils/residueVisual';

export default function Historico() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [carregando, setCarregando] = useState(true);
  const usuarioId = localStorage.getItem('usuario_id') || 1;

  const carregarHistorico = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/residuos/${usuarioId}`);
      if (response.ok) setHistorico(await response.json());
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    const timeoutId = setTimeout(carregarHistorico, 0);
    return () => clearTimeout(timeoutId);
  }, [carregarHistorico]);

  const excluirColeta = async (id) => {
    if (!window.confirm('Deseja realmente excluir este registro? (-5 pontos)')) return;
    const response = await fetch(`http://localhost:3000/residuos/${id}`, { method: 'DELETE' });
    if (response.ok) carregarHistorico();
  };

  const categorias = ['Todos', 'Vidro', 'Plástico', 'Metal', 'Papel', 'Não reciclável'];
  const registrosFiltrados = filtro === 'Todos' ? historico : historico.filter((item) => {
    const categoria = item.categoria.toLowerCase();
    if (filtro === 'Não reciclável') return categoria.includes('não recicl') || categoria.includes('rejeito');
    return categoria.includes(filtro.toLowerCase());
  });

  return (
    <main className='history-page'>
      <div className='history-shell'>
        <header className='history-topbar'><div><h1>Meu Histórico</h1><p>Seu impacto verde catalogado</p></div><CalendarDays size={18} color='#28a95b' /></header>
        <section className='history-content'>
          <div className='history-filter-heading'><div><span className='home-eyebrow'>ATIVIDADE</span><h2>Seus descartes</h2></div><Filter size={16} color='#5c8b68' /></div>
          <div className='history-filters'>{categorias.map((categoria) => <button className={filtro === categoria ? 'is-active' : ''} key={categoria} onClick={() => setFiltro(categoria)}>{categoria}</button>)}</div>
          {carregando ? <div className='home-empty-state'>Carregando histórico...</div> : registrosFiltrados.length === 0 ? <div className='history-empty-card'><strong>Nenhum descarte encontrado.</strong><small>Registre seu primeiro descarte para começar.</small></div> : <div className='history-page-list'>{registrosFiltrados.map((item) => <article className='history-page-item' key={item.id}><span className={`history-icon ${getResidueVisual(item.categoria).className}`}><Trash2 size={16} /></span><span className='history-copy'><strong>{normalizeResidueText(item.tipo_reciclagem || item.categoria)}</strong><small>{normalizeResidueText(item.localizacao)}</small></span><span className='history-meta'><b>+5 pts</b><small>{new Date(item.data_descarte).toLocaleDateString('pt-BR')}</small></span><span className={`residue-badge ${getResidueVisual(item.categoria).className}`}>{getResidueVisual(item.categoria).label}</span><button className='history-delete' onClick={() => excluirColeta(item.id)} aria-label='Excluir descarte'><Trash2 size={14} /></button></article>)}</div>}
        </section>
        <nav className='home-bottom-nav' aria-label='Navegação principal'><button onClick={() => navigate('/home')}><span>⌂</span><span>Início</span></button><button onClick={() => navigate('/scanner')}><span>◉</span><span>Registrar</span></button><button className='home-nav-main' onClick={() => navigate('/scanner')}><span>+</span></button><button className='is-active' onClick={() => navigate('/historico')}><span>◷</span><span>Histórico</span></button><button onClick={() => navigate('/perfil')}><span>♙</span><span>Perfil</span></button></nav>
      </div>
    </main>
  );
}
