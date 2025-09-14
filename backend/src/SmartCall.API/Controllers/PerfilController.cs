using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCall.Application.DTOs;
using SmartCall.Infrastructure.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace SmartCall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // <-- IMPORTANTE: Só usuários logados podem acessar este controller
    public class PerfilController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PerfilController(AppDbContext context)
        {
            _context = context;
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
            // Pega o ID do usuário logado a partir do token JWT
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null) return Unauthorized();
            
            var userId = int.Parse(userIdString);
            var usuario = await _context.Usuarios.FindAsync(userId);

            if (usuario == null) return NotFound("Usuário não encontrado.");

            // Atualiza os dados do usuário com os dados recebidos do formulário
            usuario.NomeCompleto = request.NomeCompleto;
            usuario.Email = request.Email;

            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();

            // Retorna os dados atualizados para o frontend
            return Ok(new { message = "Perfil atualizado com sucesso!", nome = usuario.NomeCompleto });
        }

    }

    
}

