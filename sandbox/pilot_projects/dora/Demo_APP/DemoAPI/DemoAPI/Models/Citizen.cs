using System.ComponentModel.DataAnnotations;

namespace DemoAPI.Models
{
    public class Citizen
    {
        [Key]
        public Guid Umcn { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public long Phone { get; set; }
        public string Address { get; set; }
    }
}
