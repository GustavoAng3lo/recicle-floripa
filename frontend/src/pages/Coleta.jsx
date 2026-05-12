import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2 } from 'lucide-react';

const Coleta = () => {
  const [categoria, setCategoria] = useState('Reciclável');
  const [quantidade, setQuantidade] = useState(1);
  const navigate = useNavigate();

  const handleSalvarColeta = async () => {
    try {
      // Pega o ID do usuário que logou (vamos precisar salvar isso no login depois)
      const usuario_id = 2; // Por enquanto vamos usar o ID do Jose que vimos no banco

      await axios.post('http://localhost:3000/residuos', {
        categoria,
        quantidade,
        localizacao: 'Rua das Flores, Florianópolis',
        usuario_id
      });

      alert('Coleta registrada com sucesso!');
      navigate('/home');
    } catch (error) {
      alert('Erro ao salvar coleta.');
    }
  };

  return (
    <div className="home-mobile-container" style={{ padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <ArrowLeft onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
        <h2 style={{ marginLeft: '20px', color: '#64bc3c' }}>Nova Coleta</h2>
      </header>

      <div className="login-form">
        <div className="input-group">
          <label>Tipo de Resíduo</label>
          <select 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            <option value="Reciclável">Reciclável</option>
            <option value="Orgânico">Orgânico</option>
            <option value="Eletrônico">Eletrônico</option>
            <option value="Óleo">Óleo de Cozinha</option>
          </select>
        </div>

        <div className="input-group">
          <label>Quantidade (itens ou kg)</label>
          <input 
            type="number" 
            value={quantidade} 
            onChange={(e) => setQuantidade(e.target.value)} 
          />
        </div>

        <button className="btn-primary" onClick={handleSalvarColeta}>
          <Trash2 size={18} style={{ marginRight: '10px' }} />
          Confirmar Descarte
        </button>
      </div>
    </div>
  );
};

export default Coleta;