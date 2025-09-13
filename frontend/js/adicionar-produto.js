// @ts-nocheck
import { createProduct } from './services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-adicionar-produto');

    form.addEventListener('submit', async (event) => {
        // Previne o comportamento padrão do formulário (que é recarregar a página)
        event.preventDefault(); 

        const nomeInput = document.getElementById('produto-nome');
        const precoInput = document.getElementById('produto-preco');

        // Cria um objeto com os dados do novo produto
        const novoProduto = {
            nome: nomeInput.value,
            preco: parseFloat(precoInput.value) // Converte o preço para número
        };

        // Validação simples
        if (!novoProduto.nome || novoProduto.preco <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        // Chama a função do nosso serviço de API
        const produtoCriado = await createProduct(novoProduto);

        if (produtoCriado) {
            alert(`Produto "${produtoCriado.nome}" criado com sucesso!`);
            // Limpa o formulário
            form.reset();
            // Redireciona para a página inicial após o sucesso
            window.location.href = 'index.html';
        } else {
            alert('Falha ao criar o produto. Tente novamente.');
        }
    });
});