using GoodsExchangeFUProject.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using Repositories.Entities;
using Repositories.Repositories;
using Services.Helpers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static GoodsExchangeFUProject.ModelsView.ProductModel;

namespace Services.Service
{
    public class ProductService
    {
        private readonly ProductRepository _repo = new ProductRepository();

        public async Task<(bool, List<ProductViewModel>)> GetSortedProductsUI(ProductSortView sortView, string sortOrder, int pageIndex)
        {
            //get products that sastify the fields
            var foundProducts = _repo
                .GetProductsByField(sortView.SearchString, sortView.SearchString, sortView.CategoryId);
            if (foundProducts != null)
            {
                //sort the products
                foundProducts = SortProduct(foundProducts, sortOrder);

                //paging the products
                int pageSize = 2;
                PaginatedList<Product> list = await PaginatedList<Product>.CreateAsync(foundProducts, pageIndex, pageSize);

                return 
                    (true,
                        list.Select(p => new ProductViewModel()
                        {
                            ProductId = p.ProductId,
                            ProductName = p.ProductName,
                            ProductDescription = p.ProductDescription,
                            ProductImage = p.ProductImage,
                            ProductPrice = p.ProductPrice,
                            UserId = p.UserId,
                        }).ToList()
                    );
            }
            //no product found
            return (false, null!);
        }

        public string? NameSort { get; set; }
        public string? PriceSort { get; set; }
        public string? CurrentSort { get; set; }
        public IQueryable<Product> SortProduct(IQueryable<Product> productsIQ, string sortOrder)
        {
            CurrentSort = sortOrder;
            NameSort = sortOrder.IsNullOrEmpty() ? "name_desc" : "";
            PriceSort = sortOrder == "Price" ? "price_desc" : "Price";

            switch (sortOrder)
            {
                case "Name":
                    productsIQ = productsIQ.OrderBy(p => p.ProductName);
                    break;
                case "name_desc":
                    productsIQ = productsIQ.OrderByDescending(p => p.ProductName);
                    break;
                case "Price":
                    productsIQ = productsIQ.OrderBy(p => p.ProductPrice);
                    break;
                case "price_desc":
                    productsIQ = productsIQ.OrderByDescending(p => p.ProductPrice);
                    break;
                default: return productsIQ;
            }
            return productsIQ;
        }

        public async Task<(bool,string)> CreateProductUI(ProductCreateView createView, IFormFile productImage)
        {
            // Create a new item listing
            var createdProduct = new Product
            {
                ProductName = createView.ProductName,
                ProductDescription = createView.ProductDescription,
                ProductImage = Path.Combine("uploads", Path.GetFileName(productImage.FileName)), // Store relative path
                ProductPrice = createView.ProductPrice,
                UserId = createView.UserId,
                TypeId = createView.TypeId,
                Status = 1, //temporally add straight to db to test
            };
            
            try
            {
                var product = await _repo.addProductAsync(createdProduct);
                return (true,"Success");
            }
            catch (Exception ex)
            {
                return (false,ex.Message);
            }
        }


        
    }
}
