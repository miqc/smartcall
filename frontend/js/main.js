import { getProducts } from './services/apiService.js';

// Função para renderizar a lista (poderia estar em /components/productList.js)
function renderProductList(products) {
    const listContainer = document.getElementById('lista-produtos');
    listContainer.innerHTML = ''; // Limpa a lista antes de adicionar os itens

    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.nome} - R$ ${product.preco}`;
        listContainer.appendChild(listItem);
    });
}

// Função principal que inicia a aplicação
async function initializeApp() {
    const products = await getProducts();
    renderProductList(products);
}

// Inicia o app quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);