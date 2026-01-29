using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Zabochyt.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 1. OPRAVA: Smazána duplicita, necháváme jen to správné připojení "DefaultConnection"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.")));

// ADD CORS CONFIGURATION - FIX PORT TO 5173 ⬇️
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")  // Changed from 5174 to 5173
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 2. JWT Autentizace (Pokud ji zatím nemáte nastavenou v appsettings, může to házet chybu, viz níže)
var jwtSettings = builder.Configuration.GetSection("Jwt");
// Ošetření, aby aplikace nespadla, pokud klíč v nastavení chybí (prozatím)
var keyString = jwtSettings["Key"];
if (!string.IsNullOrEmpty(keyString)) 
{
    var key = Encoding.ASCII.GetBytes(keyString);

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value ?? "TohleJeMujSuperDlouhyTajnyKlicKteryMaMinimalneSedesatCtyriZnakyProBezpecnostAplikaceZabochyt123")),

            // Pro zjednodušení ve vývoji vypneme kontrolu Issuer a Audience
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. OPRAVA: Sloučení nastavení pro API i pro Clienta

app.UseDefaultFiles(); // Důležité pro frontend
app.UseStaticFiles();  // Důležité pro frontend

// Swagger zapneme jen při vývoji
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// DISABLE HTTPS REDIRECT IN DEVELOPMENT - only use in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

// ENABLE CORS HERE - MUST BE BEFORE Authentication/Authorization ⬇️
app.UseCors("AllowViteApp");

// Pořadí je důležité: Nejdřív zjistit KDO to je (AuthN), pak CO může dělat (AuthZ)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 4. OPRAVA: Toto zajistí, že když adresa není API, pošle se uživateli frontend (React/Blazor)
app.MapFallbackToFile("/index.html");

app.Run();