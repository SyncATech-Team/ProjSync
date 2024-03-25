using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Identity;

namespace backAPI.Entities.Domain
{
    /// <summary>
    /// Entitet u bazi koji predstavlja korisnika aplikacije
    /// </summary>

    [Table("Users")]
    public class User : IdentityUser<int>
    {
        /// <summary>
        /// Ime
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Prezime
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Id uloge u kompaniji koju poseduje registrovani korisnik
        /// </summary>
        public int CompanyRoleId { get; set; }

        /// <summary>
        /// Putanja do profilne slike korisnika
        /// </summary>
        public string ProfilePhoto { get; set; }

        /// <summary>
        /// Adresa korisnika
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Kontakt telefon
        /// </summary>
        public string ContactPhone { get; set; }

        /// <summary>
        /// Status korisnika
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// Indikator da li je korisnik verifikovao svoj nalog (Promenio prvobitnu lozinku)
        /// </summary>
        public bool IsVerified { get; set; } = false;

        /// <summary>
        /// Jezik koji korisnik preferira za koriscenje aplikacije
        /// </summary>
        public string PreferedLanguage { get; set; } = "engish";

        /// <summary>
        /// Datum kada je kreiran nalog
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Datum kada je nalog poslednji put izmenjen
        /// </summary>
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Indikator da li je nalog i dalje aktivan.
        /// Ukoliko je ovaj indikator postavljen na false
        /// to znaci da je korisnik najverovatnije izbrisan bilo trajno bilo privremeno.
        /// </summary>
        public bool IsActive { get; set; } = true;

        [ForeignKey("CompanyRoleId")]
        public CompanyRole CompanyRole { get; set; }
    }
}
