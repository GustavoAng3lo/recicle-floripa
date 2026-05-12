import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2, MapPin } from 'lucide-react';

const Coleta = () => {
  const [categoria, setCategoria] = useState('Reciclável');
  const [quantidade, setQuantidade] = useState(1);
  const [localizacao, setLocalizacao] = useState('Santo Antônio de Lisboa, Florianópolis'); // Localização padrão
  const navigate = useNavigate();

  const handleSalvarColeta = async () => {
    try {
      // Por enquanto usando o ID 2 como teste, conforme conversamos
      const usuario_id = 2; 

      const dadosParaEnviar = {
        categoria,
        quantidade: Number(quantidade), // Garante que vai como número para o banco
        localizacao,
        usuario_id
      };

      const response = await axios.post('http://localhost:3000/residuos', dadosParaEnviar);

      if (response.status === 201 || response.status === 200) {
        alert('✅ Coleta registrada com sucesso!');
        navigate('/home');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('❌ Erro ao salvar coleta. Verifique se o backend está rodando!');
    }
  };

  return (
    <div className="home-mobile-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <ArrowLeft 
          onClick={() => navigate('/home')} 
          style={{ cursor: 'pointer', color: '#2e7d32' }} 
        />
        <h2 style={{ marginLeft: '20px', color: '#2e7d32', fontWeight: '800' }}>Nova Coleta</h2>
      </header>

      <div className="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '700', color: '#444' }}>Tipo de Resíduo</label>
          <select 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)}
            style={{ padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
          >
            <option value="Reciclável">Reciclável</option>
            <option value="Orgânico">Orgânico</option>
            <option value="Eletrônico">Eletrônico</option>
            <option value="Óleo">Óleo de Cozinha</option>
          </select>
        </div>

        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '700', color: '#444' }}>Quantidade (itens ou kg)</label>
          <input 
            type="number" 
            value={quantidade} 
            onChange={(e) => setQuantidade(e.target.value)} 
            style={{ padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
        </div>

        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '700', color: '#444' }}>Local de Coleta</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '15px', color: '#666' }} />
            <input 
              type="text" 
              value={localizacao} 
              onChange={(e) => setLocalizacao(e.target.value)} 
              style={{ padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }}
              placeholder="Digite o endereço"
            />
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleSalvarColeta}
          style={{ 
            marginTop: '10px',
            backgroundColor: '#64bc3c', 
            color: 'white', 
            padding: '18px', 
            borderRadius: '14px', 
            border: 'none', 
            fontWeight: '800', 
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Trash2 size={20} style={{ marginRight: '10px' }} />
          Confirmar Descarte
        </button>
      </div>
    </div>
  );
};

export default Coleta;