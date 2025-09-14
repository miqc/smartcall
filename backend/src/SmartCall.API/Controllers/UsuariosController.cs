using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCall.Application.DTOs;
using SmartCall.Infrastructure.Data;
using SmartCall.Domain.Entities;

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
    }
}