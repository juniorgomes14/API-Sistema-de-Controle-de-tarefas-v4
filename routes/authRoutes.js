const pool = require('../db');

// Função para criar uma nova tarefa
exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    // Validação básica dos dados de entrada
    if (!title || !description) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }

    try {
        const query = 'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [title, description, userId]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ error: 'Falha ao criar tarefa' });
    }
};

// Função para obter todas as tarefas de um usuário
exports.getTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao recuperar tarefas:', error);
        res.status(500).json({ error: 'Falha ao recuperar tarefas' });
    }
};

// Função para editar uma tarefa existente
exports.editTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    // Validação dos dados de entrada
    if (!title || !description) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }

    try {
        // Verificar se a tarefa existe e se o usuário é o proprietário
        const taskQuery = 'SELECT id, user_id FROM tasks WHERE id = $1';
        const taskResult = await pool.query(taskQuery, [id]);

        if (taskResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        const task = taskResult.rows[0];

        if (task.user_id !== userId) {
            return res.status(403).json({ error: 'Não autorizado a editar esta tarefa' });
        }

        // Atualizar a tarefa
        const updateQuery = 'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *';
        const updateResult = await pool.query(updateQuery, [title, description, id]);

        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error('Erro ao editar tarefa:', error);
        res.status(500).json({ error: 'Falha ao editar tarefa' });
    }
};

// Função para excluir uma tarefa existente
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Verificar se a tarefa existe e se o usuário é o proprietário
        const taskQuery = 'SELECT id, user_id FROM tasks WHERE id = $1';
        const taskResult = await pool.query(taskQuery, [id]);

        if (taskResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        const task = taskResult.rows[0];

        if (task.user_id !== userId) {
            return res.status(403).json({ error: 'Não autorizado a excluir esta tarefa' });
        }

        // Deletar a tarefa
        const deleteQuery = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
        await pool.query(deleteQuery, [id]);

        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        res.status(500).json({ error: 'Falha ao excluir tarefa' });
    }
};
