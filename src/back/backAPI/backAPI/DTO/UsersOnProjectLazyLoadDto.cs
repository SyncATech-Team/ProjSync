namespace backAPI.DTO
{
    public class UsersOnProjectLazyLoadDto
    {
        public List<UserDto> Users { get; set; }
        public int NumberOfRecords { get; set; }
    }
}
