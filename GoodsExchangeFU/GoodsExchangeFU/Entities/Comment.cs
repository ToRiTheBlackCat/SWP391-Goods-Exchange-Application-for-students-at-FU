using System;
using System.Collections.Generic;

namespace GoodsExchangeFU.Entities;

public partial class Comment
{
    public int UserId { get; set; }

    public int ProductId { get; set; }

    public string Detail { get; set; } = null!;

    public DateTime CommentDate { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
