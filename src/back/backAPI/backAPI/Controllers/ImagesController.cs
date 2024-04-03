﻿using backAPI.Repositories.Interface;
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

            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "..\\") + user.ProfilePhoto;
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

            await _usersRepository.UpdateUserProfilePhoto(username, imageUrl);
            return Ok(new { ImageUrl = imageUrl });
        }

        [HttpDelete("user/{username}/image")]
        public async Task<ActionResult> DeleteUserImage(string username)
        {
            var user = await _usersRepository.GetUserByUsername(username);

            if (user == null || string.IsNullOrEmpty(user.ProfilePhoto))
            {
                return BadRequest("User or image not found");
            }

            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "..\\") + user.ProfilePhoto;

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            await _usersRepository.UpdateUserProfilePhoto(username, null);

            return Ok("Image deleted successfully");
        }
    }
}
