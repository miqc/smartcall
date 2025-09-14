// @ts-nocheck
import { showToast } from './toasts.js';
// 1. Unificar todas as importações necessárias aqui
import { 
    alterarSenha, 
    atualizarPerfil, 
    getUsuarios, 
    editarUsuario, 
    excluirUsuario 
} from './services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. DECLARAÇÃO DE TODOS OS ELEMENTOS ---
    const userTableBody = document.getElementById('user-table-body');
    const editModal = document.getElementById('editUserModal');
    const deleteModal = document.getElementById('deleteUserModal');
    const editUserForm = document.getElementById('edit-user-form');
    const tabs = document.querySelectorAll('.settings-tabs li a');
    const panes = document.querySelectorAll('.settings-pane');
    const formAlterarSenha = document.getElementById('form-alterar-senha');
    const formPerfil = document.getElementById('form-perfil-publico');

    // --- 3. FUNÇÕES ---

    // Função para carregar usuários
    async function carregarUsuarios() {
        // ... (a sua função carregarUsuarios está correta, vamos mantê-la)
        if (!userTableBody) return;
        userTableBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
        try {
            const usuarios = await getUsuarios();
            userTableBody.innerHTML = ''; 
            if (usuarios.length === 0) {
                userTableBody.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>';
                return;
            }
            usuarios.forEach(user => {
                const tr = document.createElement('tr');
                tr.dataset.userId = user.id;
                tr.dataset.userName = user.nomeCompleto;
                tr.dataset.userEmail = user.email;
                tr.dataset.userRole = user.cargo;

                let badgeClass = 'status-closed';
                if (user.cargo === 'Administrador') badgeClass = 'status-open';
                if (user.cargo === 'Tecnico') badgeClass = 'status-progress';

                tr.innerHTML = `
                    <td>${user.nomeCompleto}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${badgeClass}">${user.cargo}</span></td>
                    <td>
                        <button class="action-btn edit-user-btn">Alterar</button>
                        <button class="action-btn delete-user-btn">Excluir</button>
                    </td>
                `;
                userTableBody.appendChild(tr);
            });
        } catch (error) {
            userTableBody.innerHTML = `<tr><td colspan="4" class="error-message">${error.message}</td></tr>`;
        }
    }

    // --- 4. CONFIGURAÇÃO DOS EVENTOS ---

    // Evento para troca de abas
    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            tabs.forEach(t => t.parentElement.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            tab.parentElement.classList.add('active');
            const targetPane = document.querySelector(tab.dataset.target);
            if (targetPane) targetPane.classList.add('active');
            if (tab.dataset.target === '#usuarios-content') {
                carregarUsuarios();
            }
        });
    });

    // Delegação de eventos para a tabela de usuários (Editar e Excluir)
    if (userTableBody) {
        userTableBody.addEventListener('click', (event) => {
            const editBtn = event.target.closest('.edit-user-btn');
            const deleteBtn = event.target.closest('.delete-user-btn');

            if (editBtn) {
                const userRow = editBtn.closest('tr');
                // Preenche o modal de edição
                document.getElementById('user-name').value = userRow.dataset.userName;
                document.getElementById('user-email').value = userRow.dataset.userEmail;
                document.getElementById('user-role').value = userRow.dataset.userRole;
                if(editUserForm) {
                    editUserForm.dataset.editingUserId = userRow.dataset.userId;
                    // Guarda o nome original para comparar depois
                    editUserForm.dataset.originalUserName = userRow.dataset.userName;
                }
                editModal.classList.add('active');
            }

            if (deleteBtn) {
                const userRow = deleteBtn.closest('tr');
                // Preenche o modal de exclusão
                document.getElementById('user-name-to-delete').textContent = userRow.dataset.userName;
                document.getElementById('confirmDeleteBtn').dataset.userIdToDelete = userRow.dataset.userId;
                deleteModal.classList.add('active');
            }
        });
    }

    // Evento para o formulário de EDIÇÃO de usuário
    if (editUserForm) {
        editUserForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userId = editUserForm.dataset.editingUserId;
            const originalUserName = editUserForm.dataset.originalUserName;
            const dadosUsuario = {
                nomeCompleto: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                cargo: document.getElementById('user-role').value
            };

            try {
                const resultado = await editarUsuario(userId, dadosUsuario);
                editModal.classList.remove('active');
                showToast(resultado.message, 'success');

                // Se o usuário editado for o mesmo que está logado, atualiza a interface
                if (localStorage.getItem('userName') === originalUserName) {
                    localStorage.setItem('userName', dadosUsuario.nomeCompleto);
                    document.getElementById('userNameDisplay').textContent = dadosUsuario.nomeCompleto;
                    document.getElementById('welcomeUserName').textContent = `Bem-vindo, ${dadosUsuario.nomeCompleto}!`;
                }
                carregarUsuarios(); // Recarrega a lista
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // Evento para o modal de EXCLUSÃO de usuário
    if (deleteModal) {
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        confirmDeleteBtn.addEventListener('click', async () => {
            const userId = confirmDeleteBtn.dataset.userIdToDelete;
            try {
                const resultado = await excluirUsuario(userId);
                deleteModal.classList.remove('active');
                showToast(resultado.message, 'success');
                carregarUsuarios(); // Recarrega a lista
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // Eventos para fechar os modais
    [editModal, deleteModal].forEach(modal => {
        if (modal) {
            const closeBtns = modal.querySelectorAll('.modal-close-x, .modal-close-btn');
            closeBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('active')));
            modal.addEventListener('click', (event) => {
                if (event.target === modal) modal.classList.remove('active');
            });
        }
    });

    // Lógica do formulário de PERFIL
    if (formPerfil) {
        // ... (seu código do formPerfil continua aqui, está correto)
        const nomeCompletoInput = document.getElementById('nome-completo');
        const emailInput = document.getElementById('email');
        nomeCompletoInput.value = localStorage.getItem('userName') || '';
        emailInput.value = localStorage.getItem('userEmail') || '';

        formPerfil.addEventListener('submit', async (event) => {
            event.preventDefault();
            const dadosPerfil = {
                nomeCompleto: nomeCompletoInput.value,
                email: localStorage.getItem('userEmail') // Email não é editável
            };
            try {
                const resultado = await atualizarPerfil(dadosPerfil);
                localStorage.setItem('userName', resultado.nome);
                document.getElementById('userNameDisplay').textContent = resultado.nome;
                document.getElementById('welcomeUserName').textContent = `Bem-vindo, ${resultado.nome}!`;
                showToast(resultado.message, 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // Lógica do formulário de ALTERAR SENHA
    if (formAlterarSenha) {
        // ... (seu código do formAlterarSenha continua aqui, está correto)
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
            allInputs.forEach(clearError);
            let isValid = true;
            if (!senhaAtualInput.value) { showError(senhaAtualInput, 'Preencha este campo.'); isValid = false; }
            if (!novaSenhaInput.value) { showError(novaSenhaInput, 'Preencha este campo.'); isValid = false; }
            if (novaSenhaInput.value !== confirmarSenhaInput.value) { showError(confirmarSenhaInput, 'As senhas não coincidem.'); isValid = false; }
            if (!isValid) return;
            const dadosSenha = {
                senhaAtual: senhaAtualInput.value,
                novaSenha: novaSenhaInput.value,
                confirmarNovaSenha: confirmarSenhaInput.value
            };
            try {
                const resultado = await alterarSenha(dadosSenha);
                showToast(resultado.message || 'Senha alterada com sucesso!', 'success');
                formAlterarSenha.reset();
            } catch (error) {
                showError(senhaAtualInput, error.message);
            }
        });
    }
});

