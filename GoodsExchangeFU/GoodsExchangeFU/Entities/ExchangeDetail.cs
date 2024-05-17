using System;
using System.Collections.Generic;

namespace GoodsExchangeFU.Entities;

public partial class ExchangeDetail
{
    public int Exdid { get; set; }

    public int? ProductId { get; set; }

    public int? Balance { get; set; }

    public int ExchangeId { get; set; }

    public virtual Exchange Exchange { get; set; } = null!;

    public virtual Product? Product { get; set; }
}
