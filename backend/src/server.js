/* eslint-disable no-undef, @typescript-eslint/no-require-imports */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean),
]);

app.use(cors({
  origin: (origin, callback) => {
    const isCloudflareQuickTunnel = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/i.test(origin || '');
    callback(null, !origin || allowedOrigins.has(origin) || isCloudflareQuickTunnel);
  },
}));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(express.json({ limit: '12mb' }));
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});