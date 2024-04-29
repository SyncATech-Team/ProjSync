using backAPI.Entities.Domain;
using System.Xml.Linq;

namespace backAPI.DTO.Issues
{
    public class JIssueDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public int ListPosition { get; set; }
        public string Description { get; set; }
        public double Estimate { get; set; }
        public double TimeSpent { get; set; }
        public double TimeRemaining { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public string DueDate { get; set; }
        public string ReporterId { get; set; }
        public List<string> UserIds { get; set; }
        public List<UsersOnIssueDto> UsersWithCompletion { get; set; }
        public double Completed { get; set; }
        public List<JCommentDto> Comments { get; set; }
        public string ProjectId { get; set; }
    }
}
