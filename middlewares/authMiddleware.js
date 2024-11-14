const pool = require('../db');  // Certifique-se de importar o pool de conexão com o banco de dados

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();  // Usuário autenticado, segue para a próxima rota ou middleware
    }
    // Caso o usuário não esteja autenticado, retorna erro 401
    return res.status(401).json({ error: 'Usuário não autenticado' });
};

// Middleware para verificar se o usuário é o criador da tarefa
const isTaskCreator = async (req, res, next) => {
    const { id } = req.params;  // Obtém o ID da tarefa a partir dos parâmetros da requisição
    const userId = req.user.id;  // Obtém o ID do usuário autenticado

    try {
        // Consulta no banco de dados para verificar se a tarefa existe e se o usuário é o criador
        const { rows } = await pool.query('SELECT user_id FROM tasks WHERE id = $1', [id]);

        // Verifica se a tarefa não foi encontrada
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        // Verifica se o usuário não é o criador da tarefa
        if (rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'Não autorizado a modificar esta tarefa' });
        }

        // Se o usuário for o criador da tarefa, segue para o próximo middleware ou rota
        next();
    } catch (error) {
        // Captura e loga o erro no servidor para diagnóstico
        console.error('Erro ao verificar se o usuário é o criador da tarefa:', error);
        return res.status(500).json({ error: 'Erro na verificação de permissão' });
    }
};

// Exportando os middlewares
module.exports = { 
    isAuthenticated, 
    isTaskCreator 
};
