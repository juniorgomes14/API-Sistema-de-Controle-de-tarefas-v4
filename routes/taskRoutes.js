const express = require('express');
const { createTask, getTasks, editTask, deleteTask } = require('../controllers/taskController');
const { isAuthenticated }=require('../middlewares/authMiddleware')

const router = express.Router();

// Middleware de autenticação aplicado a todas as rotas
router.use(isAuthenticated);

// Rotas de tarefas
router.post('/create', createTask);        // Criar tarefa
router.get('/', getTasks);                  // Obter todas as tarefas
router.put('/:id/edit',editTask);          // Editar tarefa
router.delete('/:id/delete',deleteTask);   // Deletar tarefa

module.exports = router;
