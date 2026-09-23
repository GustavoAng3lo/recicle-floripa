import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Camera, History, MapPin, Settings, Trash2, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoRecicle from '../assets/png.png';
import { getResidueVisual, normalizeResidueText } from '../utils/residueVisual';

export default function Home() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: 'Usuário', pontos: 0 });
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const usuarioId = localStorage.getItem('usuario_id') || 1;

  const carregarDados = useCallback(async () => {
    try {
      const resUser = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
      if (resUser.ok) setUsuario(await resUser.json());

      const resHist = await fetch(`http://localhost:3000/residuos/${usuarioId}`);
      if (resHist.ok) setHistorico(await resHist.json());
    } catch (error) {
      console.error('Erro ao carregar dados da Home:', error);
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    const timeoutId = setTimeout(carregarDados, 0);
    return () => clearTimeout(timeoutId);
  }, [carregarDados]);

  const handleExcluirColeta = async (id) => {
    if (!window.confirm('Deseja realmente excluir este registro? (-5 pontos)')) return;

    try {
      const response = await fetch(`http://localhost:3000/residuos/${id}`, { method: 'DELETE' });
      if (response.ok) carregarDados();
    } catch (error) {
      console.error('Erro ao excluir coleta:', error);
    }
  };

  return (
    <main className='home-page'>
      <div className='home-shell'>
        <header className='home-header'>
          <div className='home-header-row'>
            <div className='home-brand'>
              <div className='auth-logo-mark'><img src={logoRecicle} alt='' /></div>
              <span>Recicle Floripa</span>
            </div>
            <button className='home-icon-button' onClick={() => navigate('/configuracoes')} aria-label='Configurações'>
              <Settings size={17} />
            </button>
          </div>

          <div className='home-greeting'>
            <div>
              <span className='home-eyebrow'>BEM-VINDO DE VOLTA</span>
              <h1>Olá, {usuario.nome?.split(' ')[0] || 'Usuário'}!</h1>
              <p>Pronto para fazer a diferença hoje?</p>
            </div>
            <div className='home-avatar'><UserRound size={24} /></div>
          </div>
        </header>

        <section className='home-content'>
          <div className='points-card'>
            <div>
              <span className='home-eyebrow'>SEUS PONTOS TOTAIS</span>
              <strong>{usuario.pontos || 0}</strong>
              <span className='points-label'>Pontos</span>
              <div className='points-progress'><span style={{ width: `${Math.min(((usuario.pontos || 0) / 100) * 100, 100)}%` }} /></div>
              <span className='points-progress-label'>{Math.min(usuario.pontos || 0, 100)}/100 pontos</span>
            </div>
            <span className='points-streak'>🔥 4 Dias</span>
          </div>

          <button className='home-primary-action' onClick={() => navigate('/scanner')}>
            <span className='action-icon'><Camera size={18} /></span>
            <span><strong>Registrar descarte (+5 pts)</strong></span>
            <ArrowRight size={17} />
          </button>

          <section className='home-section home-history'>
            <div className='home-section-heading'>
              <div><h2>Últimos Descartes</h2></div>
              <button className='home-link-button' onClick={() => navigate('/historico')}>Ver todos</button>
            </div>
            {carregando ? <div className='home-empty-state'>Carregando coletas...</div> : historico.length === 0 ? (
              <div className='home-empty-state'>Nenhuma coleta registrada ainda.<br />Escaneie um resíduo para começar!</div>
            ) : (
              <div className='history-list'>
                {historico.slice(0, 2).map((item) => (
                  <article className='history-item' key={item.id}>
                    <span className={`history-icon ${getResidueVisual(item.categoria).className}`}><Trash2 size={17} /></span>
                    <span className='history-copy'><strong>{normalizeResidueText(item.tipo_reciclagem || item.categoria)}</strong><small>{normalizeResidueText(item.localizacao)}</small></span>
                    <span className='history-meta'><b>+5 pts</b><small>{new Date(item.data_descarte).toLocaleDateString('pt-BR')}</small></span>
                    <span className={`residue-badge ${getResidueVisual(item.categoria).className}`}>{getResidueVisual(item.categoria).label}</span>
                    <button className='history-delete' onClick={() => handleExcluirColeta(item.id)} aria-label='Excluir coleta'><Trash2 size={14} /></button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <nav className='home-bottom-nav' aria-label='Navegação principal'>
          <button className='is-active' onClick={() => navigate('/home')}><History size={17} /><span>Início</span></button>
          <button onClick={() => navigate('/pontos')}><MapPin size={17} /><span>Pontos</span></button>
          <button className='home-nav-main' onClick={() => navigate('/scanner')}><span>+</span></button>
          <button className='home-nav-history' onClick={() => navigate('/historico')}><History size={17} /><span>Histórico</span></button>
          <button onClick={() => navigate('/perfil')}><UserRound size={17} /><span>Perfil</span></button>
        </nav>
      </div>
    </main>
  );
}
