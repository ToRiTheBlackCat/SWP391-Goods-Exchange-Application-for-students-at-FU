using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Repositories.Entities;

public partial class Exchange
{
    public int ExchangeId { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public DateOnly CreateDate { get; set; }

    public int Status { get; set; }
    //Status: 1 - accepted, 2 - rejected, 3 - waiting

    [JsonIgnore]
    public virtual ICollection<ExchangeDetail> ExchangeDetails { get; set; } = new List<ExchangeDetail>();

    public Product Product { get; set; } = null!;

    public User User { get; set; } = null!;
}
