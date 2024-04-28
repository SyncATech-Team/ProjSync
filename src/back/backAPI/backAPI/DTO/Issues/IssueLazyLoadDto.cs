namespace backAPI.DTO.Issues
{
    public class IssueLazyLoadDto
    {
        public List<IssueDto> Issues { get; set; }
        public int NumberOfRecords { get; set; }
    }
}
