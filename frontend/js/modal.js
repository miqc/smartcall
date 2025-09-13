// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openNewTicketModalBtn');
    const modal = document.getElementById('newTicketModal');
    
    if (!openModalBtn || !modal) return;

    // MUDANÇA PRINCIPAL AQUI: Seleciona os botões pelas novas classes
    const closeButtons = modal.querySelectorAll('.modal-close-x, .modal-close-btn');

    const openModal = () => {
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    openModalBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal();
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});