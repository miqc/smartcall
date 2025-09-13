// @ts-nocheck
import { login } from './services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Função para mostrar o erro
    const showError = (input, message) => {
        const formGroup = input.parentElement;
        formGroup.classList.add('has-error');
        const errorElement = formGroup.querySelector('.error-message');
        errorElement.textContent = message;
    };

    // Função para limpar o erro
    const clearError = (input) => {
        const formGroup = input.parentElement;
        formGroup.classList.remove('has-error');
        const errorElement = formGroup.querySelector('.error-message');
        errorElement.textContent = '';
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário
        
        // Limpa erros antigos
        clearError(emailInput);
        clearError(passwordInput);

        // Validação
        let isValid = true;
        if (!emailInput.value) {
            showError(emailInput, 'Preencha este campo.');
            isValid = false;
        }
        if (!passwordInput.value) {
            showError(passwordInput, 'Preencha este campo.');
            isValid = false;
        }

        // Se o formulário não for válido, para aqui.
        if (!isValid) return;

        // Se for válido, tenta fazer o login (lógica que já tínhamos)
        try {
            const data = await login(emailInput.value, passwordInput.value);

            console.log('Dados recebidos do login:', data);

            // Salva o token no armazenamento local do navegador
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.nome);
            // ADICIONE ESTA LINHA
            localStorage.setItem('userRole', data.cargo);
            
            // Redireciona para o painel
            window.location.href = 'dashboard.html';

        } catch (error) {
            // Mostra o erro de login no campo de email para feedback
            showError(emailInput, 'Email ou senha incorretos.');
            showError(passwordInput, ' '); // Deixa a mensagem de senha vazia para não ser repetitivo
        }
    });
});