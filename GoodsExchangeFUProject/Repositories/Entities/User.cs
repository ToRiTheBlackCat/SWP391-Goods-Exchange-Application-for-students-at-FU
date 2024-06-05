using System;
using System.Collections.Generic;

namespace Repositories.Entities
{
    public enum RoleEnum : int
    {
        Admin = 1,
        Modderator = 2,
        Student = 3,
    }

    public partial class User
    {
        public int UserId { get; set; }

        public string UserName { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public bool Gender { get; set; }

        public DateOnly? Dob { get; set; }

        public int RoleId { get; set; }

        public string? Address { get; set; }

        public double? AverageScore { get; set; }

        public bool IsBanned { get; set; }

        public virtual ICollection<Exchange> Exchanges { get; set; } = new List<Exchange>();

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();

        public virtual Role Role { get; set; } = null!;
        public virtual ResetToken? ResetToken { get; set; }


    }
    
}