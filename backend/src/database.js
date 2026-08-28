/* eslint-disable no-undef, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ ERRO AO CONECTAR NO BANCO:', err.message);
  } else {
    console.log('✅ BANCO DE DADOS NA NUVEM CONECTADO COM SUCESSO!');
  }
});

module.exports = pool;