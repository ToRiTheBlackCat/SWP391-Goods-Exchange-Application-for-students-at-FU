using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Repositories.ModelsView;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Repositories.Repositories
{
    public class ExchangeRepository
    {
        private GoodsExchangeFudbContext _context;
        public ExchangeRepository(GoodsExchangeFudbContext context)
        {
            _context = context;
        }

        //TRI
        public async Task AddRatingAsync(Rating rating)
        {
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
        }
        //TRI
        public async Task<Exchange?> FindExchangeByIdAsync(int exchangeId, int statusNum)
        {
            var exchange = await _context.Exchanges
                .FirstOrDefaultAsync(p => p.ExchangeId == exchangeId && p.Status == statusNum);
            if (exchange != null)
                return exchange;
            return null;
        }
        //TRI
        public async Task<bool> FindRatingByExchangeIdAsync(int exchangeId)
        {
            var rating = await _context.Ratings
                .FirstOrDefaultAsync(p => p.ExchangeId == exchangeId);
            if (rating == null)
                return false;
            return true;
        }
        //======================
        //TUAN
        public List<ExchangeModelView> GetExchangesByUser(int userId)
        {
            _context = new();
            return _context.Exchanges.AsNoTracking().Where(e => e.UserId == userId).Select(exchange => new ExchangeModelView()
            {
                ExchangeId = exchange.ExchangeId,
                OwnerId = exchange.Product.User.UserId,
                OwnerName = exchange.Product.User.UserName,
                ProductId = exchange.ProductId,
                ProductName = exchange.Product.ProductName,
                Balance = exchange.ExchangeDetails.First().Balance,
                ExProductId = exchange.ExchangeDetails.First().ProductId != null ? exchange.ExchangeDetails.First().ProductId! : null,
                ExProductName = exchange.ExchangeDetails.First().Product != null ? exchange.ExchangeDetails.First().Product!.ProductName : null,
                CreateDate = exchange.CreateDate,
                Status = exchange.Status,
            }).OrderByDescending(e => e.CreateDate).ToList();
        }

        

        //TUAN
        public IEnumerable<ExchangeSellerView> GetExchangesByProduct(int productId)
        {
            _context = new();
            return _context.Exchanges.Where(e => e.ProductId == productId && e.Status == 3).Select(e => new ExchangeSellerView()
            {
                ExProductId = !e.ExchangeDetails.IsNullOrEmpty() ? e.ExchangeDetails.First().ProductId : null,
                ExProductName = !e.ExchangeDetails.IsNullOrEmpty() ? e.ExchangeDetails.First().Product!.ProductName : null,
                Balance = !e.ExchangeDetails.IsNullOrEmpty() ? e.ExchangeDetails.First().Balance : 0,
                BuyerName = e.User.UserName,
                CreateDate = e.CreateDate,
                Status = e.Status,
                ExchangeId = e.ExchangeId,
            }).OrderByDescending(e => e.CreateDate).AsNoTracking();
        }
        //TUAN
        public async Task AddExchangeAsync(Exchange exchange, int balance, int? exProductId)
        {
            //Add new exchange
            _context = new();
            var createdExchange = _context.Exchanges.AddAsync(exchange).Result;
            await _context.SaveChangesAsync();


            var exchageId = createdExchange.Entity.ExchangeId;

            //add new exchangeDetail for exchange
            _context.ExchangeDetails.Add(new ExchangeDetail()
            {
                ProductId = exProductId,
                Balance = balance,
                ExchangeId = exchageId,
            });

            await _context.SaveChangesAsync();
        }
    }
}
