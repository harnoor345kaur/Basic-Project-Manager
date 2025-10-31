using MiniPM.Api.Models;

namespace MiniPM.Api.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        DateTime GetExpiry();
    }
}

