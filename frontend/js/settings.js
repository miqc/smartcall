// @ts-nocheck
import { alterarSenha } from './services/apiService.js';
import { showToast } from './toasts.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA PARA TROCA DE ABAS ---
    const tabs = document.querySelectorAll('.settings-tabs li a');
    const panes = document.querySelectorAll('.settings-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            tabs.forEach(t => t.parentElement.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            tab.parentElement.classList.add('active');
            const targetPane = document.querySelector(tab.dataset.target);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // --- LÓGICA PARA O MODAL DE EDIÇÃO ---
    const editModal = document.getElementById('editUserModal');
    if (editModal) {
        const openEditModalBtns = document.querySelectorAll('.edit-user-btn');
        const closeEditModalBtns = editModal.querySelectorAll('.modal-close-x, .modal-close-btn');

        openEditModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                editModal.classList.add('active');
            });
        });
        closeEditModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                editModal.classList.remove('active');
            });
        });
        editModal.addEventListener('click', (event) => {
            if(event.target === editModal) editModal.classList.remove('active');
        });
    }

    // --- NOVA LÓGICA PARA O MODAL DE EXCLUSÃO ---
    const deleteModal = document.getElementById('deleteUserModal');
    if (deleteModal) {
        const openDeleteModalBtns = document.querySelectorAll('.delete-user-btn');
        const closeDeleteModalBtns = deleteModal.querySelectorAll('.modal-close-x, .modal-close-btn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const userNameToDeleteSpan = document.getElementById('user-name-to-delete');

        openDeleteModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Encontra a linha (tr) pai do botão clicado
                const userRow = btn.closest('tr');
                const userName = userRow.dataset.userName;
                const userId = userRow.dataset.userId;

                // Atualiza o modal com o nome do usuário
                userNameToDeleteSpan.textContent = userName;
                // Guarda o ID do usuário no botão de confirmação
                confirmDeleteBtn.dataset.userIdToDelete = userId;

                // Abre o modal
                deleteModal.classList.add('active');
            });
        });

        closeDeleteModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                deleteModal.classList.remove('active');
            });
        });

        confirmDeleteBtn.addEventListener('click', () => {
            const userId = confirmDeleteBtn.dataset.userIdToDelete;
            // Lógica de exclusão real viria aqui (chamada de API)
            console.log(`Simulando exclusão do usuário com ID: ${userId}`);
            alert(`Usuário com ID ${userId} excluído (simulação).`);
            deleteModal.classList.remove('active');
            // Aqui você também removeria a linha da tabela da interface
        });

        deleteModal.addEventListener('click', (event) => {
            if(event.target === deleteModal) deleteModal.classList.remove('active');
        });
    }

   // --- LÓGICA PARA O FORMULÁRIO DE ALTERAR SENHA ---
    const formAlterarSenha = document.getElementById('form-alterar-senha');

    if (formAlterarSenha) {
        // Funções de erro (podemos reutilizar as do login/cadastro se estivessem em um arquivo comum)
        const showError = (input, message) => {
            const formGroup = input.parentElement;
            formGroup.classList.add('has-error');
            const errorElement = formGroup.querySelector('.error-message');
            errorElement.textContent = message;
        };
        const clearError = (input) => {
            const formGroup = input.parentElement;
            formGroup.classList.remove('has-error');
            const errorElement = formGroup.querySelector('.error-message');
            errorElement.textContent = '';
        };

        formAlterarSenha.addEventListener('submit', async (event) => {
            event.preventDefault();

            const senhaAtualInput = document.getElementById('senha-atual');
            const novaSenhaInput = document.getElementById('nova-senha');
            const confirmarSenhaInput = document.getElementById('confirmar-nova-senha');
            const allInputs = [senhaAtualInput, novaSenhaInput, confirmarSenhaInput];

            // Limpa erros antigos
            allInputs.forEach(clearError);

            // Validação no frontend
            let isValid = true;
            if (!senhaAtualInput.value) {
                showError(senhaAtualInput, 'Preencha este campo.');
                isValid = false;
            }
            if (!novaSenhaInput.value) {
                showError(novaSenhaInput, 'Preencha este campo.');
                isValid = false;
            } else if (novaSenhaInput.value.length < 6) {
                showError(novaSenhaInput, 'A nova senha deve ter no mínimo 6 caracteres.');
                isValid = false;
            }
            if (novaSenhaInput.value !== confirmarSenhaInput.value) {
                showError(confirmarSenhaInput, 'As senhas não coincidem.');
                isValid = false;
            }
            
            if (!isValid) return;

            // Se for válido, envia para a API
            const dadosSenha = {
                senhaAtual: senhaAtualInput.value,
                novaSenha: novaSenhaInput.value,
                confirmarNovaSenha: confirmarSenhaInput.value
            };

            try {
                const resultado = await alterarSenha(dadosSenha);
                showToast(resultado.message || 'Senha alterada com sucesso!', 'success');
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
                formAlterarSenha.reset(); // Limpa o formulário
                console.log("bbbbbbbbbbbbbbbbbbbbb")
            } catch (error) {
                // Mostra o erro da API (ex: senha atual incorreta) no primeiro campo
                showError(senhaAtualInput, error.message);
            }
        });
    }

});