import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Faz a chamada para a rota de login no seu backend (Porta 3000)
      const response = await axios.post('http://localhost:3000/login', { 
        email, 
        senha: password 
      });

      console.log("Login autorizado:", response.data);
      
      // Opcional: Salvar o nome do usuário no localStorage para usar na Home
      localStorage.setItem('usuarioNome', response.data.user.nome);

      alert(`Bem-vindo de volta, ${response.data.user.nome}!`);
      navigate('/home'); 
    } catch (error) {
      console.error("Erro no login:", error);
      // Se o backend retornar 401 ou 500, cai aqui
      alert(error.response?.data?.error || "E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="brand-title">Recicle</h1>
      
      <form onSubmit={handleLogin} className="login-form">
        <p className="login-instruction">Digite os seus dados de acesso abaixo.</p>
        
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
        </div>

        <button type="submit" className="btn-primary">Entrar</button>
        
        <button 
          type="button" 
          onClick={() => navigate('/cadastro')} 
          className="btn-link"
        >
          Não possui conta? Cadastre-se
        </button>
      </form>
    </div>
  );
};

export default Login;