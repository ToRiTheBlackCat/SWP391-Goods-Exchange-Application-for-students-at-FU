using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class ResetToken
{
    public int UserId { get; set; }

    public string? ResetToken1 { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual User User { get; set; } = null!;
}