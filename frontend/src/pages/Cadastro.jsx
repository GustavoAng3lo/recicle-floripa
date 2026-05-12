import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: ''
  });
  const navigate = useNavigate();

  // Função para atualizar os dados do estado conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Faz a chamada para o seu backend na porta 3000
      const response = await axios.post('http://localhost:3000/usuarios', formData);
      
      console.log("Usuário cadastrado com sucesso:", response.data);
      alert("Cadastro realizado com sucesso no banco de dados!");
      
      // Após o sucesso, navega para a tela de Login
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      alert(error.response?.data?.error || "Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="brand-title">Recicle</h1>
      <h2 style={{ color: '#64bc3c', marginBottom: '20px', fontWeight: 'normal' }}>Seus dados</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Nome completo</label>
          <input 
            name="nome"
            type="text" 
            placeholder="Digite seu nome" 
            value={formData.nome}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="input-group">
          <label>E-mail</label>
          <input 
            name="email"
            type="email" 
            placeholder="Digite seu e-mail" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <input 
            name="senha"
            type="password" 
            placeholder="Crie uma senha" 
            value={formData.senha}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="input-group">
          <label>CPF</label>
          <input 
            name="cpf"
            type="text" 
            placeholder="000.000.000-00" 
            value={formData.cpf}
            onChange={handleChange}
            required 
          />
        </div>

        <button type="submit" className="btn-primary">Cadastrar</button>
        
        <button 
          type="button" 
          onClick={() => navigate('/')} 
          className="btn-link"
        >
          Já possui conta? Entrar
        </button>
      </form>
    </div>
  );
};

export default Cadastro;