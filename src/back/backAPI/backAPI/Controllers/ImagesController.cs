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

            await _usersRepository.UpdateUserProfilePhoto(username, imageUrl);
            return Ok(new { ImageUrl = imageUrl });
        }
    }
}
