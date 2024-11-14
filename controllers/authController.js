const bcrypt = require('bcryptjs');
const pool = require('../db');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Validação simples de entrada
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Verifica se o usuário já existe
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo usuário no banco de dados
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        // Retorna os dados do usuário recém-criado
        res.status(201).json(newUser.rows[0]);

    } catch (error) {
        console.error(error); // Log do erro no servidor para debugar
        res.status(500).json({ error: 'User registration failed. Please try again.' });
    }
};

exports.login = (req, res) => {
    // Se o login for bem-sucedido, o Passport já terá configurado o `req.user`
    res.json({ message: 'Login successful', user: req.user });
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
};
