﻿namespace Repositories.ModelsView
{
    public class ProductModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductImage { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public int ProductPrice { get; set; }
        public int TypeId { get; set; }
        public ProductOwner ProductOwner { get; set; } = null!;
    }
    public class OwnProductModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductImage { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public int ProductPrice { get; set; }
        public int TypeId { get; set; }
        public int UserId { get; set; }
    }
    public class AddNewProductModel
    {
        
        public string ProductName { get; set; } = null!;
        public string ProductImage { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public int ProductPrice { get; set; }
        public int TypeId { get; set; }
        public int UserId { get; set; }
    }
    public class UpdateProductModel
    {

        public string ProductName { get; set; } = null!;
        public string ProductImage { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public int ProductPrice { get; set; }
        public int TypeId { get; set; }
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
