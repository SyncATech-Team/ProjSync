namespace backAPI.Services.Interface {
    public interface IEmailService {

        void SendSuccessfullRegistrationEmail(string toEmail, string username);

    }
}
