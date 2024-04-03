namespace backAPI.Repositories.Interface
{
    public interface IImageRepository
    {
        Task<string> UploadUserImage(string username, IFormFile imageFile);
    }
}
