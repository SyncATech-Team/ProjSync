using backAPI.DTO.Issues;

namespace backAPI.DTO.Projects
{
    // JProject
    public class ProjectWithIssuesDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string ProjectCategory { get; set; }
        public string CreatedAt { get; set; }
        public string UpdateAt { get; set; }

        public JIssueDto[] issues { get; set; }
        public UserDto[] users { get; set; }
    }
}
