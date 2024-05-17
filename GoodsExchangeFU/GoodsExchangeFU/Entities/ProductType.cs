using System;
using System.Collections.Generic;

namespace GoodsExchangeFU.Entities;

public partial class ProductType
{
    public int TypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
