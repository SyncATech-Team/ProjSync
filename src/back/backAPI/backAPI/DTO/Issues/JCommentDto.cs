namespace backAPI.DTO.Issues
{
    public class JCommentDto
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public string IssueId { get; set; }
        public string UserId { get; set; }
        public UserDto User { get; set; }
    }
}