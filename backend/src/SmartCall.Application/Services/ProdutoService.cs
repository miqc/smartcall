using SmartCall.Application.Interfaces;
using SmartCall.Domain.Entities;

namespace SmartCall.Application.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _produtoRepository;

        public ProdutoService(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        public async Task CriarProdutoAsync(Produto produto)
        {
            if (produto.Preco < 0)
                throw new ArgumentException("Preço não pode ser negativo.");

            await _produtoRepository.AddAsync(produto);
        }

        public async Task<Produto> BuscarProdutoPorIdAsync(int id)
        {
            return await _produtoRepository.GetByIdAsync(id);
        }
    }
}