using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Zabochyt.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 1. OPRAVA: Smazána duplicita, necháváme jen to správné pøipojení "DefaultConnection"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.")));

// 2. JWT Autentizace (Pokud ji zatím nemáte nastavenou v appsettings, mùže to házet chybu, viz níže)
var jwtSettings = builder.Configuration.GetSection("Jwt");
// Ošetøení, aby aplikace nespadla, pokud klíè v nastavení chybí (prozatím)
var keyString = jwtSettings["Key"];
if (!string.IsNullOrEmpty(keyString)) 
{
    var key = Encoding.ASCII.GetBytes(keyString);

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. OPRAVA: Slouèení nastavení pro API i pro Clienta

app.UseDefaultFiles(); // Dùležité pro frontend
app.UseStaticFiles();  // Dùležité pro frontend

// Swagger zapneme jen pøi vývoji
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Poøadí je dùležité: Nejdøív zjistit KDO to je (AuthN), pak CO mùže dìlat (AuthZ)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 4. OPRAVA: Toto zajistí, že když adresa není API, pošle se uživateli frontend (React/Blazor)
app.MapFallbackToFile("/index.html");

app.Run();