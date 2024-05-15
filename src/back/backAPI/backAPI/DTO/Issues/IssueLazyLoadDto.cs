namespace backAPI.DTO.Issues
{
    public class IssueLazyLoadDto
    {
        public List<JIssueDto> Issues { get; set; }
        public int NumberOfRecords { get; set; }
    }
}
