using System.ComponentModel.DataAnnotations;

namespace MiniPM.Api.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class AuthResultDto
    {
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}

