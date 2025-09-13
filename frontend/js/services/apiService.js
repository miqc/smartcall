import { API_BASE_URL } from '../config.js';

// Função para buscar todos os produtos (já existe)
export async function getProducts() {
    //... código existente
}

// ADICIONE ESTA NOVA FUNÇÃO
export async function createProduct(productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/Produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            // Se a resposta não for 2xx, lança um erro
            throw new Error('Erro ao criar o produto: ' + response.statusText);
        }
        
        return await response.json(); // Retorna o produto criado (com ID)

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        // Retorna null ou lança o erro para quem chamou tratar
        return null;
    }
}