namespace backAPI.DTO.Projects
{
    // JProject
    public class ProjectWithIssuesDto
    {
        public String Id { get; set; }
        public string Name { get; set; }
        public String Url { get; set; }
        public String Description { get; set; }
        public String ProjectCategory { get; set; }
        public String CreatedAt { get; set; }
        public String UpdateAt { get; set; }
    }
}
