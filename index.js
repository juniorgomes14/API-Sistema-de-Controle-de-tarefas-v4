// Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Configure passport
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session using a secret from environment variable
app.use(session({ 
    secret: process.env.SESSION_SECRET, // Usar a variável de ambiente
    resave: false, 
    saveUninitialized: false 
}));

// Initialize passport    
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

// Middleware for error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
