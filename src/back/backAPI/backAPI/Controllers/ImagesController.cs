using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class ImagesController : BaseApiController
    {
        private readonly IImageRepository _imageRepository;

        public ImagesController(IImageRepository imageRepository)
        {
            _imageRepository = imageRepository;
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

            return Ok(new { ImageUrl = imageUrl });
        }

        [HttpPost("other")]
        public async Task<ActionResult> UploadOtherImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Invalid image file");
            }

            var imageUrl = await _imageRepository.UploadOtherImage(imageFile);

            if (imageUrl == null)
            {
                return BadRequest("Failed to upload image");
            }

            return Ok(new { ImageUrl = imageUrl });
        }
    }
}
