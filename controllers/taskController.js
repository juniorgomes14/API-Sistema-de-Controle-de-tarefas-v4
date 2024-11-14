const pool = require('../db');

// Função para criar uma nova tarefa
exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    // Validação de entrada
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, userId]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        console.error('Error creating task:', error);  // Log do erro
        res.status(500).json({ error: 'Task creation failed' });
    }
};

// Função para obter todas as tarefas de um usuário
exports.getTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
        res.json(tasks.rows);
    } catch (error) {
        console.error('Error retrieving tasks:', error);  // Log do erro
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

// Função para editar uma tarefa
exports.editTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    // Validação de entrada
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        // Verifica se a tarefa existe
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

        if (task.rows.length > 0 && task.rows[0].user_id === userId) {
            // Atualiza a tarefa
            const updatedTask = await pool.query(
                'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
                [title, description, id]
            );
            res.json(updatedTask.rows[0]);
        } else {
            res.status(403).json({ error: 'Unauthorized to edit this task or task not found' });
        }
    } catch (error) {
        console.error('Error updating task:', error);  // Log do erro
        res.status(500).json({ error: 'Task update failed' });
    }
};

// Função para excluir uma tarefa
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Verifica se a tarefa existe
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

        if (task.rows.length > 0 && task.rows[0].user_id === userId) {
            // Exclui a tarefa
            await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
            res.json({ message: 'Task deleted successfully' });
        } else {
            res.status(403).json({ error: 'Unauthorized to delete this task or task not found' });
        }
    } catch (error) {
        console.error('Error deleting task:', error);  // Log do erro
        res.status(500).json({ error: 'Task deletion failed' });
    }
};
