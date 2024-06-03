namespace backAPI.DTO.Issues
{
    public class IssueDependenciesGetter
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsPredecessor { get; set; }
        public string ProjectName { get; set; }
        public string GroupName {  get; set; }
    }
}
