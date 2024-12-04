using api.Data;
using api.Filters;
using api.Middlewared;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer; // Add this using directive
using api.Options; // Add this using directive
using Microsoft.AspNetCore.Builder; // Add this using directive
using Microsoft.AspNetCore.Hosting; // Add this using directive
using Microsoft.Extensions.DependencyInjection; // Add this using directive
using Microsoft.Extensions.Hosting; // Add this using directive

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});

// Add services to the container.

builder.Services.AddControllers(options => { options.Filters.Add<LogActivityFilter>(); });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(builder =>
{
    builder.UseSqlServer(@"server=LAPTOP-7DOUVSV3\SQLEXPRESS;Database=Products;integrated security=true;trust server certificate=true");
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"]))
        };
    });
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

var app = builder.Build();
app.UseCors("AllowAll");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization(); // Place this line immediately after UseRouting
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers(); 
});

//Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<ProfilingMiddleware>();
app.UseHttpsRedirection();
app.Run();
