using System;
using System.Collections.Generic;

namespace GoodsExchangeFUProject.Entities;

public partial class Report
{
    public int ReportId { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public string Detail { get; set; } = null!;

    public DateTime ReportDate { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
