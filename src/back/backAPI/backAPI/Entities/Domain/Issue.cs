using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("Issues")]
    public class Issue
    {
        /// <summary>
        /// ID zadatka
        /// </summary>
        [Key] public int Id { get; set; }
        /// <summary>
        /// Naziv zadatka. Jedinstveni naziv u grupi na projektu
        /// </summary>
        [Required] public string Name { get; set; }
        /// <summary>
        /// ID tipa zadatka | FK
        /// </summary>
        public int TypeId { get; set; }
        /// <summary>
        /// ID statusa zadatka | FK
        /// </summary>
        public int StatusId { get; set; }
        /// <summary>
        /// ID prioriteta zadatka | FK
        /// </summary>
        public int PriorityId { get; set; }
        /// <summary>
        /// Opis zadatka
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// Datum kreiranja zadatka
        /// </summary>
        public DateTime CreatedDate { get; set; }
        /// <summary>
        /// Datum izmene zadatka
        /// </summary>
        public DateTime UpdatedDate { get; set; }
        /// <summary>
        /// Datum do koga je potrebno odraditi zadatak
        /// </summary>
        public DateTime DueDate { get; set; }
        /// <summary>
        /// ID korisnika koji je kreirao zadatak | FK
        /// </summary>
        public int OwnerId { get; set; }
        /// <summary>
        /// ID grupe kojoj zadatak pripada | FK
        /// </summary>
        public int GroupId { get; set; }
        /// <summary>
        /// Procenat zavrsenosti zadatka u opsegu od 0% do 100%
        /// </summary>
        public double Completed { get; set; } = 0.0;    // procenat zavrsenosti zadatka
        


        [ForeignKey("StatusId")] public IssueStatus IssueStatus { get; set; }

        [ForeignKey("OwnerId")] public User User { get; set; }

        [ForeignKey("GroupId")] public IssueGroup IssueGroup { get; set; }

        [ForeignKey("PriorityId")] public IssuePriority IssuePriority { get; set; }

        [ForeignKey("TypeId")] public IssueType IssueType { get; set; }

    }
}
