using backAPI.Services.Interface;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace backAPI.Services.Implementation {
    public class EmailService : IEmailService {

        private IConfiguration _configuration;

        public EmailService(IConfiguration configuration) {
            this._configuration = configuration;
        }

        public void SendToConfirmEmail(string to, string username, string confirmationLink)
        {
            try
            {
                SmtpClient smtpClient = new SmtpClient(_configuration["EmailConfiguration:SmtpServer"], 587);
                smtpClient.EnableSsl = true;    // Use secure socket layer
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(
                    _configuration["EmailConfiguration:Email"],
                    _configuration["EmailConfiguration:Password"]);

                MailMessage message = new MailMessage();
                message.From = new MailAddress(_configuration["EmailConfiguration:Email"]);
                message.To.Add(to);
                message.Subject = "Please confirm your email";
                message.IsBodyHtml = true;
                StringBuilder mailBody = new StringBuilder();

                mailBody.Append(@"
                    <!DOCTYPE html>
                    <html lang='en'>
                    <head>
                      <meta charset='UTF-8'>
                      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                      <title>Proj Sync - Please confirm email</title>
                      <style>
                        body {
                          font-family: sans-serif;
                          margin: 0;
                          padding: 0;
                        }
                        .container {
                          padding: 20px;
                          max-width: 600px;
                          margin: 20px auto;
                          border-radius: 5px;
                          background-color: #f5f5f5;
                        }
                        h1 {
                          text-align: center;
                          margin-bottom: 10px;
                        }
                        p {
                          line-height: 1.5;
                        }
                        a {
                          color: #3498db;
                          text-decoration: none;
                        }
                      </style>
                    </head>
                    <body>
                      <div class='container'>
                        <h1>Welcome to ProjSync, [username]!</h1>
                        <p>In order to finish registration, please confirm Your email by clicking on link: [confirmationLink].</p>
                        
                        <p>The ProjSync Team</p>
                      </div>
                    </body>
                    </html>
                    ");

                // Replace [username] with the actual username and [login_link] with your login URL.
                mailBody.Replace("[username]", username);
                mailBody.Replace("[confirmationLink]", confirmationLink);

                message.Body = mailBody.ToString();

                smtpClient.Send(message);
                Console.WriteLine("Email sent successfully.");

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }

        public void SendSuccessfullRegistrationEmail(string toEmail, string username) {
            
            try {
                SmtpClient smtpClient = new SmtpClient(_configuration["EmailConfiguration:SmtpServer"], 587);
                smtpClient.EnableSsl = true;    // Use secure socket layer
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(
                    _configuration["EmailConfiguration:Email"],
                    _configuration["EmailConfiguration:Password"]);

                MailMessage message = new MailMessage();
                message.From = new MailAddress(_configuration["EmailConfiguration:Email"]);
                message.To.Add(toEmail);
                message.Subject = "Welcome to ProjSync!";
                message.IsBodyHtml = true;
                StringBuilder mailBody = new StringBuilder();

                mailBody.Append(@"
                    <!DOCTYPE html>
                    <html lang='en'>
                    <head>
                      <meta charset='UTF-8'>
                      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                      <title>ProjSync - Welcome!</title>
                      <style>
                        body {
                          font-family: sans-serif;
                          margin: 0;
                          padding: 0;
                        }
                        .container {
                          padding: 20px;
                          max-width: 600px;
                          margin: 20px auto;
                          border-radius: 5px;
                          background-color: #f5f5f5;
                        }
                        h1 {
                          text-align: center;
                          margin-bottom: 10px;
                        }
                        p {
                          line-height: 1.5;
                        }
                        a {
                          color: #3498db;
                          text-decoration: none;
                        }
                      </style>
                    </head>
                    <body>
                      <div class='container'>
                        <h1>Welcome to ProjSync, [username]!</h1>
                        <p>We're thrilled to have you on board. Your account has been successfully created.</p>
                        <p>Now you can:</p>
                        <ul>
                          <li>Manage your projects and tasks.</li>
                          <li>Collaborate with your team (if applicable).</li>
                          <li>Explore the many features of ProjSync.</li>
                        </ul>
                        <p>Get started by logging in to your account: <a href='[login_link]'>Login Here</a></p>
                        <p>If you have any questions, don't hesitate to contact our support team at <a href='mailto:syncatech@hotmail.com'>syncatech@hotmail.com</a>.</p>
                        <p>Happy Projecting!</p>
                        <p>The ProjSync Team</p>
                      </div>
                    </body>
                    </html>
                    ");

                // Replace [username] with the actual username and [login_link] with your login URL.
                mailBody.Replace("[username]", username);
                mailBody.Replace("[login_link]", _configuration["BaseURL"] + "/login");

                message.Body = mailBody.ToString();

                smtpClient.Send(message);
                Console.WriteLine("Email sent successfully.");

            }
            catch (Exception ex) {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }

        }
    }
}
