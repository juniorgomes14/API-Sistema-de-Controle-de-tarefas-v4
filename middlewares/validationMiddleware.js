const { body, validationResult } = require('express-validator');

// Função reutilizável para verificar erros
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validação para registro de usuário
const validateRegistration = [
    body('username')
        .notEmpty().withMessage('Nome de usuário é obrigatório')
        .isLength({ min: 3 }).withMessage('Nome de usuário deve ter no mínimo 3 caracteres')
        .trim(),  // Remove espaços em branco antes e depois
    body('password')
        .notEmpty().withMessage('Senha é obrigatória')
        .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
        .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula') // Valida maiúsculas
        .matches(/[0-9]/).withMessage('A senha deve conter pelo menos um número') // Valida números
        .matches(/[\W_]/).withMessage('A senha deve conter pelo menos um caractere especial') // Valida caracteres especiais
        .trim(),
    handleValidationErrors  // Chama a função para verificar os erros
];

// Validação para criação e edição de tarefas
const validateTask = [
    body('title')
        .notEmpty().withMessage('Título é obrigatório')
        .isLength({ min: 3, max: 100 }).withMessage('Título deve ter entre 3 e 100 caracteres')
        .trim(),  // Remove espaços em branco antes e depois
    body('description')
        .notEmpty().withMessage('Descrição é obrigatória')
        .isLength({ min: 10 }).withMessage('Descrição deve ter no mínimo 10 caracteres')
        .trim(),  // Remove espaços em branco antes e depois
    handleValidationErrors  // Chama a função para verificar os erros
];

module.exports = { 
    validateRegistration, 
    validateTask 
};
