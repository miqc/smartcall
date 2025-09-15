// @ts-nocheck
import { registrar } from './services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('password');
    const confirmarSenhaInput = document.getElementById('confirm-password');
    const allInputs = [nomeInput, emailInput, senhaInput, confirmarSenhaInput];

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
    
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        allInputs.forEach(input => clearError(input));

        let isValid = true;
        
        // --- VALIDAÇÃO DO NOME ---
        if (!nomeInput.value) {
            showError(nomeInput, 'Preencha este campo.');
            isValid = false;
        } else if (/^\d+$/.test(nomeInput.value)) { // <-- NOVA VERIFICAÇÃO: Nome não pode ser só números
            showError(nomeInput, 'O nome não pode conter apenas números.');
            isValid = false;
        }

        // --- VALIDAÇÃO DO EMAIL ---
        if (!emailInput.value) {
            showError(emailInput, 'Preencha este campo.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Por favor, insira um email válido.');
            isValid = false;
        }

        // --- VALIDAÇÃO DA SENHA ---
        if (!senhaInput.value) {
            showError(senhaInput, 'Preencha este campo.');
            isValid = false;
        } else if (senhaInput.value.length < 6) { // <-- NOVA VERIFICAÇÃO: Mínimo de 6 caracteres
            showError(senhaInput, 'A senha deve ter no mínimo 6 caracteres.');
            isValid = false;
        }

        // --- VALIDAÇÃO DA CONFIRMAÇÃO DE SENHA ---
        if (!confirmarSenhaInput.value) {
            showError(confirmarSenhaInput, 'Preencha este campo.');
            isValid = false;
        } else if (senhaInput.value !== confirmarSenhaInput.value) {
            showError(confirmarSenhaInput, 'As senhas não coincidem.');
            isValid = false;
        }


        if (!isValid) return;

        // Se o formulário for válido, tenta registrar...
        const dadosUsuario = { 
            nomeCompleto: nomeInput.value, 
            email: emailInput.value, 
            senha: senhaInput.value, 
            cargo: "Usuário"
        };

        try {
            const data = await registrar(dadosUsuario);
            alert(data.message || 'Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        } catch (error) {
            showError(emailInput, error.message);
        }
    });
});