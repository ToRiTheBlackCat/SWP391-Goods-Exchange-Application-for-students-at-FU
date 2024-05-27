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

        public async Task<Product> FindProductByIdAsync(int productId)
        {
            // Include related entities (ProductType and User) using Include method
            return await _context.Products
                .Include(p => p.Type)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.Status == 1);
        }

    }
}
