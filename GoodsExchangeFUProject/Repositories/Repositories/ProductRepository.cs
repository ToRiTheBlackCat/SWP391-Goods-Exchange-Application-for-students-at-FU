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

        public IQueryable<Product> GetProductsByField(string? getName
            , string? getDesc, int? getCategoryId)
        {
            _context = new GoodsExchangeFudbContext();
            if (getName == null && getDesc == null)
            {
                getName = string.Empty;
                getDesc = string.Empty;
            }
            var list = _context.Products.AsNoTracking().Where(p => p.Status == 1);
            if(getCategoryId != null)
            {
                list = list.Where(p => p.TypeId == getCategoryId);
            }
            list = list.Where(p
                => p.ProductName.Contains(getName) || p.ProductDescription.Contains(getDesc));

            return list;
        }
    }
}
