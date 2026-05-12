import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoRecicle from '../assets/png.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('usuarioNome', 'Luis Gustavo');
    navigate('/home');
  };

  return (
    <div className="login-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f0f4f0',
      fontFamily: '"Inter", sans-serif' // Aplicando Inter em tudo
    }}>
      
      {/* SEÇÃO DA LOGO ATUALIZADA */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          color: '#2e7d32', 
          marginBottom: '15px', 
          fontWeight: '900', // Bem negrito como a Inter pede
          fontSize: '3.2rem', // Um pouco maior
          letterSpacing: '-1px', // Inter fica linda com espaçamento negativo
          fontFamily: '"Inter", sans-serif'
        }}>
          RECICLE
        </h1>
        <img 
          src={logoRecicle} 
          alt="Mascote Recicle" 
          style={{ 
            width: '200px', // Aumentado conforme solicitado
            height: 'auto', 
            borderRadius: '24px',
            backgroundColor: 'white',
            padding: '8px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
          }} 
        />
      </div>

      <div className="login-box" style={{ 
        background: 'white', 
        padding: '35px', 
        borderRadius: '24px', 
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)', 
        width: '90%', 
        maxWidth: '380px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px', fontWeight: '700' }}>Entrar</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '0.85rem', fontWeight: '600' }}>E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '10px', 
                border: '1px solid #ddd', 
                boxSizing: 'border-box', 
                outline: 'none',
                fontFamily: '"Inter", sans-serif'
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
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '10px', 
                border: '1px solid #ddd', 
                boxSizing: 'border-box', 
                outline: 'none',
                fontFamily: '"Inter", sans-serif'
              }}
            />
          </div>

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
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>
          Não tem conta? <span onClick={() => navigate('/cadastro')} style={{ color: '#2e7d32', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
};

export default Login;