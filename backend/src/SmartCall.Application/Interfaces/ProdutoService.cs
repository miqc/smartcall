using SmartCall.Domain.Entities;

namespace SmartCall.Application.Interfaces
{
    public interface IProdutoService
    {
        Task CriarProdutoAsync(Produto produto);
        Task<Produto> BuscarProdutoPorIdAsync(int id);
    }
}