﻿using Microsoft.EntityFrameworkCore;
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

        //TRI
        public async Task<Product?> FindProductByIdAsync(int productId, int statusNum)
        {
            // Include related entities (ProductType and User) using Include method
            return await _context.Products
                .Include(p => p.Type)
                .Include(p => p.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.Status == statusNum && p.User.IsBanned == false);
        }

        //TRI
        public IQueryable<Product> ViewProductsByStatus(int statusNum)
        {
            return _context.Products
               .Include(p => p.User)
               .Where(p => p.Status == statusNum);
        }

        //TRI
        public IQueryable<Product> ViewProductsOfUser(int userId)
        {
            return _context.Products
                .Include(p => p.User)
                .Include(p => p.Type)
                .Where(p => p.User.UserId == userId);
        }
        //TRI
        public IQueryable<Product> ViewProductsOfUser(int userId, int statusNum)
        {
            return _context.Products
                .Include(p => p.User)
                .Include(p => p.Type)
                .Where(p => p.User.UserId == userId && p.Status == statusNum);
        }

        //TRI
        public async Task AddProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        //TRI
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

        //TRI
        public async Task<bool> UpdateProductByIdAsync(int productId, OwnProductModel update)
        {
            var product = await FindProductByIdAsync(productId, 1);
            if (product == null)
                return false;

            product.ProductName = update.ProductName;
            product.ProductImage = update.ProductImage;
            product.ProductDescription = update.ProductDescription;
            product.ProductPrice = update.ProductPrice;
            product.TypeId = update.TypeId;

            await _context.SaveChangesAsync();
            return true;
        }

        //=======================
        public IQueryable<Product> GetProductsByField(string? getName, string? getDesc, int? getCategoryId)
        {
            _context = new GoodsExchangeFudbContext();
            if (getName == null && getDesc == null)
            {
                getName = string.Empty;
                getDesc = string.Empty;
            }
            var list = _context.Products.AsNoTracking().Include(p => p.Type).Include(p => p.User).Where(p => p.Status == 1);
            if (getCategoryId != null)
            {
                list = list.Where(p => p.TypeId == getCategoryId);
            }
            list = list.Where(p
                => p.ProductName.Contains(getName) || p.ProductDescription.Contains(getDesc));

            return list;
        }

    }
}