import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, CreditCard, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import logoRecicle from '../assets/png.png';

const maskCPF = (value) => value
  .replace(/\D/g, '')
  .slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const maskDate = (value) => value
  .replace(/\D/g, '')
  .slice(0, 8)
  .replace(/(\d{2})(\d)/, '$1/$2')
  .replace(/(\d{2})(\d)/, '$1/$2');

const Cadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState('');

  const regras = {
    tamanho: senha.length >= 6 && senha.length <= 8,
    maiusculoMinusculo: /[a-z]/.test(senha) && /[A-Z]/.test(senha),
    letraEspecial: /[a-zA-Z]/.test(senha) && /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };

  const handleCadastro = async (event) => {
    event.preventDefault();
    setErro('');

    if (!regras.tamanho || !regras.maiusculoMinusculo || !regras.letraEspecial) {
      setErro('Por favor, cumpra todos os requisitos da senha.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/usuarios', {
        nome,
        email,
        senha,
        cpf,
        data_nascimento: dataNasc,
      });

      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao conectar com o servidor.');
    }
  };

  const passwordRule = (valid, text) => (
    <span className={senha === '' ? 'password-rule' : valid ? 'password-rule is-valid' : 'password-rule is-invalid'}>
      {valid ? '✓' : '•'} {text}
    </span>
  );

  return (
    <main className='auth-page'>
      <section className='auth-shell auth-shell-register'>
        <header className='auth-brand'>
          <div className='auth-logo-mark'>
            <img src={logoRecicle} alt='Logo Recicle Floripa' />
          </div>
          <span>Recicle Floripa</span>
        </header>

        <div className='auth-content register-content'>
          <h1>Criar sua conta</h1>
          <p className='auth-introduction'>Preencha seus dados e comece a transformar seus descartes em benefícios.</p>

          {erro && <p className='auth-error'>{erro}</p>}

          <form className='auth-form register-form' onSubmit={handleCadastro}>
            <label className='auth-field'>
              <span>Nome completo</span>
              <div className='auth-input-with-icon'>
                <User size={15} aria-hidden='true' />
                <input type='text' placeholder='Nome completo' value={nome} onChange={(event) => setNome(event.target.value)} required />
              </div>
            </label>

            <label className='auth-field'>
              <span>E-mail</span>
              <div className='auth-input-with-icon'>
                <Mail size={15} aria-hidden='true' />
                <input type='email' placeholder='seuemail@exemplo.com' value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
            </label>

            <label className='auth-field'>
              <span>Senha</span>
              <div className='auth-input-with-icon'>
                <Lock size={15} aria-hidden='true' />
                <input type={showPassword ? 'text' : 'password'} placeholder='********' value={senha} onChange={(event) => setSenha(event.target.value)} required />
                <button type='button' className='password-toggle' onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className='password-rules'>
                {passwordRule(regras.tamanho, 'Entre 6 e 8 caracteres')}
                {passwordRule(regras.maiusculoMinusculo, 'Maiúscula e minúscula')}
                {passwordRule(regras.letraEspecial, 'Uma letra e um caractere especial')}
              </div>
            </label>

            <div className='register-fields-row'>
              <label className='auth-field'>
                <span>CPF</span>
                <div className='auth-input-with-icon'>
                  <CreditCard size={15} aria-hidden='true' />
                  <input type='text' placeholder='000.000.000-00' value={cpf} onChange={(event) => setCpf(maskCPF(event.target.value))} required />
                </div>
              </label>
              <label className='auth-field'>
                <span>Nascimento</span>
                <div className='auth-input-with-icon'>
                  <Calendar size={15} aria-hidden='true' />
                  <input type='text' placeholder='DD/MM/AAAA' value={dataNasc} onChange={(event) => setDataNasc(maskDate(event.target.value))} required />
                </div>
              </label>
            </div>

            <label className='terms-field'>
              <input type='checkbox' required />
              <span>Concordo com os <b>termos</b> e a <b>privacidade</b>.</span>
            </label>

            <button type='submit' className='auth-button auth-button-primary'>Cadastrar e começar</button>
          </form>

          <p className='auth-footer'>Já tem uma conta? <button type='button' className='auth-text-button' onClick={() => navigate('/')}>Faça login</button></p>
        </div>
      </section>
    </main>
  );
};

export default Cadastro;
