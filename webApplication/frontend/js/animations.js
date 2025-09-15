// @ts-nocheck
// Executa o código quando o conteúdo da página estiver pronto
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA ANIMAÇÃO DO HERO (JÁ ESTAVA AQUI) ---
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');

    setTimeout(() => {
        if (heroText) {
            heroText.classList.add('visible');
        }
        if (heroImage) {
            heroImage.classList.add('visible');
        }
    }, 100);


    // --- LÓGICA PARA O HEADER INTELIGENTE (MOVIDA PARA CÁ) ---

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Cria um placeholder para evitar salto de layout
    let placeholder = document.querySelector('.navbar-placeholder');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'navbar-placeholder';
        navbar.parentNode.insertBefore(placeholder, navbar.nextSibling);
    }

    const handleScroll = () => {
        if (window.scrollY > 10) {
            navbar.classList.add('navbar-scrolled');
            placeholder.style.display = 'block';
            placeholder.style.height = navbar.offsetHeight + 'px';
        } else {
            navbar.classList.remove('navbar-scrolled');
            placeholder.style.display = 'none';
        }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

});