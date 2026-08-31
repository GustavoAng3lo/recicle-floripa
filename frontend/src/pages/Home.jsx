import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: 'Usuário', pontos: 0 });
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const usuarioId = localStorage.getItem('usuario_id') || 1;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const resUser = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
      if (resUser.ok) {
        const dataUser = await resUser.json();
        setUsuario(dataUser);
      }

      const resHist = await fetch(`http://localhost:3000/residuos/${usuarioId}`);
      if (resHist.ok) {
        const dataHist = await resHist.json();
        setHistorico(dataHist);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da Home:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluirColeta = async (id) => {
    if (!window.confirm('Deseja realmente excluir este registro? (-5 pontos)')) return;

    try {
      const res = await fetch(`http://localhost:3000/residuos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        carregarDados();
      }
    } catch (error) {
      console.error('Erro ao excluir coleta:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col font-sans">
      
      {/* Banner Superior Compacto e Elegante */}
      <header className="bg-[#0e9f45] text-white pt-8 pb-16 px-4 text-center flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
          Faça sua coleta
        </h1>
        <p className="text-emerald-100 mt-1.5 text-sm sm:text-base font-normal opacity-95">
          Sua atitude muda o mundo, comece pelo lixo.
        </p>
        <button
          onClick={() => navigate('/pontos')}
          className="mt-4 bg-white text-[#0e9f45] hover:bg-emerald-50 font-bold px-7 py-2 rounded-full shadow-md text-sm transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          Mapa de Pontos
        </button>
      </header>

      {/* Conteúdo Central Alinhado */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pb-12 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Coluna da Esquerda: Ações + Histórico */}
          <div className="lg:col-span-8 space-y-7">
            
            {/* Seção 1: O que você deseja fazer */}
            <section>
              <h2 className="text-base font-bold text-gray-800 mb-3 tracking-tight">
                O que você deseja fazer?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* Card 1: Scanner */}
                <div
                  onClick={() => navigate('/scanner')}
                  className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e9f45] flex items-center justify-center text-lg mb-3 shadow-inner">
                      📷
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Escanear e Descartar</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Aponte a câmera para a IA identificar o resíduo e a lixeira.
                    </p>
                  </div>
                  <span className="text-[#0e9f45] text-xs font-semibold mt-4 flex items-center gap-1">
                    Acessar <span className="text-base leading-none">›</span>
                  </span>
                </div>

                {/* Card 2: Pontos de Entrega */}
                <div
                  onClick={() => navigate('/pontos')}
                  className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e9f45] flex items-center justify-center text-lg mb-3 shadow-inner">
                      📍
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Pontos de Entrega</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Encontre ecopontos e locais de descarte em Floripa.
                    </p>
                  </div>
                  <span className="text-[#0e9f45] text-xs font-semibold mt-4 flex items-center gap-1">
                    Acessar <span className="text-base leading-none">›</span>
                  </span>
                </div>

                {/* Card 3: Trocar Pontos */}
                <div
                  onClick={() => navigate('/trocar-pontos')}
                  className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e9f45] flex items-center justify-center text-lg mb-3 shadow-inner">
                      🏷️
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Trocar Pontos</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Resgate prêmios, benefícios e cupons ecológicos.
                    </p>
                  </div>
                  <span className="text-[#0e9f45] text-xs font-semibold mt-4 flex items-center gap-1">
                    Acessar <span className="text-base leading-none">›</span>
                  </span>
                </div>

              </div>
            </section>

            {/* Seção 2: Histórico de Coletas */}
            <section>
              <h2 className="text-base font-bold text-gray-800 mb-3 tracking-tight">
                Histórico de Coletas
              </h2>
              
              {carregando ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm shadow-sm">
                  Carregando coletas...
                </div>
              ) : historico.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 text-sm shadow-sm">
                  Nenhuma coleta registrada ainda. Escaneie um resíduo para começar!
                </div>
              ) : (
                <div className="space-y-3">
                  {historico.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-emerald-100 text-[#0e9f45] rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                          ♻️
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{item.categoria}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          </div>
                          <p className="text-xs text-gray-600 font-medium mt-0.5">{item.tipo_reciclagem}</p>
                          <p className="text-[11px] text-gray-400">{item.localizacao}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(item.data_descarte).toLocaleDateString('pt-BR')}
                        </span>
                        <button
                          onClick={() => handleExcluirColeta(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50 text-base"
                          title="Excluir coleta"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* Coluna da Direita: Card Flutuante de Perfil e Pontuação */}
          <div className="lg:col-span-4">
            <div className="bg-[#057a44] text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-base font-bold flex items-center gap-1.5">
                Olá, {usuario.nome}! 👋
              </h3>

              {/* Box 1: Pontos */}
              <div className="bg-[#0e9f45] p-4 rounded-2xl border border-emerald-400/20">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100 block">
                  SEUS PONTOS ACUMULADOS
                </span>
                <span className="text-3xl font-black mt-1 block tracking-tight">
                  {usuario.pontos || 0} pts
                </span>
              </div>

              {/* Box 2: Coletas */}
              <div className="bg-[#0e9f45] p-4 rounded-2xl border border-emerald-400/20">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100 block">
                  COLETAS REALIZADAS
                </span>
                <span className="text-3xl font-black mt-1 block tracking-tight">
                  {historico.length}
                </span>
              </div>

           <button
  onClick={() => navigate('/configuracoes')}
  className="w-full bg-white text-[#057a44] hover:bg-emerald-50 font-bold py-3 rounded-xl transition text-xs shadow-sm cursor-pointer mt-1"
>
  Configurações da Conta
</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}