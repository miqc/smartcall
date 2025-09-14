using System.ComponentModel.DataAnnotations;

namespace SmartCall.Application.DTOs
{
    public class AtualizarPerfilRequestDto
    {
        [Required]
        [MaxLength(100)]
        public string NomeCompleto { get; set; }

    }
}