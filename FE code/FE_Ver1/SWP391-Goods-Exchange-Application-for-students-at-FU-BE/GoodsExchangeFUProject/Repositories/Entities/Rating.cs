using System;
using System.Collections.Generic;

namespace Repositories.Entities
{



    public partial class Rating
    {
        public int RatingId { get; set; }
        public int ExchangeId { get; set; }

        public int UserId { get; set; }

        public decimal Score { get; set; }

        public string? Comment { get; set; }

        public DateTime RatingDate { get; set; }

        public virtual Exchange Exchange { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}
