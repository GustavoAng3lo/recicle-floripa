const express = require('express');
const routes = express.Router();
const pool = require('./database');
<<<<<<< HEAD
=======
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a

// Rota de teste
routes.get('/', (req, res) => {
  return res.json({ message: "API Recicle Floripa Online!" });
});

// 1. Cadastro de Usuário
routes.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cpf } = req.body;
<<<<<<< HEAD
=======

  const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,8}$/.test(senha);
  if (!senhaValida) {
    return res.status(400).json({ error: "A senha deve ter entre 6 e 8 caracteres, incluir maiúsculo, minúsculo e um caractere especial." });
  }

>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
  try {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, cpf, pontos) VALUES ($1, $2, $3, $4, 0) RETURNING id, nome, email',
<<<<<<< HEAD
      [nome, email, senha, cpf]
=======
      [nome, email, senhaHash, cpf]
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
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
<<<<<<< HEAD
    const usuario = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2', 
      [email, senha]
    );
    
    if (usuario.rows.length > 0) {
      return res.json({ message: "Login realizado!", user: usuario.rows[0] });
    } else {
=======
    const resultado = await pool.query(
      'SELECT id, nome, email, senha FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
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

<<<<<<< HEAD
// 3. Registrar Coleta Inteligente + Somar 5 Pontos
routes.post('/residuos', async (req, res) => {
  const { categoria, tipo_reciclagem, quantidade, localizacao, usuario_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO residuos (categoria, tipo_reciclagem, quantidade, localizacao, usuario_id) VALUES ($1, $2, $3, $4, $5)',
      [categoria, tipo_reciclagem, quantidade, localizacao, usuario_id]
    );

=======
// 3. Registrar Coleta Inteligente + Somar 5 Pontos (ATUALIZADO)
routes.post('/residuos', async (req, res) => {
  const { categoria, tipo_reciclagem, quantidade, localizacao, usuario_id } = req.body;

  try {
    // A. Salva a coleta
    await pool.query(
      'INSERT INTO residuos (categoria, tipo_reciclagem, quantidade, localizacao, usuario_id, data_descarte) VALUES ($1, $2, $3, $4, $5, NOW())',
      [categoria, tipo_reciclagem, quantidade, localizacao, usuario_id]
    );

    // B. Soma 5 pontos (COALESCE garante que se estiver vazio, vira 0 antes de somar)
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
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

<<<<<<< HEAD
// 5. Buscar Dados do Usuário
routes.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
=======
// 5. Buscar Dados do Usuário (Configurações e Pontos da Home) - ATUALIZADO
routes.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Adicionado "pontos" no SELECT para a Home conseguir exibir
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
    const usuario = await pool.query('SELECT nome, email, cpf, pontos FROM usuarios WHERE id = $1', [id]);
    if (usuario.rows.length > 0) {
      return res.json(usuario.rows[0]);
    }
    return res.status(404).json({ error: "Usuário não encontrado." });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar dados do perfil." });
  }
});

<<<<<<< HEAD
// 6. Atualizar Dados do Usuário (UPDATE do CRUD)
routes.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf } = req.body;
  try {
    const usuarioAtualizado = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, cpf = $3 WHERE id = $4 RETURNING id, nome, email, cpf',
      [nome, email, cpf, id]
    );
    return res.json({ message: "Perfil atualizado!", user: usuarioAtualizado.rows[0] });
  } catch (err) {
    console.error(err);
=======
// 6. Atualizar Nome do Usuário
routes.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome || nome.trim().length === 0) {
    return res.status(400).json({ error: "Nome não pode ser vazio." });
  }
  try {
    await pool.query('UPDATE usuarios SET nome = $1 WHERE id = $2', [nome.trim(), id]);
    return res.json({ message: "Perfil atualizado com sucesso." });
  } catch (err) {
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
    return res.status(500).json({ error: "Erro ao atualizar perfil." });
  }
});

<<<<<<< HEAD
// 7. Excluir um registro de coleta (DELETE do CRUD)
routes.delete('/residuos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM residuos WHERE id = $1', [id]);
    return res.json({ message: "Registro de coleta excluído com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir descarte." });
  }
});

=======
>>>>>>> 0fcd5da4ae08d5fea5fbc6bf8c56fd15aee1802a
module.exports = routes;