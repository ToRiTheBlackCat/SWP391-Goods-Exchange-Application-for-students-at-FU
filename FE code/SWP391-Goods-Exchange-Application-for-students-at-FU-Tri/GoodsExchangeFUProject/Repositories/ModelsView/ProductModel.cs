namespace Repositories.ModelsView
{
    public class ProductModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductImage { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public int ProductPrice { get; set; }
        public ProductTypeModel ProductType { get; set; } = null!;
        public ProductOwner ProductOwner { get; set; } = null!;
    }
    public class AddNewProductModel
    {
        public string ProductName { get; set; } = null!;
        public string ProductImage { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public int ProductPrice { get; set; }
        public int TypeId { get; set; }
        public ProductOwnerV2 ProductOwnerV2 { get; set; } = null!;
    }

    public class ProductTypeModel
    {
        public int TypeId { get; set; }
    }

    public class ProductOwnerV2
    {
        public int UserId { get; set; }
    }
    public class ProductOwner
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public bool Gender { get; set; }
        public string? Address { get; set; }
        public double? AverageScore { get; set; }
    }

}
