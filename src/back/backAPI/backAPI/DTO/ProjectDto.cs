namespace backAPI.DTO
{
    public class ProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Key {  get; set; }
        public int TypeId { get; set; }
        public int OwnerId { get; set; }
        public int? ParentId {  get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime DueDate { get; set; }
        public double? Budget {  get; set; }
        public int VisibilityId { get; set; }
    }
}
