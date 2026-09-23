import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoRecicle from '../assets/png.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/login', { email, senha });
      
      if (response.data) {
        // Salva nos formatos das duas ramificações para dar suporte a todas as telas do app
        localStorage.setItem('loginData', JSON.stringify(response.data));
        
        if (response.data.user) {
          localStorage.setItem('usuario_id', response.data.user.id);
          localStorage.setItem('usuarioNome', response.data.user.nome);
        }
        
        navigate('/home');
      }
    } catch (error) {
      console.error("Erro ao efetuar login:", error);
      setErro(error.response?.data?.error || 'Servidor offline ou e-mail/senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='auth-page'>
      <section className='auth-shell'>
        <header className='auth-brand'>
          <div className='auth-logo-mark'>
            <img src={logoRecicle} alt='Logo Recicle Floripa' />
          </div>
          <span>Recicle Floripa</span>
        </header>

        <div className='auth-content'>
          <div className='auth-hero-image'>
            <img src={logoRecicle} alt='Mascote Recicle Floripa' />
          </div>
          <h1>Transforme lixo em pontos que viram benefícios!</h1>
          <p className='auth-introduction'>
            Recicle, ganhe pontos e ajude a construir uma cidade mais limpa.
          </p>
        
        {erro && (
          <p className='auth-error'>
            {erro}
          </p>
        )}

        <form className='auth-form' onSubmit={handleLogin}>
          <label className='auth-field'>
            <span>E-mail</span>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className='auth-field'>
            <span>Senha</span>
            <input
              type="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className='auth-button auth-button-primary'
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>

          <button
            type='button'
            className='auth-button auth-button-secondary'
            onClick={() => navigate('/cadastro')}
          >
            Criar conta
          </button>
        </form>
        
        <p className='auth-footer'>
          Ao entrar, você concorda com os termos de uso e a privacidade.
        </p>
        </div>
      </section>
    </main>
  );
};

export default Login;