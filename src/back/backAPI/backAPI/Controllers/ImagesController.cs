using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class ImagesController : BaseApiController
    {
        private readonly IImageRepository _imageRepository;
        private readonly IUsersRepository _usersRepository;

        public ImagesController(IImageRepository imageRepository, IUsersRepository usersRepository)
        {
            _imageRepository = imageRepository;
            _usersRepository = usersRepository;
        }

        [HttpGet("user/{username}/image")]
        public async Task<ActionResult> GetUserImage(string username)
        {
            var user = await _usersRepository.GetUserByUsername(username);

            if (user == null || string.IsNullOrEmpty(user.ProfilePhoto))
            {
                return NotFound("User or image not found");
            }

            var imagePath = "../" + user.ProfilePhoto;
            var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);
                

            return Ok(File(imageBytes, "image/png"));
        }

        [HttpPost("user/{username}")]
        public async Task<ActionResult> UploadUserImage(string username, IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Invalid image file");
            }

            var imageUrl = await _imageRepository.UploadUserImage(username, imageFile);

            if (imageUrl == null)
            {
                return BadRequest("Failed to upload image");
            }

            var user = await _usersRepository.GetUserByUsername(username);
            if (user.ProfilePhoto != null)
            {
                var imagePath = "../" + user.ProfilePhoto;
                Console.WriteLine("TEST");
                System.IO.File.Delete(imagePath);

            }

            await _usersRepository.UpdateUserProfilePhoto(username, imageUrl);
            return Ok(new { ImageUrl = imageUrl });
        }

        [HttpDelete("user/{username}/image")]
        public async Task<IActionResult> DeleteUserImage(string username)
        {
            var user = await _usersRepository.GetUserByUsername(username);

            if (user == null || string.IsNullOrEmpty(user.ProfilePhoto))
            {
                return BadRequest(new {message = "User or image not found" });
            }

            var imagePath = "../" + user.ProfilePhoto;

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            await _usersRepository.UpdateUserProfilePhoto(username, null);

            return Ok(new { message = "Image deleted successfully" });
        }
    }
}
