using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    public class TaskGroup
    {
        public int Id { get; set; }
        /// <summary>
        /// Naziv grupe taskova
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Id projekta kojem grupa pripada | FK
        /// </summary>
        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")] public Project Project { get; set; }
    }
}
