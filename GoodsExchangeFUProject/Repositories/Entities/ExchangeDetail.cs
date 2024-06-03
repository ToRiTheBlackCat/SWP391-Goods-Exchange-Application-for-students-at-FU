using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Repositories.Entities;

public partial class ExchangeDetail
{
    public int Exdid { get; set; }

    public int? ProductId { get; set; } = null;

    public int Balance { get; set; }

    public int ExchangeId { get; set; }

    [JsonIgnore]
    public Exchange Exchange { get; set; } = null!;

    public virtual Product? Product { get; set; }
}
