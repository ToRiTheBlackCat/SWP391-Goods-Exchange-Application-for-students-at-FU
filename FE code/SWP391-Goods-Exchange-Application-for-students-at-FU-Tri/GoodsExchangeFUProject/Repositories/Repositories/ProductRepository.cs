using Microsoft.EntityFrameworkCore;
using Repositories.Entities;
using Repositories.ModelsView;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
    public class ProductRepository
    {
        private GoodsExchangeFudbContext _context;
        public ProductRepository(GoodsExchangeFudbContext context)
        {
            _context = context;
        }

        public async Task<Product> FindProductByIdAsync(int productId, int statusNum)
        {
            // Include related entities (ProductType and User) using Include method
            return await _context.Products
                .Include(p => p.Type)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.Status == statusNum);
        }
        public IQueryable<Product> ViewProductsByStatus(int statusNum)
        {
             return _context.Products
                .Include(p => p.User)
                .Where(p => p.Status == statusNum);
        }

        public async Task AddProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateProductStatusAsync(int productId, int status)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return false;
            }
            product.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
