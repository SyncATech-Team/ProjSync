using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backAPI.Repositories.Implementation
{
    public class ImageRepository : IImageRepository
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageRepository(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<string> UploadUserImage(string username, IFormFile imageFile)
        {
            if (string.IsNullOrEmpty(username))
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


        public async Task<string> UploadOtherImage(IFormFile imageFile)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "user-images");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return "/user-images/" + uniqueFileName;
        }
    }
}
