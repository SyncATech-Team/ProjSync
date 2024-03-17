namespace backAPI.DTO
{
    /// <summary>
    /// Klasa koja se koristi za transfer informacija o korisniku
    /// </summary>
    public class UserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyRoleName { get; set; }
        public string ProfilePhoto { get; set; }
        public string Address { get; set; }
        public string ContactPhone { get; set; }
        public string LinkedinProfile { get; set; }
        public string Status { get; set; }
        public bool IsVerified { get; set; }
        public string PreferedLanguage { get; set; }
    }
}
