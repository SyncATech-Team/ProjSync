namespace backAPI.DTOs
{
    /// <summary>
    /// User DTO koji ce da se koristi za vracanje iz uspesnog login-a
    /// 
    /// Vracamo username i token (jwt) posto ne zelimo da prikazujemo sifru (hash)
    /// </summary>
    public class UserDto
    {
        public string Username { get; set; }
        public string Token { get; set; }
    }
}
