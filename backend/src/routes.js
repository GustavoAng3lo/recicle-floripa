const express = require('express');
const routes = express.Router();
const pool = require('./database');

// Rota de teste
routes.get('/', (req, res) => {
  return res.json({ message: "API Recicle Floripa Online!" });
});

// 1. Cadastro de Usuário
routes.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cpf } = req.body;
  try {
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, cpf, pontos) VALUES ($1, $2, $3, $4, 0) RETURNING id, nome, email',
      [nome, email, senha, cpf]
    );
    return res.status(201).json(novoUsuario.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao cadastrar. E-mail ou CPF já podem estar em uso." });
  }
});

// 2. Login Autenticação
routes.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2', 
      [email, senha]
    );
    
    if (usuario.rows.length > 0) {
      return res.json({ message: "Login realizado!", user: usuario.rows[0] });
    } else {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor ao tentar logar." });
  }
});

// 3. Registrar Coleta Inteligente + Somar 5 Pontos (ATUALIZADO)
routes.post('/residuos', async (req, res) => {
  const { categoria, tipo_reciclagem, quantidade, localizacao, usuario_id } = req.body;

  try {
    // A. Salva a coleta
    await pool.query(
      'INSERT INTO residuos (categoria, tipo_reciclagem, quantidade, localizacao, usuario_id) VALUES ($1, $2, $3, $4, $5)',
      [categoria, tipo_reciclagem, quantidade, localizacao, usuario_id]
    );

    // B. Soma 5 pontos (COALESCE garante que se estiver vazio, vira 0 antes de somar)
    await pool.query(
      'UPDATE usuarios SET pontos = COALESCE(pontos, 0) + 5 WHERE id = $1',
      [usuario_id]
    );

    console.log(`✅ Coleta registrada e +5 pontos para o usuário ${usuario_id}`);
    return res.status(201).json({ message: "Coleta registrada e +5 pontos ganhos!" });
  } catch (err) {
    console.error("❌ Erro ao registrar coleta/pontos:", err);
    return res.status(500).json({ error: "Erro ao registrar coleta." });
  }
});

// 4. Listar Histórico Completo
routes.get('/residuos/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const coletas = await pool.query(
      'SELECT id, categoria, tipo_reciclagem, quantidade, localizacao, data_descarte FROM residuos WHERE usuario_id = $1 ORDER BY id DESC',
      [usuario_id]
    );
    return res.json(coletas.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar histórico." });
  }
});

// 5. Buscar Dados do Usuário (Configurações e Pontos da Home) - ATUALIZADO
routes.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Adicionado "pontos" no SELECT para a Home conseguir exibir
    const usuario = await pool.query('SELECT nome, email, cpf, pontos FROM usuarios WHERE id = $1', [id]);
    if (usuario.rows.length > 0) {
      return res.json(usuario.rows[0]);
    }
    return res.status(404).json({ error: "Usuário não encontrado." });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar dados do perfil." });
  }
});

module.exports = routes;