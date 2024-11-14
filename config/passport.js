const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../db');

module.exports = function (passport) {
    // Configuração da estratégia Local do Passport
    passport.use(
        new LocalStrategy(
            async (username, password, done) => {
                try {
                    // Busca o usuário no banco de dados pelo nome de usuário
                    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
                    const user = result.rows[0];

                    if (!user) {
                        // Caso o usuário não seja encontrado
                        return done(null, false, { message: 'Usuário não encontrado.' });
                    }

                    // Comparação da senha fornecida com a armazenada no banco
                    const isMatch = await bcrypt.compare(password, user.password);

                    if (isMatch) {
                        // Caso as senhas correspondam, retorna o usuário
                        return done(null, user);
                    } else {
                        // Caso as senhas não correspondam
                        return done(null, false, { message: 'Senha incorreta.' });
                    }
                } catch (error) {
                    // Em caso de erro ao consultar o banco de dados ou qualquer outra falha
                    return done(error);
                }
            }
        )
    );

    // Serializa o usuário para armazenar o ID na sessão
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Desserializa o usuário a partir do ID armazenado na sessão
    passport.deserializeUser(async (id, done) => {
        try {
            // Busca o usuário no banco pelo ID
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            const user = result.rows[0];

            if (!user) {
                // Caso o usuário não seja encontrado, encerra a sessão
                return done(new Error('Usuário não encontrado'), null);
            }

            // Retorna o usuário
            done(null, user);
        } catch (error) {
            // Em caso de erro ao consultar o banco
            done(error, null);
        }
    });
};
