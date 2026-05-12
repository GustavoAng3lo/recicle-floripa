import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Importação necessária
import { User, Mail, Lock, Eye, EyeOff, CreditCard, Calendar } from 'lucide-react';
import logoRecicle from '../assets/png.png';

const Cadastro = () => {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const regras = {
    tamanho: senha.length >= 6 && senha.length <= 8,
    maiusculoMinusculo: /[a-z]/.test(senha) && /[A-Z]/.test(senha),
    letraEspecial: /[a-zA-Z]/.test(senha) && /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };

  // 2. Função agora é ASYNC para falar com o banco
  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validação de segurança antes de enviar
    if (regras.tamanho && regras.maiusculoMinusculo && regras.letraEspecial) {
      try {
        // 3. Chamada real para o seu backend
        const response = await axios.post('http://localhost:3000/usuarios', {
          nome,
          email,
          senha,
          cpf
        });

        if (response.status === 201) {
          alert('✅ Usuário cadastrado no banco de dados com sucesso!');
          navigate('/'); // Volta para o Login
        }
      } catch (error) {
        console.error("Erro no cadastro:", error);
        // Exibe o erro real vindo do Postgres (ex: CPF duplicado)
        alert(error.response?.data?.error || 'Erro ao conectar com o servidor.');
      }
    } else {
      alert('Por favor, cumpra todos os requisitos da senha.');
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
      fontFamily: '"Inter", sans-serif',
      padding: '40px 20px'
    }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#2e7d32', 
          marginBottom: '10px', 
          fontWeight: '900', 
          fontSize: '3rem', 
          letterSpacing: '-1px' 
        }}>
          RECICLE
        </h1>
        <img 
          src={logoRecicle} 
          alt="Mascote Recicle" 
          style={{ 
            width: '180px', 
            height: 'auto', 
            borderRadius: '24px',
            backgroundColor: 'white',
            padding: '8px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
          }} 
        />
      </div>

      {/* BOX DE CADASTRO */}
      <div style={{ 
        background: 'white', 
        padding: '35px', 
        borderRadius: '24px', 
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '420px' 
      }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 5px 0', fontSize: '1.6rem', fontWeight: '800', color: '#333' }}>Seus dados</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px', fontSize: '0.9rem' }}>Digite suas informações para se registrar ♻️</p>

        <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* NOME COMPLETO */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Nome completo</label>
            <div style={inputWrapperStyle}>
              <User size={20} color="#999" style={iconStyle} />
              <input 
                type="text" 
                placeholder="Nome completo" 
                style={inputStyle} 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

          {/* E-MAIL */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>E-mail</label>
            <div style={inputWrapperStyle}>
              <Mail size={20} color="#999" style={iconStyle} />
              <input 
                type="email" 
                placeholder="seuemail@exemplo.com" 
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SENHA */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Senha</label>
            <div style={inputWrapperStyle}>
              <Lock size={20} color="#999" style={iconStyle} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="********" 
                style={inputStyle}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <div onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight: '5px' }}>
                {showPassword ? <Eye size={20} color="#999" /> : <EyeOff size={20} color="#999" />}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.75rem', marginTop: '6px', gap: '2px' }}>
              <span style={{ color: senha === '' ? '#777' : (regras.tamanho ? '#2e7d32' : '#d32f2f'), fontWeight: '600' }}>
                {regras.tamanho ? '✓' : '•'} Deve ter entre 6 a 8 caracteres
              </span>
              <span style={{ color: senha === '' ? '#777' : (regras.maiusculoMinusculo ? '#2e7d32' : '#d32f2f'), fontWeight: '600' }}>
                {regras.maiusculoMinusculo ? '✓' : '•'} Deve incluir maiúsculo e minúsculo
              </span>
              <span style={{ color: senha === '' ? '#777' : (regras.letraEspecial ? '#2e7d32' : '#d32f2f'), fontWeight: '600' }}>
                {regras.letraEspecial ? '✓' : '•'} Deve incluir pelo menos uma letra e um caractere especial
              </span>
            </div>
          </div>

          {/* CPF */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>CPF</label>
            <div style={inputWrapperStyle}>
              <CreditCard size={20} color="#999" style={iconStyle} />
              <input 
                type="text" 
                placeholder="000.000.000-00" 
                style={inputStyle}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
          </div>

          {/* DATA DE NASCIMENTO */}
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Data de nascimento</label>
            <div style={inputWrapperStyle}>
              <Calendar size={20} color="#999" style={iconStyle} />
              <input 
                type="text" 
                placeholder="DD/MM/AAAA" 
                style={inputStyle}
                value={dataNasc}
                onChange={(e) => setDataNasc(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" style={checkboxStyle} required />
              <span>Ao se cadastrar, você concorda com os <b style={linkStyle}>termos</b> e a <b style={linkStyle}>Privacidade</b>.</span>
            </label>
          </div>

          <button type="submit" style={buttonStyle}>CADASTRAR</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#666' }}>
          Já tem conta? <span style={linkStyle} onClick={() => navigate('/')}>Faça Login</span>
        </p>
      </div>
    </div>
  );
};

// ESTILOS (MANTIDOS)
const inputContainerStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#444' };
const inputWrapperStyle = { display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '12px', padding: '0 12px', backgroundColor: '#fff', transition: '0.3s' };
const iconStyle = { marginRight: '12px' };
const inputStyle = { border: 'none', outline: 'none', padding: '14px 0', width: '100%', fontSize: '0.95rem', fontFamily: '"Inter", sans-serif', color: '#333' };
const checkboxLabelStyle = { display: 'flex', gap: '10px', fontSize: '0.78rem', color: '#555', alignItems: 'flex-start', cursor: 'pointer', lineHeight: '1.4' };
const checkboxStyle = { marginTop: '3px', cursor: 'pointer' };
const buttonStyle = { backgroundColor: '#64bc3c', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' };
const linkStyle = { color: '#2e7d32', fontWeight: '800', cursor: 'pointer', textDecoration: 'none' };

export default Cadastro;