// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA PARA LINHAS CLICÁVEIS (JÁ EXISTE) ---
    const rows = document.querySelectorAll('tr[data-href]');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            window.location.href = row.dataset.href;
        });
    });

    // --- NOVA LÓGICA PARA OS FILTROS ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const ticketRows = document.querySelectorAll('#tickets-tbody tr');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe 'active' de todas as abas
            filterTabs.forEach(t => t.classList.remove('active'));
            // Adiciona a classe 'active' apenas na aba clicada
            tab.classList.add('active');

            const filterValue = tab.dataset.filter;

            // Percorre cada linha da tabela para decidir se mostra ou esconde
            ticketRows.forEach(row => {
                const rowStatus = row.dataset.status;

                // Condição para mostrar a linha
                if (filterValue === 'todos' || filterValue === rowStatus) {
                    row.style.display = ''; // '' reseta para o display padrão (table-row)
                } else {
                    row.style.display = 'none'; // Esconde a linha
                }
            });
        });
    });
});