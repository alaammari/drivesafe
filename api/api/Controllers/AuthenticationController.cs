using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using api.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity.Data;
using System.IdentityModel.Tokens.Jwt;

namespace api.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public AuthenticationController(ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public ActionResult Login(LoginRequest model)
        {
            var user = _dbContext.AdminUsers.FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == ComputeHash(model.Password));
            if (user != null)
            {
                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }
            else
            {
                return Unauthorized();
            }
        }

        private string GenerateJwtToken(AdminUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        private string ComputeHash(string input)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
