using GoodsExchangeFUProject.Repositories;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using Repositories.Entities;
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
        private ProductRepository _repo = new ProductRepository();
        private string String1 = "first";

        public async Task<(bool, List<Product>)> GetSortedProductsUI(ProductSortView sortView, string sortOrder, int pageIndex)
        {
            String1 = "second";
            //get products that sastify the fields
            var foundProducts = _repo.GetProductsByField(sortView.SearchString, sortView.SearchString, sortView.CategoryId);
            if (foundProducts != null)
            {
                //sort the products
                foundProducts = SortProduct(foundProducts, sortOrder);

                //paging the products
                int pageSize = 4;
                PaginatedList<Product> list = await PaginatedList<Product>.CreateAsync(foundProducts, pageIndex, pageSize);

                return (true, list);
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
        }
}
