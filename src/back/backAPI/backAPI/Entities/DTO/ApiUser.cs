
namespace backAPI.Entities.DTO {

    // Objekat za login korisnika
    public class UserLogin {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    // Objekat za registraciju korisnika
    public class UserRegister {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int CompanyRoleId { get; set; }
        public string Address { get; set; }
        public string ContactPhone { get; set; }
        public string LinkedinProfile { get; set; }
        public string Status { get; set; }
    }

    public class DTOUser {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int CompanyRoleId { get; set; }
        public string Address { get; set; }
        public string ContactPhone { get; set; }
        public string LinkedinProfile { get; set; }
        public string Status { get; set; }

    }
}
