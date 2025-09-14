using System.ComponentModel.DataAnnotations;

namespace SmartCall.Application.DTOs
{
    public class AlterarSenhaRequestDto
    {
        [Required]
        public string SenhaAtual { get; set; }

        [Required]
        [MinLength(6)]
        public string NovaSenha { get; set; }

        [Required]
        [Compare("NovaSenha", ErrorMessage = "A nova senha e a confirmação não coincidem.")]
        public string ConfirmarNovaSenha { get; set; }
    }
}