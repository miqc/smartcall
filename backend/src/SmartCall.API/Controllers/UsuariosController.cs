using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCall.Application.DTOs;
using SmartCall.Infrastructure.Data;
using SmartCall.Domain.Entities;
 using SmartCall.Domain.Enums;


namespace SmartCall.API.Controllers
{
    [ApiController]
    [Route("api/usuarios")] // URL mais simples e direta
    [Authorize] // AGORA permite QUALQUER usuário logado
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // A URL final será GET /api/usuarios
        [HttpGet]
        public async Task<IActionResult> ListarUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new UsuarioDto
                {
                    Id = u.Id,
                    NomeCompleto = u.NomeCompleto,
                    Email = u.Email,
                    Cargo = u.Cargo.ToString()
                })
                .ToListAsync();

            return Ok(usuarios);
        }

        [HttpPut("{id}")] // Rota: PUT /api/usuarios/1
 [Authorize] // Apenas Admins podem editar usuários
 public async Task<IActionResult> EditarUsuario(int id, [FromBody] EditarUsuarioRequestDto request)
 {
     var usuario = await _context.Usuarios.FindAsync(id);
     if (usuario == null)
     {
         return NotFound("Usuário não encontrado.");
     }

     if (!Enum.TryParse<PapelUsuario>(request.Cargo, true, out var papel))
     {
         return BadRequest(new { message = "O cargo especificado é inválido." });
     }

     // Atualiza os dados da entidade
     usuario.NomeCompleto = request.NomeCompleto;
     usuario.Email = request.Email;
     usuario.Cargo = papel;

     await _context.SaveChangesAsync();

     return Ok(new { message = "Usuário atualizado com sucesso!" });
 }
        
    }

    
    
    
}