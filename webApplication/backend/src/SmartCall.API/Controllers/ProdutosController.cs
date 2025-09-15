using SmartCall.Application.Interfaces;
using SmartCall.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace SmartCall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly IProdutoService _produtoService;

        public ProdutosController(IProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var produto = await _produtoService.BuscarProdutoPorIdAsync(id);
            if (produto == null) return NotFound();
            return Ok(produto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Produto produto)
        {
            await _produtoService.CriarProdutoAsync(produto);
            return CreatedAtAction(nameof(GetById), new { id = produto.Id }, produto);
        }
    }
}