using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.ModelsView
{
    public class RatingModel
    {
        public int ExchangeId { get; set; }

        public int UserId { get; set; }

        public decimal Score { get; set; }

        public string? Comment { get; set; }

        public DateTime RatingDate { get; set; }
    }
    public class AllRatingAndCommentModel
    {
        public int RaterId {  get; set; }
        public string RaterName { get; set; }
        public int UserId { get; set; }
        public decimal Score { get; set; }
        public string? Comment { get; set; }
        public DateTime RatingDate { get; set; }
    }
}
