/* eslint-disable no-undef, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_tRa2SiZbP6BC@ep-curly-art-aches559-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
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

pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS data_nascimento DATE')
  .catch((err) => console.error('❌ ERRO AO CONFIGURAR DATA DE NASCIMENTO:', err.message));

module.exports = pool;