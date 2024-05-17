using System;
using System.Collections.Generic;

namespace GoodsExchangeFU.Entities;

public partial class Rating
{
    public int ExchangeId { get; set; }

    public int UserId { get; set; }

    public decimal Score { get; set; }

    public virtual Exchange Exchange { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
