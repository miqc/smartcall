import { API_BASE_URL } from '../config.js';

// Função auxiliar para lidar com erros de forma inteligente
async function handleResponseError(response) {
    const contentType = response.headers.get("content-type");
    // Se a resposta de erro for JSON, podemos extrair a mensagem específica
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}`);
    } else {
        // Se não for JSON (ex: 401 Unauthorized com corpo vazio), usamos o status
        throw new Error(response.statusText || `Erro ${response.status}`);
    }
}

export async function login(email, senha) {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    
    if (!response.ok) {
        await handleResponseError(response);
    }
    return await response.json();
}

export async function registrar(dadosUsuario) {
    const response = await fetch(`${API_BASE_URL}/Auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario)
    });

    if (!response.ok) {
        await handleResponseError(response);
    }
    return await response.json();
}

export async function alterarSenha(dadosSenha) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/Perfil/alterar-senha`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosSenha)
    });

    if (!response.ok) {
        await handleResponseError(response);
    }

    // A resposta de sucesso pode ou não ter corpo. Se não tiver, retorna um objeto de sucesso.
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : { message: 'Operação bem-sucedida' };
}

// ...

export async function atualizarPerfil(dadosPerfil) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_BASE_URL}/Perfil/atualizar-dados`, {
        method: 'PUT', // Usamos PUT para atualização
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosPerfil)
    });

    if (!response.ok) {
        await handleResponseError(response);
    }
    return await response.json();
}

export async function getUsuarios() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Usuário não autenticado.');

    // URL ATUALIZADA para corresponder ao novo controller
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        // Removemos o tratamento específico de 403, pois agora todos têm acesso
        await handleResponseError(response);
    }
    return await response.json();
}

export async function editarUsuario(userId, dadosUsuario) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosUsuario)
    });

    if (!response.ok) {
        await handleResponseError(response);
    }
    return await response.json();
}