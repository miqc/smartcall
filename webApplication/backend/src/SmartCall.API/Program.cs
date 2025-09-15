using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartCall.Application.Interfaces;
using SmartCall.Application.Services;
using SmartCall.Infrastructure.Data;
using SmartCall.Infrastructure.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- CÓDIGO CORS (JÁ EXISTE) ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://127.0.0.1:5500") 
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// --- INÍCIO DA NOVA CONFIGURAÇÃO DE AUTENTICAÇÃO ---

// 1. Adiciona o serviço de autenticação e define os esquemas padrão
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
// 2. Configura o esquema JwtBearer
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        // A chave secreta deve ser EXATAMENTE a mesma usada no AuthController para gerar o token
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("sua-chave-secreta-super-longa-e-segura-aqui")),
        ValidateIssuer = false, // Em dev, podemos deixar false
        ValidateAudience = false // Em dev, podemos deixar false
    };
});

// --- FIM DA NOVA CONFIGURAÇÃO DE AUTENTICAÇÃO ---

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: A ordem aqui é crucial
app.UseRouting(); // O UseCors geralmente fica depois do UseRouting

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication(); // <-- Adiciona o middleware de autenticação
app.UseAuthorization(); // O de autorização vem depois

app.MapControllers();

app.Run();