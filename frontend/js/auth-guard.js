// Esta é uma função autoexecutável (IIFE).
// Ela roda imediatamente assim que o script é carregado.
(() => {
    // Busca o token de autenticação no armazenamento local do navegador
    const token = localStorage.getItem('authToken');

    // Se o token NÃO for encontrado...
    if (!token) {
        // ...redireciona o usuário para a página de login.
        // O caminho 'login.html' funciona porque todas as nossas páginas
        // do painel estão na mesma pasta.
        window.location.href = 'login.html';
    }
})();