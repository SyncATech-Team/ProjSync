namespace Server.Data.Models;

public class PostCreateUpdateDTO {
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool Published { get; set; }
}