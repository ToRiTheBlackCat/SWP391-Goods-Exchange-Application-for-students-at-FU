using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public enum RoleEnum: int
{
    Admin = 1,
    Modderator = 2,
    Student = 3,
}

public partial class User
{
    public int UserId { get; set; }

    public required string UserName { get; set; }

    public required string Password { get; set; }

    public required string Email { get; set; }

    public string? Phone { get; set; } = "";

    public bool Gender { get; set; } = true;

    public DateOnly? Dob { get; set; }

    public int RoleId { get; set; }

    public string? Address { get; set; }

    public double? AverageScore { get; set; }

    public bool IsBanned { get; set; } = false;

    public virtual ICollection<Exchange>? Exchanges { get; set; } = new List<Exchange>();

    public virtual ICollection<Product>? Products { get; set; } = new List<Product>();

    public virtual ICollection<Report>? Reports { get; set; } = new List<Report>();

    public virtual Role Role { get; set; }
}
