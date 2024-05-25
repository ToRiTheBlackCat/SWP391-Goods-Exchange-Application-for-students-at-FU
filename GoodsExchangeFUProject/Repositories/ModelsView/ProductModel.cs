namespace Repositories.ModelsView
{
    public class ProductModel
    {
        public string ProductName { get; set; } = null!;

        public string ProductImage { get; set; } = null!;

        public string? ProductDescription { get; set; }

        public int ProductPrice { get; set; }
    }
}
