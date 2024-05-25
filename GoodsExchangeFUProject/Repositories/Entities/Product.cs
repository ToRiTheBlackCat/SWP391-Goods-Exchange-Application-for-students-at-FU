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

    public virtual ICollection<ExchangeDetail> ExchangeDetails { get; set; } = new List<ExchangeDetail>();

    public virtual ICollection<Exchange> Exchanges { get; set; } = new List<Exchange>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual ProductType Type { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
