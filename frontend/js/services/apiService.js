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

// ... (funções getProducts, createProduct, etc. continuam aqui)

export async function login(email, senha) {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    
    if (!response.ok) {
        throw new Error('Falha no login');
    }
    return await response.json(); // Retorna { token, nome }
}

export async function registrar(dadosUsuario) {
    const response = await fetch(`${API_BASE_URL}/Auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha no registro');
    }
    return await response.json();
}