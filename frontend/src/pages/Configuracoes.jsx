import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  BarChart3, 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  X,
  Award,
  Lock,
  Calendar
} from 'lucide-react';
import axios from 'axios';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Configuracoes() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuarioNome') || 'Usuário');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [pontos, setPontos] = useState(0);
  const [historicoColetas, setHistoricoColetas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [feedback, setFeedback] = useState({ msg: '', tipo: '' });

  // Controle de Modais
  const [modalAtivo, setModalAtivo] = useState(null); // 'perfil', 'tabelaMensal', 'seguranca'
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [feedbackSenha, setFeedbackSenha] = useState({ msg: '', tipo: '' });

  // Resgate seguro do ID do usuário logado
  let userId = localStorage.getItem('usuario_id');
  const loginDataRaw = localStorage.getItem('loginData');
  let loginData = null;

  if (loginDataRaw) {
    try {
      loginData = JSON.parse(loginDataRaw);
      if (!userId) userId = loginData?.user?.id || loginData?.id;
    } catch (e) {
      console.error('Erro ao ler loginData', e);
    }
  }

  // Fallback de segurança para ID 1 caso não ache no storage em desenvolvimento
  const finalUserId = userId || 1;

  useEffect(() => {
    if (!finalUserId) return;

    // Buscar dados cadastrais
    axios.get(`http://localhost:3000/usuarios/${finalUserId}`)
      .then((res) => {
        setPontos(res.data.pontos || 0);
        if (res.data.nome) setNomeUsuario(res.data.nome);
        if (res.data.email) setEmail(res.data.email);
        if (res.data.cpf) setCpf(res.data.cpf);
      })
      .catch((err) => console.error('Erro ao buscar perfil:', err));

    // Buscar histórico de coletas para a tabela mensal e cálculo anual
    axios.get(`http://localhost:3000/residuos/${finalUserId}`)
      .then((res) => {
        setHistoricoColetas(res.data || []);
      })
      .catch((err) => console.error('Erro ao buscar histórico de coletas:', err));
  }, [finalUserId]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!finalUserId) return;

    if (!nomeUsuario.trim()) {
      setFeedback({ msg: 'O nome não pode ficar em branco.', tipo: 'erro' });
      return;
    }

    setCarregando(true);
    setFeedback({ msg: '', tipo: '' });

    try {
      await axios.put(`http://localhost:3000/usuarios/${finalUserId}`, {
        nome: nomeUsuario.trim(),
        email: email,
        cpf: cpf
      });

      localStorage.setItem('usuarioNome', nomeUsuario.trim());
      if (loginData && loginData.user) {
        loginData.user.nome = nomeUsuario.trim();
        loginData.user.email = email;
        localStorage.setItem('loginData', JSON.stringify(loginData));
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

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,8}$/;

    if (!senhaAtual) {
      setFeedbackSenha({
        msg: 'Informe sua senha atual para autorizar a alteração.',
        tipo: 'erro'
      });
      return;
    }

    if (!regexSenha.test(novaSenha)) {
      setFeedbackSenha({
        msg: 'A nova senha deve ter entre 6 e 8 caracteres, com maiúsculo, minúsculo e caractere especial (!@#$%).',
        tipo: 'erro'
      });
      return;
    }

    setSalvandoSenha(true);
    setFeedbackSenha({ msg: '', tipo: '' });

    try {
      const res = await axios.put(`http://localhost:3000/usuarios/${finalUserId}/senha`, {
        senhaAtual,
        novaSenha
      });

      setFeedbackSenha({ 
        msg: `✅ ${res.data.message || 'Senha atualizada com sucesso!'}`, 
        tipo: 'sucesso' 
      });
      setSenhaAtual('');
      setNovaSenha('');
      
      setTimeout(() => {
        setModalAtivo(null);
        setFeedbackSenha({ msg: '', tipo: '' });
      }, 2000);
    } catch (err) {
      console.error('Erro ao trocar senha:', err.response?.data);
      setFeedbackSenha({
        msg: err.response?.data?.error || 'Erro ao conectar ao servidor. Verifique se o backend está ligado.',
        tipo: 'erro'
      });
    } finally {
      setSalvandoSenha(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza de que deseja sair da sua conta?')) {
      localStorage.removeItem('usuario_id');
      localStorage.removeItem('usuarioNome');
      localStorage.removeItem('loginData');
      navigate('/login');
    }
  };

  // Processamento e Agregação de Dados da Tabela Mensal / Anual
  const anoAtual = new Date().getFullYear();
  
  const dadosMensais = MESES.map((nomeMes, index) => {
    const coletasDoMes = historicoColetas.filter(item => {
      if (!item.data_descarte) return false;
      const data = new Date(item.data_descarte);
      return data.getMonth() === index && data.getFullYear() === anoAtual;
    });

    const totalItens = coletasDoMes.length;
    const pontosGanhos = totalItens * 5;
    const co2EstimadoKg = (totalItens * 0.45).toFixed(2);

    return {
      mes: nomeMes,
      totalItens,
      pontosGanhos,
      co2EstimadoKg
    };
  });

  const totalColetasAno = historicoColetas.length;
  const totalPontosAno = totalColetasAno * 5;
  const totalCo2Ano = (totalColetasAno * 0.45).toFixed(2);
  const nivelEco = pontos >= 50 ? 'Guardião da Ilha 🏆' : pontos >= 20 ? 'Reciclador Ativo 🌿' : 'Iniciante Consciente 🌱';

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl">
        
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/home')}
          className="text-[#0e9f45] hover:text-[#0b8037] font-semibold mb-5 flex items-center gap-1.5 cursor-pointer text-sm transition"
        >
          <ArrowLeft size={16} /> Voltar para o Início
        </button>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 space-y-6">
          
          <div className="text-center pb-4 border-b border-gray-100">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Configurações da Conta
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Saldo acumulado: <span className="font-extrabold text-[#0e9f45]">{pontos} pts</span>
            </p>
          </div>

          {feedback.msg && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                feedback.tipo === 'sucesso'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {feedback.tipo === 'sucesso' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {feedback.msg}
            </div>
          )}

          {/* Form Dados Cadastrais */}
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e9f45] focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                E-mail de Acesso
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                O e-mail é a chave de login e não pode ser alterado.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                CPF
              </label>
              <input
                type="text"
                value={cpf || 'Não informado'}
                disabled
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3.5 bg-[#0e9f45] hover:bg-[#0b8037] active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>

          {/* Atalhos e Ferramentas */}
          <div className="pt-2 space-y-2.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Recursos e Auditoria da Conta
            </h3>

            {/* 1. Perfil de Eco-Cidadão */}
            <div
              onClick={() => setModalAtivo('perfil')}
              className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 rounded-2xl cursor-pointer transition group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 bg-emerald-100/60 text-[#0e9f45] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-800 leading-snug group-hover:text-emerald-800">
                    Perfil de Eco-Cidadão
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Veja sua classificação de sustentabilidade e selos ecológicos.
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0e9f45] group-hover:translate-x-0.5 transition" />
            </div>

            {/* 2. Tabela Mensal de Coletas & Auditoria Anual */}
            <div
              onClick={() => setModalAtivo('tabelaMensal')}
              className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 rounded-2xl cursor-pointer transition group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 bg-emerald-100/60 text-[#0e9f45] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-800 leading-snug group-hover:text-emerald-800">
                    Relatório Mensal & Anual de Reciclagem
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Tabela detalhada de descarte mês a mês e impacto total do ano.
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0e9f45] group-hover:translate-x-0.5 transition" />
            </div>

            {/* 3. Login e Segurança */}
            <div
              onClick={() => {
                setModalAtivo('seguranca');
                setFeedbackSenha({ msg: '', tipo: '' });
                setSenhaAtual('');
                setNovaSenha('');
              }}
              className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-300 rounded-2xl cursor-pointer transition group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 bg-emerald-100/60 text-[#0e9f45] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-800 leading-snug group-hover:text-emerald-800">
                    Login e Segurança dos Dados
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Trocar senha de acesso com validação da senha atual.
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0e9f45] group-hover:translate-x-0.5 transition" />
            </div>

          </div>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800">Encerrar Sessão</h4>
              <p className="text-[11px] text-gray-400">Desconectar sua conta com segurança.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={14} /> Sair da Conta
            </button>
          </div>

        </div>
      </div>

      {/* MODAL: TABELA MENSAL & BALANÇO ANUAL DE RECICLAGEM */}
      {modalAtivo === 'tabelaMensal' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Calendar size={20} className="text-[#0e9f45]" /> Balanço Anual de Coletas ({anoAtual})
              </div>
              <button onClick={() => setModalAtivo(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Cards de Resumo Anual */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Total Coletado</span>
                <span className="text-xl font-black text-gray-900">{totalColetasAno} un</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Pontos do Ano</span>
                <span className="text-xl font-black text-[#0e9f45]">+{totalPontosAno} pts</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">CO₂ Evitado</span>
                <span className="text-xl font-black text-gray-800">~{totalCo2Ano} kg</span>
              </div>
            </div>

            {/* Tabela com Scroll */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                    <th className="p-3">Mês ({anoAtual})</th>
                    <th className="p-3 text-center">Descartes Validados</th>
                    <th className="p-3 text-center">Pontos Conquistados</th>
                    <th className="p-3 text-right">CO₂ Evitado Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dadosMensais.map((dado, i) => (
                    <tr 
                      key={i} 
                      className={`hover:bg-emerald-50/30 transition ${
                        dado.totalItens > 0 ? 'bg-white font-semibold' : 'text-gray-400'
                      }`}
                    >
                      <td className="p-3 text-gray-800">{dado.mes}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                          dado.totalItens > 0 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {dado.totalItens} {dado.totalItens === 1 ? 'item' : 'itens'}
                        </span>
                      </td>
                      <td className="p-3 text-center text-[#0e9f45] font-bold">
                        {dado.pontosGanhos > 0 ? `+${dado.pontosGanhos} pts` : '-'}
                      </td>
                      <td className="p-3 text-right text-gray-600">
                        {dado.totalItens > 0 ? `${dado.co2EstimadoKg} kg` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setModalAtivo(null)}
              className="w-full py-3 bg-[#0e9f45] hover:bg-[#0b8037] text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Fechar Relatório
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PERFIL ECO-CIDADÃO */}
      {modalAtivo === 'perfil' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Award size={20} className="text-[#0e9f45]" /> Perfil Eco-Cidadão
              </div>
              <button onClick={() => setModalAtivo(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Sua Classificação</span>
              <h3 className="text-lg font-black text-gray-900">{nivelEco}</h3>
              <p className="text-xs text-gray-600 mt-1">{pontos} pontos acumulados em Floripa</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Descartes Feitos</span>
                <span className="text-xl font-black text-gray-800">{totalColetasAno} coletas</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">CO₂ Evitado</span>
                <span className="text-xl font-black text-[#0e9f45]">~{totalCo2Ano} kg</span>
              </div>
            </div>

            <button
              onClick={() => setModalAtivo(null)}
              className="w-full py-3 bg-[#0e9f45] hover:bg-[#0b8037] text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* MODAL: SEGURANÇA E SENHA COM SENHA ATUAL */}
      {modalAtivo === 'seguranca' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-scaleUp">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Lock size={20} className="text-[#0e9f45]" /> Alterar Senha de Acesso
              </div>
              <button 
                onClick={() => {
                  setModalAtivo(null);
                  setFeedbackSenha({ msg: '', tipo: '' });
                }} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {feedbackSenha.msg && (
              <div className={`p-3 rounded-xl text-xs font-semibold text-center border ${
                feedbackSenha.tipo === 'sucesso' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {feedbackSenha.msg}
              </div>
            )}

            <form onSubmit={handleAlterarSenha} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e9f45] focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Ex: Floripa@2026"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e9f45] focus:bg-white transition"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  6 a 8 caracteres, maiúsculo, minúsculo e caractere especial (!@#$%).
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalAtivo(null);
                    setFeedbackSenha({ msg: '', tipo: '' });
                  }}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoSenha}
                  className="flex-1 py-2.5 bg-[#0e9f45] hover:bg-[#0b8037] text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {salvandoSenha ? 'Validando...' : 'Confirmar Troca'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}