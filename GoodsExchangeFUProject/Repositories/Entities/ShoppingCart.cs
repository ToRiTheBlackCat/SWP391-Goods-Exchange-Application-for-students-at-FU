using System;
using System.Collections.Generic;

namespace Repositories.Entities;

public partial class ShoppingCart
{
    public int ShoppingCartId { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedDate { get; set; }

    public decimal TotalPrice { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<ShoppingCartItem> ShoppingCartItems { get; set; } = new List<ShoppingCartItem>();
}
