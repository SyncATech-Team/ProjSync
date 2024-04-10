using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backAPI.Services.Implementation
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly UserManager<User> _userManager;
        private readonly ICompanyRolesRepository _companyRolesRepository;

        public TokenService(IConfiguration config, UserManager<User> userManager,ICompanyRolesRepository companyRolesRepository)
        {
            _userManager = userManager;
            _companyRolesRepository = companyRolesRepository;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public async Task<string> CreateToken(User user)
        {
            var companyRole = await _companyRolesRepository.GetCompanyRoleById(user.CompanyRoleId);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim("permitions",
                          "{\"canManageProjects\":\""+ companyRole.CanManageProjects+"\"," +
                          "\"canLeaveComments\":\""+ companyRole.CanLeaveComments+"\"," +
                          "\"canManageTasks\":\""+ companyRole.CanManageTasks+"\"," +
                          "\"canUpdateTaskProgress\":\""+ companyRole.CanUpdateTaskProgress+"\"," +
                          "\"canUploadFiles\":\""+ companyRole.CanUploadFiles+"\" }",
                          JsonClaimValueTypes.Json)
            };

            var roles = await _userManager.GetRolesAsync(user);
            roles.Add(companyRole.Name);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                // expires after day
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
