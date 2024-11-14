const pool = require('../db');
const bcrypt = require('bcryptjs');

class User {
    // Método para criar um novo usuário
    static async create(username, email, password) {
        try {
            // Validação do formato de email
            if (!this.isValidEmail(email)) {
                throw new Error('Formato de email inválido');
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Inserir usuário no banco de dados com transação
            const query = `
                INSERT INTO users (username, email, password) 
                VALUES ($1, $2, $3) 
                RETURNING id, username, email
            `;

            const result = await pool.query(query, [username, email, hashedPassword]);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw new Error('Falha ao criar usuário');
        }
    }

    // Método para encontrar usuário por email
    static async findByEmail(email) {
        try {
            const query = 'SELECT id, username, email, password FROM users WHERE email = $1';
            const result = await pool.query(query, [email]);
            return result.rows[0]; // Retorna o usuário ou undefined se não encontrado
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw new Error('Erro ao buscar usuário');
        }
    }

    // Método para encontrar usuário por ID
    static async findById(id) {
        try {
            const query = 'SELECT id, username, email FROM users WHERE id = $1';
            const result = await pool.query(query, [id]);
            return result.rows[0]; // Retorna o usuário ou undefined se não encontrado
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw new Error('Erro ao buscar usuário');
        }
    }

    // Método para validar senha
    static async validatePassword(user, password) {
        try {
            return await bcrypt.compare(password, user.password);
        } catch (error) {
            console.error('Erro ao validar senha:', error);
            throw new Error('Erro ao validar senha');
        }
    }

    // Método de validação de formato de email
    static isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
}

module.exports = User;
