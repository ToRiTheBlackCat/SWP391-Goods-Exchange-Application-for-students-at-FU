using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Exchange
{
    public int ExchangeId { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public DateOnly CreateDate { get; set; }

    public int Status { get; set; }

    public virtual ICollection<ExchangeDetail> ExchangeDetails { get; set; } = new List<ExchangeDetail>();

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
