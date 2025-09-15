// @ts-nocheck

const toastContainer = document.getElementById('toast-container');

/**
 * Exibe uma notificação toast na tela.
 * @param {string} message A mensagem a ser exibida.
 * @param {string} type O tipo de toast ('success' ou 'error').
 * @param {number} duration A duração em milissegundos.
 */
export function showToast(message, type = 'success', duration = 4000) {
    if (!toastContainer) return;

    // Cria o elemento do toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast toast-${type}`;
    toastElement.textContent = message;

    // Adiciona o toast ao container
    toastContainer.appendChild(toastElement);

    // Adiciona a classe 'visible' para iniciar a animação de entrada
    setTimeout(() => {
        toastElement.classList.add('visible');
    }, 10); // Pequeno delay para garantir que a transição CSS funcione

    // Define um timer para remover o toast
    setTimeout(() => {
        // Remove a classe 'visible' para iniciar a animação de saída
        toastElement.classList.remove('visible');

        // Remove o elemento do DOM após a animação de saída terminar
        setTimeout(() => {
            toastElement.remove();
        }, 500); // Deve ser um pouco maior que a duração da transição no CSS
    }, duration);
}