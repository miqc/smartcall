// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
    
    // --- GRÁFICO 1: CHAMADOS POR CATEGORIA (BARRAS) ---
    const ctxCategoria = document.getElementById('chamadosPorCategoriaChart')?.getContext('2d');
    if (ctxCategoria) {
        new Chart(ctxCategoria, {
            type: 'bar',
            data: {
                labels: ['Problemas de Hardware', 'Dúvidas de Software', 'Acesso e Permissões', 'Rede', 'Outros'],
                datasets: [{
                    label: 'Nº de Chamados',
                    data: [45, 62, 24, 12, 5],
                    backgroundColor: 'rgba(74, 108, 250, 0.8)',
                    borderColor: 'rgba(74, 108, 250, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }, // Esconde a legenda para um visual mais limpo
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // --- GRÁFICO 2: ÍNDICE DE SATISFAÇÃO (ROSCA/DOUGHNUT) ---
    const ctxSatisfacao = document.getElementById('satisfacaoChart')?.getContext('2d');
    if (ctxSatisfacao) {
        new Chart(ctxSatisfacao, {
            type: 'doughnut',
            data: {
                labels: ['Positivas', 'Neutras', 'Negativas'],
                datasets: [{
                    label: 'Satisfação do Cliente',
                    data: [82, 15, 3],
                    // Reutilizando as cores que já definimos para os status
                    backgroundColor: [
                        '#28a745', // Verde
                        '#6c757d', // Cinza
                        '#dc3545'  // Vermelho
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { 
                    legend: { 
                        position: 'bottom' // Legenda na parte inferior
                    } 
                }
            }
        });
    }
});