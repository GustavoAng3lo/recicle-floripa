import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
=======
import axios from 'axios'; // Importação do Axios adicionada
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
import logoRecicle from '../assets/png.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
=======
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
<<<<<<< HEAD
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/login', { email, senha });
      localStorage.setItem('loginData', JSON.stringify(response.data));
      navigate('/home');
    } catch (err) {
      setErro('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
=======
    try {
      const response = await axios.post('http://localhost:3000/login', { email, senha });
      if (response.data.user) {
        localStorage.setItem('usuario_id', response.data.user.id);
        localStorage.setItem('usuarioNome', response.data.user.nome);
        navigate('/home');
      }
    } catch (error) {
      setErro(error.response?.data?.error || 'Servidor offline ou dados incorretos.');
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f0f4f0',
<<<<<<< HEAD
      fontFamily: '"Inter", sans-serif'
=======
      fontFamily: '"Inter", sans-serif' 
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          color: '#2e7d32', 
          marginBottom: '15px', 
<<<<<<< HEAD
          fontWeight: '900',
          fontSize: '3.2rem',
          letterSpacing: '-1px',
=======
          fontWeight: '900', 
          fontSize: '3.2rem', 
          letterSpacing: '-1px', 
          fontFamily: '"Inter", sans-serif'
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
        }}>
          RECICLE
        </h1>
        <img 
          src={logoRecicle} 
          alt="Mascote Recicle" 
          style={{ 
<<<<<<< HEAD
            width: '200px',
=======
            width: '200px', 
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
            height: 'auto', 
            borderRadius: '24px',
            backgroundColor: 'white',
            padding: '8px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
          }} 
        />
      </div>

      <div style={{ 
        background: 'white', 
        padding: '35px', 
        borderRadius: '24px', 
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)', 
        width: '90%', 
        maxWidth: '380px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px', fontWeight: '700' }}>Entrar</h2>
        
        {erro && (
          <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '12px' }}>{erro}</p>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '0.85rem', fontWeight: '600' }}>E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '10px', 
                border: '1px solid #ddd', 
                boxSizing: 'border-box', 
                outline: 'none',
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '0.85rem', fontWeight: '600' }}>Senha</label>
            <input
              type="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '10px', 
                border: '1px solid #ddd', 
                boxSizing: 'border-box', 
                outline: 'none',
              }}
            />
          </div>

<<<<<<< HEAD
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '14px', 
              backgroundColor: loading ? '#a5d6a7' : '#64bc3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: '700', 
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
            }}
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
=======
          {erro && (
            <p style={{ color: '#d32f2f', backgroundColor: '#fff5f5', border: '1px solid #fc8181', borderRadius: '8px', padding: '10px', fontSize: '0.85rem', margin: 0 }}>
              {erro}
            </p>
          )}

          <button type="submit" style={{
            padding: '14px',
            backgroundColor: '#64bc3c',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '10px',
            fontFamily: '"Inter", sans-serif'
          }}>
            ENTRAR
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>
          Não tem conta?{' '}
          <span 
            onClick={() => navigate('/cadastro')} 
            style={{ color: '#2e7d32', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}
          >
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;