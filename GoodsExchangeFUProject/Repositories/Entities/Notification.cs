using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Notification
{
    public int UserId { get; set; }

    public int ProductId { get; set; }

    public int RequesterId { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User Requester { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
