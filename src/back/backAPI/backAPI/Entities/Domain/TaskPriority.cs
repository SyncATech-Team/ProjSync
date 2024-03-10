﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("TaskPriorities")]
    public class TaskPriority {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
