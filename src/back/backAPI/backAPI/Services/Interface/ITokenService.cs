using backAPI.Entities.Domain;

namespace backAPI.Services.Interface
{
    public interface ITokenService
    {
        Task<string> CreateToken(User user);
    }
}
