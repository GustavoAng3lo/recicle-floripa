import { useCallback, useEffect, useState } from 'react';
import { Crown, LogOut, Medal, Settings, Ship, TreePine, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: localStorage.getItem('usuarioNome') || 'Usuário', email: '', cpf: '', pontos: 0 });
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const usuarioId = localStorage.getItem('usuario_id') || 1;

  const carregarPerfil = useCallback(async () => {
    try {
      const [perfilResponse, historicoResponse] = await Promise.all([
        fetch(`http://localhost:3000/usuarios/${usuarioId}`),
        fetch(`http://localhost:3000/residuos/${usuarioId}`),
      ]);
      if (perfilResponse.ok) {
        const perfil = await perfilResponse.json();
        setUsuario((atual) => ({ ...atual, ...perfil }));
      }
      if (historicoResponse.ok) setHistorico(await historicoResponse.json());
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    const timeoutId = setTimeout(carregarPerfil, 0);
    return () => clearTimeout(timeoutId);
  }, [carregarPerfil]);

  const sair = () => {
    if (!window.confirm('Tem certeza de que deseja sair da sua conta?')) return;
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('loginData');
    navigate('/login');
  };

  return (
    <main className='profile-page'>
      <div className='profile-shell'>
        <section className='profile-content'>
          <div className='profile-hero'><button className='profile-settings-button' onClick={() => navigate('/configuracoes')} aria-label='Abrir configurações'><Settings size={18} /></button><div className='profile-avatar'><UserRound size={30} /></div><h2>{carregando ? 'Carregando...' : usuario.nome}</h2><p>@{(usuario.nome || 'usuario').toLowerCase().replace(/\s+/g, '_')}</p></div>
          <div className='profile-stats'><div><strong>{usuario.pontos || 0}</strong><span>Pontos Totais</span></div><div><strong>{historico.length}</strong><span>Coletas Realizadas</span></div><div><strong>🏆 1º</strong><span>Ranking Bairro</span></div></div>
          <section className='profile-section'><div className='profile-section-heading'><h2>Minhas Conquistas (Ilha Eco)</h2></div><div className='profile-badges'><span className='profile-badge badge-campeche'><TreePine size={22} /><small>Defensora<br />Campeche</small></span><span className='profile-badge badge-navegante'><Ship size={22} /><small>Eco<br />Navegante</small></span><span className='profile-badge badge-metal'><Crown size={22} /><small>Rainha do<br />Metal</small></span><span className='profile-badge badge-plastico'><Medal size={22} /><small>Ilha Sem<br />Plástico</small></span></div></section>
          <section className='profile-system-settings'><span className='home-eyebrow'>SISTEMA</span><button onClick={() => navigate('/configuracoes')}><span><Settings size={16} /><strong>Configurações do sistema</strong><small>Dados pessoais, segurança e preferências</small></span><span>›</span></button></section>
          <button className='profile-logout' onClick={sair}><LogOut size={15} /><span>Sair da Conta</span><span>›</span></button>
        </section>
        <nav className='home-bottom-nav' aria-label='Navegação principal'><button onClick={() => navigate('/home')}><span>⌂</span><span>Início</span></button><button onClick={() => navigate('/scanner')}><span>◉</span><span>Registrar</span></button><button className='home-nav-main' onClick={() => navigate('/scanner')}><span>+</span></button><button onClick={() => navigate('/historico')}><span>◷</span><span>Histórico</span></button><button className='is-active' onClick={() => navigate('/perfil')}><span>♙</span><span>Perfil</span></button></nav>
      </div>
    </main>
  );
}
