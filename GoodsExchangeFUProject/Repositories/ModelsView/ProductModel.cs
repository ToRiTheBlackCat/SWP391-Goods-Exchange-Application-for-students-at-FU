using System.ComponentModel.DataAnnotations;

namespace GoodsExchangeFUProject.ModelsView
{
    public class ProductModel
    {
        public class ProductSortView
        {
            [StringLength(50)]
            public string? SearchString { get; set; }
            public int? CategoryId { get; set; }
        }
    }
}
