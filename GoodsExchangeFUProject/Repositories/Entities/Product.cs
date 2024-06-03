using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public string ProductImage { get; set; } = null!;

    public string? ProductDescription { get; set; }

    public int ProductPrice { get; set; }

    public int TypeId { get; set; }

    public int UserId { get; set; }

    public int Status { get; set; }
    // 0 - disabled, 1 - available, 2 - trading

    public  ICollection<ExchangeDetail> ExchangeDetails { get; set; } = new List<ExchangeDetail>();

    public  ICollection<Exchange> Exchanges { get; set; } = new List<Exchange>();

    public  ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual ProductType Type { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
