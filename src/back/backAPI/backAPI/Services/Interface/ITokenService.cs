using backAPI.Entities.Domain;

namespace backAPI.Services.Interface
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
