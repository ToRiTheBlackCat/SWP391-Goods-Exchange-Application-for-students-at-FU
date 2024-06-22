using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.ModelsView
{
    public class ExchangeCreateView
    {
        public int UserId { get; set; }

        public int ProductId { get; set; }

        public int balance { get; set; } = 0;

        public int? ExProductId { get; set; } = null!;

        public int Status { get; set; }
        //Status: 0 - rejected, 1 - acepted, 2 - waiting


    }

    public class ExchangeModelView
    {
        public int ExchangeId { get; set; }

        public int OwnerId { get; set; }

        public string OwnerName { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public int? Balance { get; set; }

        public int? ExProductId { get; set; }

        public string? ExProductName { get; set; }


        public DateOnly CreateDate { get; set; }

        public int Status { get; set; }
        //Status: 0 - rejected, 1 - acepted, 2 - waiting
    }

    public class ExchangeSellerView
    {
        public int ExchangeId { get; set; }
        public int? ExProductId { get; set; }
        public string? ExProductName { get; set; }
        public int? Balance { get; set; }
        public string BuyerName { get; set; }
        public DateOnly CreateDate { get; set; }
        public int Status { get; set; }
        //Status: 0 - rejected, 1 - acepted, 2 - waiting
    }

}
