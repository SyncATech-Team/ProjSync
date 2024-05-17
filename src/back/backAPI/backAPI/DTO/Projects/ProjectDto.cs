namespace backAPI.DTO.Projects
{
    public class ProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Key { get; set; }
        public string TypeName { get; set; }
        public string OwnerUsername { get; set; }
        public string Icon {  get; set; }
        public string ParentProjectName { get; set; } // bice uklonjeno
        public DateTime CreationDate { get; set; }
        public DateTime DueDate { get; set; }
        public double? Budget { get; set; }
        public string VisibilityName { get; set; }

        public double ProjectProgress { get; set; } = 0.0;
    }
}
