using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCall.Application.DTOs;
using SmartCall.Infrastructure.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SmartCall.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SmartCall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // <-- IMPORTANTE: Só usuários logados podem acessar este controller
    public class PerfilController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;


        public PerfilController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("alterar-senha")]
        public async Task<IActionResult> AlterarSenha([FromBody] AlterarSenhaRequestDto request)
        {
            // 1. Pega o ID do usuário diretamente do Token JWT. NUNCA confie em um ID vindo do frontend.
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdString);

            // 2. Busca o usuário no banco de dados.
            var usuario = await _context.Usuarios.FindAsync(userId);
            if (usuario == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // 3. Verifica se a senha atual fornecida está correta.
            if (!BCrypt.Net.BCrypt.Verify(request.SenhaAtual, usuario.SenhaHash))
            {
                return BadRequest(new { message = "A senha atual está incorreta." });
            }

            // 4. Se tudo estiver correto, gera o hash da nova senha e salva.
            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.NovaSenha);
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Senha alterada com sucesso!" });
        }

        // ... (usings e a classe PerfilController já existem)

        // O método AlterarSenha já está aqui...

        // ADICIONE ESTE NOVO MÉTODO
        [HttpPut("atualizar-dados")]
        public async Task<IActionResult> AtualizarPerfil([FromBody] AtualizarPerfilRequestDto request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null) return Unauthorized();

            var userId = int.Parse(userIdString);
            var usuario = await _context.Usuarios.FindAsync(userId);

            if (usuario == null) return NotFound("Usuário não encontrado.");

            // Atualiza apenas os dados necessários
            usuario.NomeCompleto = request.NomeCompleto;

            // REMOVEMOS a linha "_context.Usuarios.Update(usuario);"
            // O Entity Framework já está rastreando as mudanças no objeto 'usuario'.

            await _context.SaveChangesAsync(); // Apenas isso é necessário para salvar

            return Ok(new
            {
                message = "Perfil atualizado com sucesso!",
                nome = usuario.NomeCompleto,
            });
        }
    }
}
