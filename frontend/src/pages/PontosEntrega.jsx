import { ArrowLeft, Clock3, ExternalLink, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ECOPONTOS = [
  { id: 1, nome: 'Ecoponto Itacorubi', endereco: 'Rodovia Admar Gonzaga, 72 - Itacorubi', materiais: ['Plástico', 'Vidro', 'Metal', 'Papel', 'Eletrônicos', 'Óleo de Cozinha'], horario: 'Segunda a Sábado: 07h às 19h', bairro: 'Itacorubi', mapQuery: 'Ecoponto+Itacorubi+Florianopolis' },
  { id: 2, nome: 'Ecoponto Capoeiras', endereco: 'Rua Professor Egídio Ferreira, s/n - Capoeiras', materiais: ['Plástico', 'Vidro', 'Metal', 'Papel', 'Móveis', 'Entulho'], horario: 'Segunda a Sábado: 07h às 19h', bairro: 'Continente', mapQuery: 'Ecoponto+Capoeiras+Florianopolis' },
  { id: 3, nome: 'Ecoponto Rio Tavares', endereco: 'Rodovia Francisco Magno Vieira (SC-405), 4500 - Rio Tavares', materiais: ['Plástico', 'Vidro', 'Metal', 'Papel', 'Podas', 'Eletrônicos'], horario: 'Segunda a Sábado: 07h às 19h', bairro: 'Sul da Ilha', mapQuery: 'Ecoponto+Rio+Tavares+Florianopolis' },
  { id: 4, nome: 'Ecoponto Canasvieiras', endereco: 'Rua Francisco Faustino Martins, s/n - Canasvieiras', materiais: ['Plástico', 'Vidro', 'Metal', 'Papel', 'Volumosos'], horario: 'Segunda a Sábado: 07h às 19h', bairro: 'Norte da Ilha', mapQuery: 'Ecoponto+Canasvieiras+Florianopolis' },
  { id: 5, nome: 'Ponto de Coleta Centro', endereco: 'Avenida Paulo Fontes (Terminal Integrado) - Centro', materiais: ['Plástico', 'Papel', 'Metal', 'Pilhas e Baterias'], horario: 'Diariamente: 06h às 22h', bairro: 'Centro', mapQuery: 'Terminal+Centro+Florianopolis' },
];

export default function PontosEntrega() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');
  const [ecopontoSelecionado, setEcopontoSelecionado] = useState(ECOPONTOS[0]);
  const pontosFiltrados = ECOPONTOS.filter((ponto) => ponto.nome.toLowerCase().includes(filtro.toLowerCase()) || ponto.bairro.toLowerCase().includes(filtro.toLowerCase()) || ponto.materiais.some((material) => material.toLowerCase().includes(filtro.toLowerCase())));

  return (
    <main className='points-page'>
      <div className='points-shell'>
        <header className='points-topbar'>
          <button className='scanner-back-button' onClick={() => navigate('/home')} aria-label='Voltar para o início'><ArrowLeft size={18} /></button>
          <div><span className='home-eyebrow'>DESCARTE CORRETO</span><h1>Pontos de entrega</h1></div>
          <MapPin size={19} color='#28a95b' />
        </header>

        <section className='points-content'>
          <p className='points-description'>Encontre um ecoponto perto de você e dê o destino certo aos seus materiais.</p>
          <label className='points-search'><Search size={16} /><input value={filtro} onChange={(event) => setFiltro(event.target.value)} placeholder='Buscar bairro, ponto ou material' /></label>

          <div className='points-section-heading'><div><span className='home-eyebrow'>FLORIANÓPOLIS</span><h2>{pontosFiltrados.length} locais encontrados</h2></div><span className='points-count'>{pontosFiltrados.length}/5</span></div>

          {pontosFiltrados.length === 0 ? <div className='points-empty'>Nenhum ponto encontrado para essa busca.</div> : <div className='points-list'>
            {pontosFiltrados.map((ponto) => <button key={ponto.id} className={`point-card ${ecopontoSelecionado.id === ponto.id ? 'is-selected' : ''}`} onClick={() => setEcopontoSelecionado(ponto)}>
              <span className='point-card-icon'><MapPin size={17} /></span>
              <span className='point-card-copy'><strong>{ponto.nome}</strong><small>{ponto.endereco}</small><span className='point-hours'><Clock3 size={12} /> {ponto.horario}</span><span className='point-tags'>{ponto.materiais.slice(0, 4).map((material) => <em key={material}>{material}</em>)}</span></span>
              <span className='point-badge'>{ponto.bairro}</span>
            </button>)}
          </div>}

          <section className='selected-map'>
            <div className='selected-map-heading'><div><span className='home-eyebrow'>LOCALIZAÇÃO SELECIONADA</span><h2>{ecopontoSelecionado.nome}</h2><p>{ecopontoSelecionado.endereco}</p></div><MapPin size={18} color='#28a95b' /></div>
            <div className='map-frame'><iframe title='Mapa do ponto de coleta' width='100%' height='100%' frameBorder='0' src={`https://maps.google.com/maps?q=${ecopontoSelecionado.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`} allowFullScreen /></div>
            <a className='points-route-button' href={`https://www.google.com/maps/search/?api=1&query=${ecopontoSelecionado.mapQuery}`} target='_blank' rel='noopener noreferrer'>Abrir rota no Google Maps <ExternalLink size={14} /></a>
          </section>
        </section>
      </div>
    </main>
  );
}
