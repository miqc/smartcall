// @ts-nocheck
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
});