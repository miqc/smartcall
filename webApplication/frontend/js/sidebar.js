// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {

    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRoleDisplay = document.getElementById('userRoleDisplay');

    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    if (userNameDisplay && userName) {
        userNameDisplay.textContent = userName;
    }
    if (userRoleDisplay && userRole) {
        userRoleDisplay.textContent = userRole;
    }

    // Seleciona o botão de sair pela sua classe
    const logoutButton = document.querySelector('.logout-button');

     const welcomeUserNameDisplay = document.getElementById('welcomeUserName');
    // Reutilizamos a variável 'userName' que já pegamos do localStorage
    if (welcomeUserNameDisplay && userName) {
        welcomeUserNameDisplay.textContent = `Bem-vindo(a), ${userName}!`;
    }

    // Se o botão existir na página...
    if (logoutButton) {
        // ...adiciona um evento de clique a ele.
        logoutButton.addEventListener('click', (event) => {
            // Previne que o link siga para o href, pois vamos controlar a ação
            event.preventDefault(); 

            // Remove os dados de autenticação do armazenamento local
            localStorage.clear();


            // Redireciona para a página de login
            window.location.href = 'index.html';
        });
    }

});