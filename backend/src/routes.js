const express = require('express');
const routes = express.Router();
const pool = require('./database'); // Importa a conexão que criamos no passo anterior

// Rota de teste
routes.get('/', (req, res) => {
  return res.json({ message: "API Recicle Floripa Online!" });
});

// Rota de Cadastro de Usuário (RF09)
routes.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cpf } = req.body;

  try {
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, cpf) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, senha, cpf]
    );
    return res.status(201).json(novoUsuario.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao cadastrar usuário. Verifique se o e-mail ou CPF já existem." });
  }
});

// Rota de Login (Simples para a Sprint 2)
routes.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
    
    if (usuario.rows.length > 0) {
      return res.json({ message: "Login realizado!", user: usuario.rows[0] });
    } else {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro no servidor." });
  }
});

// Rota para registrar resíduos (RF01)
routes.post('/residuos', async (req, res) => {
  const { categoria, quantidade, localizacao, usuario_id } = req.body;
  try {
    const novaColeta = await pool.query(
      'INSERT INTO residuos (categoria, quantidade, localizacao, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [categoria, quantidade, localizacao, usuario_id]
    );
    return res.status(201).json(novaColeta.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar coleta." });
  }
});

// Rota para listar coletas de um usuário específico
routes.get('/residuos/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const coletas = await pool.query(
      'SELECT * FROM residuos WHERE usuario_id = $1 ORDER BY id DESC',
      [usuario_id]
    );
    return res.json(coletas.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar histórico." });
  }
});

module.exports = routes;