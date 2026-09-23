import { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle, Info, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MATERIAIS = [
  { nome: 'Garrafa PET', tipo: 'Plástico', instrucao: 'Lave para retirar resíduos e amasse para ocupar menos espaço.', cor: '#e53935' },
  { nome: 'Caixa de Leite', tipo: 'Papel/Plástico/Metal', instrucao: 'Retire o excesso de líquido e descarte no lixo seco.', cor: '#1e88e5' },
  { nome: 'Lâmpada', tipo: 'Resíduo Especial', instrucao: 'Não descarte no lixo comum. Leve a um ponto de coleta de eletrônicos.', cor: '#ffb300' },
  { nome: 'Óleo de Cozinha', tipo: 'Líquido Poluente', instrucao: 'Coloque em uma garrafa PET bem fechada e agende a coleta.', cor: '#fb8c00' },
  { nome: 'Papelão', tipo: 'Papel', instrucao: 'Mantenha seco e dobrado para facilitar o transporte.', cor: '#1e88e5' },
];

export default function Servicos() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [agendado, setAgendado] = useState(false);
  const resultados = MATERIAIS.filter((material) => material.nome.toLowerCase().includes(busca.toLowerCase()) || material.tipo.toLowerCase().includes(busca.toLowerCase()));

  const handleAgendar = (event) => {
    event.preventDefault();
    setAgendado(true);
    setTimeout(() => { setAgendado(false); navigate('/home'); }, 3000);
  };

  return (
    <main className='services-page'>
      <div className='services-shell'>
        <header className='services-topbar'><button className='scanner-back-button' onClick={() => navigate('/home')} aria-label='Voltar para o início'><ArrowLeft size={18} /></button><div><span className='home-eyebrow'>APRENDA E AGENDE</span><h1>Serviços</h1></div><Calendar size={18} color='#28a95b' /></header>
        <section className='services-content'>
          <section className='guide-section'><span className='home-eyebrow'>GUIA INTELIGENTE</span><h2>Como descartar?</h2><p>Pesquise um material para saber o destino correto em Floripa.</p><label className='services-search'><Search size={16} /><input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder='Ex: óleo, PET ou papelão' /></label>
            {busca && <div className='material-results'>{resultados.length ? resultados.map((material) => <article className='material-card' key={material.nome}><span className='material-type' style={{ background: material.cor }}>{material.tipo}</span><h3>{material.nome}</h3><p><Info size={14} /> {material.instrucao}</p></article>) : <div className='services-empty'>Material não encontrado. Tente outro termo.</div>}</div>}
          </section>

          <section className='schedule-card'>{agendado ? <div className='schedule-success'><CheckCircle size={48} /><h2>Agendamento confirmado!</h2><p>As cooperativas parceiras foram notificadas.</p></div> : <><div className='schedule-heading'><span className='schedule-icon'><Calendar size={18} /></span><div><span className='home-eyebrow'>COLETA ESPECIAL</span><h2>Agendar uma coleta</h2></div></div><p>Para grandes volumes, eletrônicos ou materiais perigosos.</p><form className='schedule-form' onSubmit={handleAgendar}><label><span>O que será coletado?</span><select required defaultValue=''><option value='' disabled>Selecione o material</option><option value='eletronicos'>Eletrônicos (TV, PC etc.)</option><option value='oleo'>Óleo de cozinha</option><option value='moveis'>Móveis velhos</option><option value='entulho'>Grandes volumes recicláveis</option></select></label><label><span>Data sugerida</span><input type='date' required /></label><label className='schedule-full'><span>Ponto de referência</span><div><MapPin size={15} /><input type='text' placeholder='Ex: próximo ao Titri' required /></div></label><button className='auth-button auth-button-primary' type='submit'>Solicitar agendamento</button></form></>}</section>
        </section>
      </div>
    </main>
  );
}
