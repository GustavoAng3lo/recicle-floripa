import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ECOPONTOS = [
  {
    id: 1,
    nome: "Ecoponto Itacorubi",
    endereco: "Rodovia Admar Gonzaga, 72 - Itacorubi",
    materiais: ["Plástico", "Vidro", "Metal", "Papel", "Eletrônicos", "Óleo de Cozinha"],
    horario: "Segunda a Sábado: 07h às 19h",
    bairro: "Itacorubi",
    mapQuery: "Ecoponto+Itacorubi+Florianopolis"
  },
  {
    id: 2,
    nome: "Ecoponto Capoeiras",
    endereco: "Rua Professor Egídio Ferreira, s/n - Capoeiras",
    materiais: ["Plástico", "Vidro", "Metal", "Papel", "Móveis", "Entulho"],
    horario: "Segunda a Sábado: 07h às 19h",
    bairro: "Continente",
    mapQuery: "Ecoponto+Capoeiras+Florianopolis"
  },
  {
    id: 3,
    nome: "Ecoponto Rio Tavares",
    endereco: "Rodovia Francisco Magno Vieira (SC-405), 4500 - Rio Tavares",
    materiais: ["Plástico", "Vidro", "Metal", "Papel", "Podas", "Eletrônicos"],
    horario: "Segunda a Sábado: 07h às 19h",
    bairro: "Sul da Ilha",
    mapQuery: "Ecoponto+Rio+Tavares+Florianopolis"
  },
  {
    id: 4,
    nome: "Ecoponto Canasvieiras",
    endereco: "Rua Francisco Faustino Martins, s/n - Canasvieiras",
    materiais: ["Plástico", "Vidro", "Metal", "Papel", "Volumosos"],
    horario: "Segunda a Sábado: 07h às 19h",
    bairro: "Norte da Ilha",
    mapQuery: "Ecoponto+Canasvieiras+Florianopolis"
  },
  {
    id: 5,
    nome: "Ponto de Coleta Centro",
    endereco: "Avenida Paulo Fontes (Terminal Integrado) - Centro",
    materiais: ["Plástico", "Papel", "Metal", "Pilhas e Baterias"],
    horario: "Diariamente: 06h às 22h",
    bairro: "Centro",
    mapQuery: "Terminal+Centro+Florianopolis"
  }
];

export default function PontosEntrega() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');
  const [ecopontoSelecionado, setEcopontoSelecionado] = useState(ECOPONTOS[0]);

  const pontosFiltrados = ECOPONTOS.filter(ponto =>
    ponto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    ponto.bairro.toLowerCase().includes(filtro.toLowerCase()) ||
    ponto.materiais.some(m => m.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-5xl">
        <button
          onClick={() => navigate('/home')}
          className="text-green-700 hover:text-green-800 font-semibold mb-4 flex items-center gap-1 cursor-pointer"
        >
          ← Voltar para o Início
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
            Pontos de Entrega e Ecopontos 📍
          </h1>
          <p className="text-gray-600 mt-1">
            Encontre o local de descarte correto mais próximo em Florianópolis.
          </p>
        </div>

        {/* Barra de Busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por bairro, nome ou material (ex: Vidro, Itacorubi)..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full p-3.5 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700"
          />
        </div>

        {/* Layout Grid: Lista de Pontos + Mapa Interativo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna da Esquerda: Lista de Cards */}
          <div className="lg:col-span-6 space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {pontosFiltrados.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center text-gray-500">
                Nenhum ponto de entrega encontrado para essa busca.
              </div>
            ) : (
              pontosFiltrados.map((ponto) => (
                <div
                  key={ponto.id}
                  onClick={() => setEcopontoSelecionado(ponto)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    ecopontoSelecionado.id === ponto.id
                      ? 'border-green-600 ring-2 ring-green-600/30 shadow-md bg-green-50/20'
                      : 'border-gray-200 hover:border-green-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{ponto.nome}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-semibold">
                      {ponto.bairro}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">📍 {ponto.endereco}</p>
                  <p className="text-xs text-gray-500 mb-3">🕒 {ponto.horario}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {ponto.materiais.map((mat, idx) => (
                      <span key={idx} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coluna da Direita: Mapa Integrado do Google Maps */}
          <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[580px]">
            <div className="mb-3">
              <h4 className="font-bold text-green-800 text-base flex items-center gap-1.5">
                🗺️ Localização no Mapa: <span className="text-gray-700 font-medium">{ecopontoSelecionado.nome}</span>
              </h4>
              <p className="text-xs text-gray-500">{ecopontoSelecionado.endereco}</p>
            </div>

            <div className="flex-1 rounded-xl overflow-hidden border border-gray-200">
              <iframe
                title="Mapa do Ponto de Coleta"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${ecopontoSelecionado.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              />
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${ecopontoSelecionado.mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold text-center rounded-xl transition text-sm flex items-center justify-center gap-1.5"
            >
              Abrir rota no Google Maps ↗
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}