import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica inicial para a Sprint 1/2: Simular login e navegar para Home
    console.log("Login tentado com:", email);
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="brand-title">Recicle</h1>
        <img src={heroImg} alt="Mascote Recicle" className="hero-logo" />
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <p className="login-instruction">
          Digite os seus dados de acesso no campo abaixo.
        </p>
        
        <div className="input-group">
          <label>E-mail</label>
          <input 
            type="email" 
            placeholder="Digite seu e-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <input 
            type="password" 
            placeholder="Digite sua senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <a href="#" className="forgot-password">Esqueceu sua senha?</a>
        </div>

        <button type="submit" className="btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;