import { useEffect, useState } from 'react';
import { AlertCircle, Award, BarChart3, Calendar, CheckCircle, ChevronRight, Lock, LogOut, ShieldCheck, User, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function Configuracoes() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuarioNome') || 'Usuário');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [pontos, setPontos] = useState(0);
  const [historicoColetas, setHistoricoColetas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [feedback, setFeedback] = useState({ msg: '', tipo: '' });
  const [modalAtivo, setModalAtivo] = useState(null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [feedbackSenha, setFeedbackSenha] = useState({ msg: '', tipo: '' });

  let userId = localStorage.getItem('usuario_id');
  const loginDataRaw = localStorage.getItem('loginData');
  let loginData = null;
  if (loginDataRaw) {
    try {
      loginData = JSON.parse(loginDataRaw);
      if (!userId) userId = loginData?.user?.id || loginData?.id;
    } catch (error) {
      console.error('Erro ao ler loginData', error);
    }
  }
  const finalUserId = userId || 1;

  useEffect(() => {
    axios.get(`http://localhost:3000/usuarios/${finalUserId}`).then((response) => {
      setPontos(response.data.pontos || 0);
      if (response.data.nome) setNomeUsuario(response.data.nome);
      if (response.data.email) setEmail(response.data.email);
      if (response.data.cpf) setCpf(response.data.cpf);
    }).catch((error) => console.error('Erro ao buscar perfil:', error));
    axios.get(`http://localhost:3000/residuos/${finalUserId}`).then((response) => setHistoricoColetas(response.data || [])).catch((error) => console.error('Erro ao buscar histórico:', error));
  }, [finalUserId]);

  const handleSalvar = async (event) => {
    event.preventDefault();
    if (!nomeUsuario.trim()) {
      setFeedback({ msg: 'O nome não pode ficar em branco.', tipo: 'erro' });
      return;
    }
    setCarregando(true);
    setFeedback({ msg: '', tipo: '' });
    try {
      await axios.put(`http://localhost:3000/usuarios/${finalUserId}`, { nome: nomeUsuario.trim(), email, cpf });
      localStorage.setItem('usuarioNome', nomeUsuario.trim());
      if (loginData?.user) {
        const updatedLoginData = {
          ...loginData,
          user: { ...loginData.user, nome: nomeUsuario.trim(), email },
        };
        localStorage.setItem('loginData', JSON.stringify(updatedLoginData));
      }
      setFeedback({ msg: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setFeedback({ msg: error.response?.data?.error || 'Falha ao atualizar dados no servidor.', tipo: 'erro' });
    } finally {
      setCarregando(false);
      setTimeout(() => setFeedback({ msg: '', tipo: '' }), 4000);
    }
  };

  const handleAlterarSenha = async (event) => {
    event.preventDefault();
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,8}$/;
    if (!senhaAtual) {
      setFeedbackSenha({ msg: 'Informe sua senha atual para autorizar a alteração.', tipo: 'erro' });
      return;
    }
    if (!regexSenha.test(novaSenha)) {
      setFeedbackSenha({ msg: 'A nova senha deve ter entre 6 e 8 caracteres, com maiúsculo, minúsculo e caractere especial.', tipo: 'erro' });
      return;
    }
    setSalvandoSenha(true);
    setFeedbackSenha({ msg: '', tipo: '' });
    try {
      const response = await axios.put(`http://localhost:3000/usuarios/${finalUserId}/senha`, { senhaAtual, novaSenha });
      setFeedbackSenha({ msg: response.data.message || 'Senha atualizada com sucesso!', tipo: 'sucesso' });
      setSenhaAtual('');
      setNovaSenha('');
      setTimeout(() => { setModalAtivo(null); setFeedbackSenha({ msg: '', tipo: '' }); }, 2000);
    } catch (error) {
      console.error('Erro ao trocar senha:', error.response?.data);
      setFeedbackSenha({ msg: error.response?.data?.error || 'Erro ao conectar ao servidor.', tipo: 'erro' });
    } finally {
      setSalvandoSenha(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm('Tem certeza de que deseja sair da sua conta?')) return;
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('loginData');
    navigate('/login');
  };

  const anoAtual = new Date().getFullYear();
  const dadosMensais = MESES.map((mes, index) => {
    const totalItens = historicoColetas.filter((item) => {
      if (!item.data_descarte) return false;
      const data = new Date(item.data_descarte);
      return data.getMonth() === index && data.getFullYear() === anoAtual;
    }).length;
    return { mes, totalItens, pontosGanhos: totalItens * 5, co2EstimadoKg: (totalItens * 0.45).toFixed(2) };
  });
  const totalColetasAno = historicoColetas.length;
  const totalPontosAno = totalColetasAno * 5;
  const totalCo2Ano = (totalColetasAno * 0.45).toFixed(2);
  const nivelEco = pontos >= 50 ? 'Guardião da Ilha' : pontos >= 20 ? 'Reciclador Ativo' : 'Iniciante Consciente';

  const abrirModal = (modal) => {
    setModalAtivo(modal);
    if (modal === 'seguranca') {
      setFeedbackSenha({ msg: '', tipo: '' });
      setSenhaAtual('');
      setNovaSenha('');
    }
  };

  return (
    <main className='settings-page'>
      <div className='settings-shell'>
        <header className='settings-topbar'><button className='scanner-back-button' onClick={() => navigate('/home')} aria-label='Voltar para o início'>‹</button><div><span className='home-eyebrow'>MINHA CONTA</span><h1>Configurações</h1></div><User size={18} color='#28a95b' /></header>
        <section className='settings-content'>
          <div className='settings-profile'><div className='settings-avatar'><User size={26} /></div><div><span className='home-eyebrow'>ECO-CIDADÃO</span><h2>{nomeUsuario}</h2><p>{nivelEco} • {pontos} pontos</p></div><Award size={20} color='#e1a93b' /></div>
          {feedback.msg && <div className={`settings-feedback ${feedback.tipo === 'sucesso' ? 'is-success' : 'is-error'}`}>{feedback.tipo === 'sucesso' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}{feedback.msg}</div>}

          <form className='settings-form' onSubmit={handleSalvar}>
            <label><span>Nome completo</span><input type='text' value={nomeUsuario} onChange={(event) => setNomeUsuario(event.target.value)} required /></label>
            <label><span>E-mail de acesso</span><input type='email' value={email} disabled /><small>O e-mail é a chave de login e não pode ser alterado.</small></label>
            <label><span>CPF</span><input type='text' value={cpf || 'Não informado'} disabled /></label>
            <button className='auth-button auth-button-primary' type='submit' disabled={carregando}>{carregando ? 'Salvando...' : 'Salvar alterações'}</button>
          </form>

          <div className='settings-tools'><span className='home-eyebrow'>RECURSOS DA CONTA</span>
            <button className='settings-tool' onClick={() => abrirModal('perfil')}><span className='settings-tool-icon'><User size={17} /></span><span><strong>Perfil de Eco-Cidadão</strong><small>Veja sua classificação e impacto ambiental.</small></span><ChevronRight size={16} /></button>
            <button className='settings-tool' onClick={() => abrirModal('tabelaMensal')}><span className='settings-tool-icon'><BarChart3 size={17} /></span><span><strong>Relatório de reciclagem</strong><small>Confira seus descartes e pontos por mês.</small></span><ChevronRight size={16} /></button>
            <button className='settings-tool' onClick={() => abrirModal('seguranca')}><span className='settings-tool-icon'><ShieldCheck size={17} /></span><span><strong>Login e segurança</strong><small>Altere sua senha com segurança.</small></span><ChevronRight size={16} /></button>
          </div>

          <div className='settings-logout'><div><strong>Encerrar sessão</strong><small>Desconectar sua conta com segurança.</small></div><button onClick={handleLogout}><LogOut size={14} /> Sair</button></div>
        </section>
      </div>

      {modalAtivo && <div className='settings-modal-backdrop' onClick={() => setModalAtivo(null)}><section className={`settings-modal ${modalAtivo === 'tabelaMensal' ? 'is-report' : ''}`} onClick={(event) => event.stopPropagation()}>
        <header><h2>{modalAtivo === 'perfil' && <><Award size={19} /> Perfil Eco-Cidadão</>}{modalAtivo === 'tabelaMensal' && <><Calendar size={19} /> Balanço anual ({anoAtual})</>}{modalAtivo === 'seguranca' && <><Lock size={19} /> Alterar senha</>}</h2><button onClick={() => setModalAtivo(null)} aria-label='Fechar'><X size={18} /></button></header>

        {modalAtivo === 'perfil' && <><div className='eco-level'><span>SUA CLASSIFICAÇÃO</span><strong>{nivelEco}</strong><small>{pontos} pontos acumulados em Floripa</small></div><div className='eco-stats'><div><span>Descartes feitos</span><strong>{totalColetasAno}</strong></div><div><span>CO₂ evitado</span><strong>~{totalCo2Ano} kg</strong></div></div><button className='auth-button auth-button-primary' onClick={() => setModalAtivo(null)}>Fechar detalhes</button></>}

        {modalAtivo === 'tabelaMensal' && <><div className='report-summary'><div><span>Total coletado</span><strong>{totalColetasAno}</strong></div><div><span>Pontos do ano</span><strong>+{totalPontosAno}</strong></div><div><span>CO₂ evitado</span><strong>~{totalCo2Ano} kg</strong></div></div><div className='report-table-wrap'><table><thead><tr><th>Mês</th><th>Descartes</th><th>Pontos</th><th>CO₂</th></tr></thead><tbody>{dadosMensais.map((dado) => <tr key={dado.mes}><td>{dado.mes}</td><td>{dado.totalItens}</td><td>{dado.pontosGanhos ? `+${dado.pontosGanhos}` : '-'}</td><td>{dado.totalItens ? `${dado.co2EstimadoKg} kg` : '-'}</td></tr>)}</tbody></table></div><button className='auth-button auth-button-primary' onClick={() => setModalAtivo(null)}>Fechar relatório</button></>}

        {modalAtivo === 'seguranca' && <form className='security-form' onSubmit={handleAlterarSenha}>{feedbackSenha.msg && <div className={`settings-feedback ${feedbackSenha.tipo === 'sucesso' ? 'is-success' : 'is-error'}`}>{feedbackSenha.msg}</div>}<label><span>Senha atual</span><input type='password' value={senhaAtual} onChange={(event) => setSenhaAtual(event.target.value)} placeholder='Digite sua senha atual' required /></label><label><span>Nova senha</span><input type='password' value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} placeholder='Ex: Floripa@2026' required /><small>6 a 8 caracteres, com maiúscula, minúscula e caractere especial.</small></label><div className='security-actions'><button type='button' onClick={() => setModalAtivo(null)}>Cancelar</button><button className='auth-button-primary' type='submit' disabled={salvandoSenha}>{salvandoSenha ? 'Validando...' : 'Confirmar troca'}</button></div></form>}
      </section></div>}
    </main>
  );
}
