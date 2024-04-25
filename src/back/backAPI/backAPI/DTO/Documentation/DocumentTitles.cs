namespace backAPI.DTO.Documentation {
    public class DocumentTitles {
        public int DocumentId { get; set; }
        public string Title { get; set; }
        public DateTime DateUploaded { get; set; }
        public DocumentTitles[] OlderVersions { get; set; }
    }
}
