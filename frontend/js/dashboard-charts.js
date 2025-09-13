// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('tendenciasChart')?.getContext('2d');

    if (!ctx) return; 

    // --- DADOS FICTÍCIOS (A SIMULAÇÃO) ---
    const labels = [];
    for (let i = 11; i >= 0; i--) {
        const hora = new Date().getHours() - i;
        labels.push(`${hora < 0 ? hora + 24 : hora}:00`);
    }

    const chamadosRecebidos = [3, 4, 8, 8, 5, 2, 2, 8, 6, 8, 4, 4, 7];
    const chamadosResolvidos = [1, 2, 3, 5, 6, 2, 1, 3, 6, 0, 3, 3, 6];

    // --- CRIAÇÃO DOS GRADIENTES ---
    // Gradiente para "Chamados Recebidos"
    const gradientRecebidos = ctx.createLinearGradient(0, 0, 0, 300);
    gradientRecebidos.addColorStop(0, 'rgba(74, 108, 250, 0.4)'); // Cor primária, mais forte em cima
    gradientRecebidos.addColorStop(1, 'rgba(74, 108, 250, 0)');   // Transparente embaixo

    // Gradiente para "Chamados Resolvidos"
    const gradientResolvidos = ctx.createLinearGradient(0, 0, 0, 300);
    gradientResolvidos.addColorStop(0, 'rgba(35, 46, 82, 0.4)'); // Cor escura, mais forte em cima
    gradientResolvidos.addColorStop(1, 'rgba(35, 46, 82, 0)');  // Transparente embaixo

    // --- CONFIGURAÇÃO DO GRÁFICO ---
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Chamados Recebidos',
                    data: chamadosRecebidos,
                    borderColor: '#4A6CFA',
                    backgroundColor: gradientRecebidos, // <-- MUDANÇA AQUI
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff', // <-- MELHORIA AQUI
                    pointBorderColor: '#4A6CFA', // <-- MELHORIA AQUI
                    pointBorderWidth: 2, // <-- MELHORIA AQUI
                    pointRadius: 5, // <-- MELHORIA AQUI
                },
                {
                    label: 'Chamados Resolvidos',
                    data: chamadosResolvidos,
                    borderColor: '#232E52',
                    backgroundColor: gradientResolvidos, // <-- MUDANÇA AQUI
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff', // <-- MELHORIA AQUI
                    pointBorderColor: '#232E52', // <-- MELHORIA AQUI
                    pointBorderWidth: 2, // <-- MELHORIA AQUI
                    pointRadius: 5, // <-- MELHORIA AQUI
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // --- CONFIGURAÇÕES DE ESTILO (MELHORIAS) ---
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)', // Linhas de grade mais fracas
                    },
                    grace: 1
                },
                x: {
                    grid: {
                        display: false, // Remove as linhas de grade verticais
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end', // Alinha a legenda à direita
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    // Estiliza a caixinha de informações
                    backgroundColor: '#fff',
                    titleColor: '#232E52',
                    bodyColor: '#555',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
});