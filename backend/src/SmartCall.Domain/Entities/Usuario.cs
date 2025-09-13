using SmartCall.Domain.Enums;

namespace SmartCall.Domain.Entities
{
    public class Usuario
    {
        public int Id { get; set; }
        public required string NomeCompleto { get; set; }
        public required string Email { get; set; }
        public required string SenhaHash { get; set; } // NUNCA guardamos a senha em texto puro
        public PapelUsuario Cargo { get; set; }
    }
}