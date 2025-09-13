using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SmartCall.Application.DTOs;
using SmartCall.Domain.Entities;
using SmartCall.Infrastructure.Data;
using SmartCall.Domain.Enums;

namespace SmartCall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("registro")]
        public async Task<IActionResult> Registrar([FromBody] RegistroRequestDto request)
        {
            if (_context.Usuarios.Any(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Este email já está em uso." });
            }

            // REMOVEMOS a lógica de validação do cargo vindo do request.

            var novoUsuario = new Usuario
            {
                NomeCompleto = request.NomeCompleto,
                Email = request.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha),
                // FORÇAMOS o cargo para "Usuario", ignorando qualquer outra possibilidade.
                Cargo = PapelUsuario.Usuario 
            };

            _context.Usuarios.Add(novoUsuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuário criado com sucesso!" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto request)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == request.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash))
            {
                return Unauthorized(new { message = "Email ou senha inválidos." });
            }

            var token = GerarTokenJwt(usuario);
            
            // ALTERAÇÃO AQUI: Adicionado "cargo" à resposta
            return Ok(new { token = token, nome = usuario.NomeCompleto, cargo = usuario.Cargo.ToString() });        }

        private string GerarTokenJwt(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            // A chave secreta deve ser a mesma configurada no Program.cs (faremos isso a seguir)
            // E deve ser guardada de forma segura, ex: appsettings.json
            var key = Encoding.ASCII.GetBytes("sua-chave-secreta-super-longa-e-segura-aqui");
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Email, usuario.Email),
                    new Claim(ClaimTypes.Name, usuario.NomeCompleto)
                }),
                Expires = DateTime.UtcNow.AddHours(8), // Duração do token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}