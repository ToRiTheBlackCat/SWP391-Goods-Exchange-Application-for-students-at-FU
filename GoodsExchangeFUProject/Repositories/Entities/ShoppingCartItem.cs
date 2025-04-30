using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class ShoppingCartItem
{
    public int ShoppingCartItemId { get; set; }

    public int ShoppingCartId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public virtual ShoppingCart ShoppingCart { get; set; } = null!;
}
