namespace backAPI.DTO {
    public class ChangePasswordDto {
        public String Username { get; set; }
        public String CurrentPassword { get; set; }
        public String NewPassword { get; set; }
    }
}
