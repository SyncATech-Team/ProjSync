using System.ComponentModel.DataAnnotations;

namespace ToDo.Model
{
    public class TodoItem
    {
        [Key] public int Id { get; set; }

        public string name { get; set; }
        public bool done{  get; set; }

    }
}