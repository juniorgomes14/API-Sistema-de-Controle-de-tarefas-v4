// Carregar as variáveis de ambiente do arquivo .env
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Testar a conexão com o banco de dados
pool.connect()
    .then(() => console.log('Conectado ao banco de dados'))
    .catch(err => console.error('Erro ao conectar ao banco de dados', err.stack));

module.exports = pool;
