using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using static GoodsExchangeFUProject.ModelsView.UserModel;
using System.Text;
using GoodsExchangeFUProject.Entities;


namespace GoodsExchangeFUProject.Helpers
{
    public class AuthHelper
    {
        private readonly IConfiguration _configuration;
        private readonly GoodsExchangeFudbContext _context;

        public AuthHelper(IConfiguration configuration, GoodsExchangeFudbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["JWT:Secret"];
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? ""));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role.RoleName.ToString().Trim())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: signingCredentials
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            return accessToken;
        }

       
    }
}
