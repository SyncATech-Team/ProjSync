namespace backAPI.DTO
{
    public class ProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Key {  get; set; }
        public string TypeName { get; set; }
        public string OwnerUsername { get; set; }
        public int? ParentId {  get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime DueDate { get; set; }
        public double? Budget {  get; set; }
        public string VisibilityName { get; set; }
    }
}
