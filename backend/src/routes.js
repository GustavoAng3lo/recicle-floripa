/* eslint-disable no-undef, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const express = require('express');
const routes = express.Router();
const pool = require('./database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// Rota de teste
routes.get('/', (req, res) => {
  return res.json({ message: "API Recicle Floripa Online!" });
});

// 1. Cadastro de Usuário
routes.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cpf } = req.body;

  const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,8}$/.test(senha);
  if (!senhaValida) {
    return res.status(400).json({ error: "A senha deve ter entre 6 e 8 caracteres, incluir maiúsculo, minúsculo e um caractere especial." });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, cpf, pontos) VALUES ($1, $2, $3, $4, 0) RETURNING id, nome, email',
      [nome, email, senhaHash, cpf]
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
    const resultado = await pool.query(
      'SELECT id, nome, email, senha FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    return res.json({ message: "Login realizado!", user: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor ao tentar logar." });
  }
});

// 3. Registrar Coleta Inteligente + Somar 5 Pontos
routes.post('/residuos', async (req, res) => {
  const { categoria, tipo_reciclagem, quantidade, localizacao, usuario_id } = req.body;

  try {
    await pool.query(
      'INSERT INTO residuos (categoria, tipo_reciclagem, quantidade, localizacao, usuario_id, data_descarte) VALUES ($1, $2, $3, $4, $5, NOW())',
      [categoria, tipo_reciclagem, quantidade, localizacao, usuario_id]
    );

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

// 5. Buscar Dados do Usuário
routes.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await pool.query('SELECT nome, email, cpf, pontos FROM usuarios WHERE id = $1', [id]);
    if (usuario.rows.length > 0) {
      return res.json(usuario.rows[0]);
    }
    return res.status(404).json({ error: "Usuário não encontrado." });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar dados do perfil." });
  }
});

// 6. Atualizar Nome do Usuário
routes.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome || nome.trim().length === 0) {
    return res.status(400).json({ error: "Nome não pode ser vazio." });
  }
  try {
    await pool.query('UPDATE usuarios SET nome = $1 WHERE id = $2', [nome.trim(), id]);
    return res.json({ message: "Perfil updated com sucesso." });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar perfil." });
  }
});

// 7. Excluir um registro de coleta e subtrair 5 pontos do usuário
routes.delete('/residuos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Busca quem é o dono desse descarte na tabela residuos
    const buscaResiduo = await pool.query('SELECT usuario_id FROM residuos WHERE id = $1', [id]);

    if (buscaResiduo.rows.length === 0) {
      return res.status(404).json({ error: "Registro de coleta não encontrado." });
    }

    const { usuario_id } = buscaResiduo.rows[0];

    // 2. Deleta o registro de coleta do banco de dados
    await pool.query('DELETE FROM residuos WHERE id = $1', [id]);

    // 3. Subtrai 5 pontos do usuário dono (impedindo que fique menor que zero)
    await pool.query(
      'UPDATE usuarios SET pontos = GREATEST(0, COALESCE(pontos, 0) - 5) WHERE id = $1',
      [usuario_id]
    );

    return res.json({ message: "Registro de coleta excluído e 5 pontos deduzidos!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir descarte." });
  }
});

module.exports = routes;