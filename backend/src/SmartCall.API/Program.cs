using SmartCall.Application.Interfaces;
using SmartCall.Application.Services;
using SmartCall.Infrastructure.Data;
using SmartCall.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- INÍCIO DA CONFIGURAÇÃO DO CORS ---

// 1. Define um nome para a política de CORS para ser reutilizado
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// 2. Adiciona o serviço de CORS e configura a política
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          // Permite requisições da origem do seu frontend
                          policy.WithOrigins("http://127.0.0.1:5500") 
                                .AllowAnyHeader() // Permite qualquer cabeçalho
                                .AllowAnyMethod(); // Permite qualquer método (GET, POST, PUT, DELETE, etc.)
                      });
});

// --- FIM DA CONFIGURAÇÃO DO CORS ---

// 1. Configurar Conexão com Banco de Dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Registrar Interfaces e Implementações (Injeção de Dependência)
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- CÓDIGO CORS ADICIONADO AQUI ---
// 3. Habilita o middleware do CORS (use a política definida acima)
// Deve ser chamado antes de UseAuthorization e MapControllers.
app.UseCors(MyAllowSpecificOrigins);
// --- FIM DA ADIÇÃO DO CORS ---

app.UseAuthorization();

app.MapControllers();

app.Run();