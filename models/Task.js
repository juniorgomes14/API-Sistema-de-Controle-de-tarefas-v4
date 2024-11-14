const pool = require('../db');

class Task {
    // Função auxiliar para execução de queries
    static async executeQuery(query, params) {
        try {
            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw new Error('Erro ao executar operação no banco de dados');
        }
    }

    // Criar nova tarefa
    static async create(userId, title, description, status = 'pendente') {
        const query = `
            INSERT INTO tasks (user_id, title, description, status) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, title, description, status, created_at
        `;
        const params = [userId, title, description, status];
        const task = await this.executeQuery(query, params);
        return task[0];
    }

    // Buscar todas as tarefas de um usuário
    static async findByUserId(userId) {
        const query = 'SELECT id, title, description, status, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
        const tasks = await this.executeQuery(query, [userId]);
        return tasks;
    }

    // Atualizar tarefa
    static async update(taskId, userId, updateData) {
        const { title, description, status } = updateData;
        const query = `
            UPDATE tasks 
            SET title = $1, description = $2, status = $3 
            WHERE id = $4 AND user_id = $5 
            RETURNING id, title, description, status, updated_at
        `;
        const params = [title, description, status, taskId, userId];
        const updatedTask = await this.executeQuery(query, params);
        return updatedTask[0];
    }

    // Deletar tarefa
    static async delete(taskId, userId) {
        const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id, title, description, status';
        const deletedTask = await this.executeQuery(query, [taskId, userId]);
        return deletedTask[0];  // Retorna a tarefa deletada
    }

    // Buscar tarefa por ID e usuário
    static async findByIdAndUser(taskId, userId) {
        const query = 'SELECT id, title, description, status FROM tasks WHERE id = $1 AND user_id = $2';
        const task = await this.executeQuery(query, [taskId, userId]);
        return task[0];  // Retorna a tarefa encontrada ou undefined se não encontrada
    }
}

module.exports = Task;
