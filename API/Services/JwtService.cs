using API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API.Services
{
    public class JwtService
    {
        private readonly JwtSettings _jwtSettings;

        public JwtService(IConfiguration configuration)
        {
            _jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
        }

        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.company_id.ToString()),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Role, user.admin == "yes" ? "Admin" : "User"),
                new Claim(ClaimTypes.GivenName, user.name)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.TokenExpiryInMinutes),
                SigningCredentials = credentials,
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(securityToken);
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false, // Không kiểm tra hết hạn token
                IssuerSigningKey = securityKey
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            return principal;
        }
    }
}
