namespace backAPI.Entities.Domain {
    public class ProjectDocumentation {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Path { get; set; }
        public int ProjectId { get; set; }
        public DateTime DateUploaded { get; set; }
    }
}
