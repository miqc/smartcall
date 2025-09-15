using Microsoft.EntityFrameworkCore;
using SmartCall.Domain.Entities; // Certifique-se que o using da sua entidade está aqui

namespace SmartCall.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Produto> Produtos { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }

        // ADICIONE ESTE MÉTODO
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Produto>(entity =>
            {
                // Configura a propriedade 'Preco'
                entity.Property(e => e.Preco)
                      .HasPrecision(18, 2); // Define a precisão para 18 dígitos com 2 casas decimais
            });
        }
    }
}