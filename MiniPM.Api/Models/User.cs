using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MiniPM.Api.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; }

        public ICollection<Project> Projects { get; set; }
    }
}

