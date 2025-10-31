using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MiniPM.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MiniPM.Api.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly string _key;
        private readonly int _expiresMinutes;

        public JwtService(IConfiguration config)
        {
            _config = config;
            _issuer = _config["Jwt:Issuer"];
            _audience = _config["Jwt:Audience"];
            _key = _config["Jwt:Key"];
            _expiresMinutes = int.Parse(_config["Jwt:ExpiresMinutes"] ?? "60");
        }

        public string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            };

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_expiresMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public DateTime GetExpiry() => DateTime.UtcNow.AddMinutes(_expiresMinutes);
    }
}

