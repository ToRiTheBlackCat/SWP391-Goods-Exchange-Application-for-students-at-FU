using Repositories.Entities;
using System.ComponentModel.DataAnnotations;

namespace GoodsExchangeFUProject.ModelsView
{
    public class ProductModel
    {
        public class ProductViewModel
        {
            public int ProductId { get; set; }

            public string ProductName { get; set; } = null!;

            public string ProductImage { get; set; } = null!;

            public string? ProductDescription { get; set; }

            public int ProductPrice { get; set; }

            public int UserId { get; set; }
        }

        public class ProductSortView
        {
            [StringLength(50)]
            public string? SearchString { get; set; }
            public int? CategoryId { get; set; }
        }

        public class ProductCreateView
        {
            public string ProductName { get; set; }

            public string ProductImage { get; set; }

            public string ProductDescription { get; set; }

            public int ProductPrice { get; set; }

            public int TypeId { get; set; }

            public int UserId { get; set; }
        }

    }
}
