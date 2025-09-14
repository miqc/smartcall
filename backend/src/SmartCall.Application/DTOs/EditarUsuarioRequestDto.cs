using System.ComponentModel.DataAnnotations;

 namespace SmartCall.Application.DTOs
 {
     public class EditarUsuarioRequestDto
     {
         [Required]
         public string NomeCompleto { get; set; }

         [Required]
         [EmailAddress]
         public string Email { get; set; }

         [Required]
         public string Cargo { get; set; }
     }
 }