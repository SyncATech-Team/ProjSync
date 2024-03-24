using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace backAPI.Entities.Domain
{
    /// <summary>
    /// Entitet u bazi koji predstavlja definisane pozicije u kompaniji
    /// </summary>
    /// 
    [Table("CompanyRoles")]
    public class CompanyRole
    {
        [Key]
        public int Id { get; set; }
        /// <summary>
        /// Jedinstveni naziv uloge
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Permisija: Moze kreirati i editovati projekte
        /// </summary>
        public bool CanManageProjects { get; set; } = false;
        /// <summary>
        /// Permisija; Moze kreirati i editovati zadatke
        /// </summary>
        public bool CanManageTasks { get; set; } = false;
        /// <summary>
        /// Permisija: Moze menjati procenat zavrsenosti zadatka
        /// </summary>
        public bool CanUpdateTaskProgress { get; set; } = false;
        /// <summary>
        /// Permisija: Moze ostavljati komentare
        /// </summary>
        public bool CanLeaveComments { get; set; } = false;
        /// <summary>
        /// Permisija: Moze uploadovati fajlove
        /// </summary>
        public bool CanUploadFiles { get; set; } = false;
    }
}
