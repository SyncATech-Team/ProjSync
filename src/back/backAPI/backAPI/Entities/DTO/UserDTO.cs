namespace backAPI.Entities.DTO
{
    /// <summary>
    /// User DTO koji ce da se koristi za vracanje iz uspesnog login-a
    /// 
    /// Vracamo username i token (jwt) posto ne zelimo da prikazujemo sifru (hash)
    /// </summary>
    public class UserDTO
    {
        public string Username { get; set; }
        public string UserEmail { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public int RoleCompany { get; set; }

        public string Token { get; set; }
    }
}
