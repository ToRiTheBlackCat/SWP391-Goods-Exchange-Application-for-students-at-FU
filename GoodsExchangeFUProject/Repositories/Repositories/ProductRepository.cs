using Microsoft.EntityFrameworkCore;
using Repositories;
using Repositories.Entities;
using System.Linq.Expressions;

namespace GoodsExchangeFUProject.Repositories
{
    public class ProductRepository
    {
        private GoodsExchangeFudbContext _context;

        public IQueryable<Product> GetProducts()
        {
            _context = new GoodsExchangeFudbContext();
            return _context.Products.AsNoTracking();
        }

        public async Task<Product?> GetProductByIdAsync(int productId) 
        {
            _context = new();
            return await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public IQueryable<Product> GetProductsByField(string? getName
            , string? getDesc, int? getCategoryId)
        {
            _context = new GoodsExchangeFudbContext();
            if (getName == null && getDesc == null)
            {
                getName = string.Empty;
                getDesc = string.Empty;
            }
            var list = _context.Products.AsNoTracking().Include(p => p.Type).Where(p => p.Status == 1);
            if(getCategoryId != null)
            {
                list = list.Where(p => p.TypeId == getCategoryId);
            }
            list = list.Where(p
                => p.ProductName.Contains(getName) || p.ProductDescription.Contains(getDesc));

            return list;
        }

        public async Task UpdateProductAsync(Product product)
        {
            _context = new();
            var updateProduct = _context.Products.Find(product.ProductId);
            if (updateProduct != null)
            {
                updateProduct.ProductPrice = product.ProductPrice;
                updateProduct.ProductName = product.ProductName;
                updateProduct.ProductImage = product.ProductImage;
                updateProduct.ProductDescription = product.ProductDescription;
                updateProduct.TypeId = product.TypeId;
                updateProduct.UserId = product.UserId;
                updateProduct.Status = product.Status;
                await _context.SaveChangesAsync();
            }
            else 
                throw new Exception($"The Product with id={product.ProductId} was not found. Failed to update");
        }

        public async Task<Product> addProductAsync(Product product)
        {
            _context = new();
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> GetProductAvailableAsync(int productId, int Status)
        {
            _context = new();
            return await _context.Products.AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.Status == Status);
        }
    }
}
