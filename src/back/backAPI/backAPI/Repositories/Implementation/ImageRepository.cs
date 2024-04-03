using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backAPI.Repositories.Implementation
{
    public class ImageRepository : IImageRepository
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IUsersRepository _usersRepository;

        public ImageRepository(IWebHostEnvironment webHostEnvironment, IUsersRepository usersRepository)
        {
            _webHostEnvironment = webHostEnvironment;
            _usersRepository = usersRepository;
        }

        public async Task<string> UploadUserImage(string username, IFormFile imageFile)
        {
            //EKSTENZIJA
            var extension = "." + imageFile.FileName.Split('.')[imageFile.FileName.Split('.').Length - 1];

            if (extension.ToLower() == ".png" || extension.ToLower() == ".jpg" || extension.ToLower() == ".jpeg")
            {
                var userExists = await _usersRepository.UserExistsByUsername(username);

                if (userExists == false)
                {
                    return null;
                }

                if (imageFile == null || imageFile.Length == 0)
                {
                    return null;
                }

                // JEDINSTVENO IME ZA FAJL
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;

                // PUTANJA DO USER-IMAGES FOLDERA
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "..\\user-images");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // PUTANJA DO KONACNOG FAJLA
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);



                //CUVAM SLIKU OVDE
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                return "/user-images/" + uniqueFileName;
            }
            else
            {
                return null;
            }
        }
    }
}
