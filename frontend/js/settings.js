// @ts-nocheck
import { showToast } from './toasts.js';
import { alterarSenha, atualizarPerfil, getUsuarios } from './services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA CARREGAR USUÁRIOS ---
    const userTableBody = document.getElementById('user-table-body');
    
    async function carregarUsuarios() {
        if (!userTableBody) return;
        userTableBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>'; // Feedback de carregamento

        try {
            const usuarios = await getUsuarios();
            userTableBody.innerHTML = ''; // Limpa a tabela

            if (usuarios.length === 0) {
                userTableBody.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>';
                return;
            }

            usuarios.forEach(user => {
                const tr = document.createElement('tr');
                tr.dataset.userId = user.id;
                tr.dataset.userName = user.nomeCompleto;

                // Adapta a cor do badge com base no cargo
                let badgeClass = 'status-closed'; // cinza padrão
                if (user.cargo === 'Administrador') badgeClass = 'status-open'; // azul
                if (user.cargo === 'Tecnico') badgeClass = 'status-progress'; // amarelo

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

   // --- LÓGICA CORRETA E UNIFICADA PARA TROCA DE ABAS ---
        const tabs = document.querySelectorAll('.settings-tabs li a');
        const panes = document.querySelectorAll('.settings-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                event.preventDefault();

                // 1. Lógica visual: remove a classe 'active' de todos
                tabs.forEach(t => t.parentElement.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                // 2. Lógica visual: adiciona a classe 'active' apenas no item clicado
                tab.parentElement.classList.add('active');
                const targetPane = document.querySelector(tab.dataset.target);
                if (targetPane) {
                    targetPane.classList.add('active');
                }

                // 3. Lógica de dados: verifica se a aba de usuários foi clicada e carrega os dados
                if (tab.dataset.target === '#usuarios-content') {
                    carregarUsuarios();
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

    const formPerfil = document.getElementById('form-perfil-publico');

    if (formPerfil) {
        const nomeCompletoInput = document.getElementById('nome-completo');
        const emailInput = document.getElementById('email');

        // Pré-preenche o formulário com os dados do localStorage ao carregar a página
        nomeCompletoInput.value = localStorage.getItem('userName') || '';
        // Poderíamos fazer o mesmo para o email se o tivéssemos salvo no login

        formPerfil.addEventListener('submit', async (event) => {
            event.preventDefault();

            const dadosPerfil = {
                nomeCompleto: nomeCompletoInput.value,
                email: emailInput.value
            };

            try {
                // Importe a função 'atualizarPerfil' no topo do arquivo!
                const resultado = await atualizarPerfil(dadosPerfil);

                // Atualiza o nome no localStorage com o novo valor
                localStorage.setItem('userName', resultado.nome);

                // Atualiza o nome exibido na tela em tempo real
                document.getElementById('userNameDisplay').textContent = resultado.nome;
                document.getElementById('welcomeUserName').textContent = `Bem-vindo, ${resultado.nome}!`;

                showToast(resultado.message, 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    const obfuscateEmail = (email) => {
        if (!email || email.indexOf('@') === -1) {
            return '';
         }

    const [user, domain] = email.split('@');
        if (user.length <= 3) {
            return `${user.substring(0, 1)}**@${domain}`;
        }

    const start = user.substring(0, 3);
         return `${start}***@${domain}`;
     };

    const userEmail = localStorage.getItem('userEmail');
    const emailInput = document.getElementById('email');
        if (emailInput && userEmail) {
            emailInput.value = obfuscateEmail(userEmail);
        }


});