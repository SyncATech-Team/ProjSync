using System.ComponentModel.DataAnnotations;

namespace TodoApp.Models
{
    public class TodoTask
    {

        public int Id { get; set; }


        public string Description { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }

        public DateTime DueDate { get; set; }
    }
}
