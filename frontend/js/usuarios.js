// @ts-nocheck
import { showToast } from './toasts.js';
import { getUsuarios, editarUsuario } from './services/apiService.js';
import { atualizarPerfil } from './services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DECLARAÇÃO DE ELEMENTOS ---
    // Selecionamos todos os elementos importantes da página uma única vez
    const userTableBody = document.getElementById('user-table-body');
    const editModal = document.getElementById('editUserModal');
    const deleteModal = document.getElementById('deleteUserModal');
    const editUserForm = document.getElementById('edit-user-form');
    const tabs = document.querySelectorAll('.settings-tabs li a');
    const panes = document.querySelectorAll('.settings-pane');

    // --- 2. FUNÇÃO PRINCIPAL: CARREGAR USUÁRIOS DA API ---
    async function carregarUsuarios() {
        if (!userTableBody) return;
        userTableBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
        try {
            const usuarios = await getUsuarios();
            userTableBody.innerHTML = ''; // Limpa o "Carregando..."
            if (usuarios.length === 0) {
                userTableBody.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>';
                return;
            }
            usuarios.forEach(user => {
                const tr = document.createElement('tr');
                // Adiciona os dados do usuário à linha da tabela para fácil acesso
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

    // --- 3. CONFIGURAÇÃO DOS EVENTOS ---

    // Evento para a troca de abas
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
            // Só carrega os usuários se a aba correta for clicada
            if (tab.dataset.target === '#usuarios-content') {
                carregarUsuarios();
            }
        });
    });

    // Eventos na tabela de usuários (Delegação de Eventos)
    if (userTableBody) {
        userTableBody.addEventListener('click', (event) => {
            const editBtn = event.target.closest('.edit-user-btn');
            const deleteBtn = event.target.closest('.delete-user-btn');

            // Se o botão de EDITAR foi clicado
            if (editBtn && editModal) {
                const userRow = editBtn.closest('tr');
                document.getElementById('user-name').value = userRow.dataset.userName;
                document.getElementById('user-email').value = userRow.dataset.userEmail;
                document.getElementById('user-role').value = userRow.dataset.userRole;
                if(editUserForm) editUserForm.dataset.editingUserId = userRow.dataset.userId;
                editModal.classList.add('active');
            }

            // Se o botão de EXCLUIR foi clicado
            if (deleteBtn && deleteModal) {
                const userRow = deleteBtn.closest('tr');
                document.getElementById('user-name-to-delete').textContent = userRow.dataset.userName;
                document.getElementById('confirmDeleteBtn').dataset.userIdToDelete = userRow.dataset.userId;
                deleteModal.classList.add('active');
            }
        });
    }
    
    // Evento para SALVAR as alterações do modal de edição
    if (editUserForm) {
        editUserForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userId = editUserForm.dataset.editingUserId;
            if (!userId) return;

            const dadosUsuario = {
                nomeCompleto: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                cargo: document.getElementById('user-role').value
            };

        try {
            const resultado = await editarUsuario(userId, dadosUsuario);
            editModal.classList.remove('active');
            showToast(resultado.message, 'success');

            // Atualiza nome do usuário logado se necessário
            const loggedInUserName = localStorage.getItem('userName');
            const originalUserName = editUserForm.dataset.originalUserName;

            // Se o nome do usuário que acabamos de editar for o mesmo que está logado...
            if (loggedInUserName === originalUserName) {
                const newUserName = dadosUsuario.nomeCompleto;
                
                // 1. Atualiza o localStorage com o novo nome
                localStorage.setItem('userName', newUserName);

                // 2. Atualiza a interface em tempo real
                document.getElementById('userNameDisplay').textContent = newUserName;
                document.getElementById('welcomeUserName').textContent = `Bem-vindo, ${newUserName}!`;
            }
            carregarUsuarios();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
    }

    // Eventos para fechar TODOS os modais
    [editModal, deleteModal].forEach(modal => {
        if (modal) {
            const closeBtns = modal.querySelectorAll('.modal-close-x, .modal-close-btn');
            closeBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('active')));
            modal.addEventListener('click', (event) => {
                if (event.target === modal) modal.classList.remove('active');
            });
        }
    });

    // (Lógica do modal de exclusão continua aqui, se necessário)
});