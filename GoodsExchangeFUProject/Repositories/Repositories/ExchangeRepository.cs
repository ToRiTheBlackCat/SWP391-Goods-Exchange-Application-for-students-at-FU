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

        public Exchange? GetExchangeById(int exchangeId)
        {
            _context = new();
            _context.ChangeTracker.LazyLoadingEnabled = false;
            var exchange = _context.Exchanges.AsNoTracking().First(e => e.ExchangeId == exchangeId);
            _context.Entry(exchange).Collection(e => e.ExchangeDetails).Load();

            return exchange;
        }

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

        public async Task ExchangeAcceptedAsync(Exchange exchange)
        {
            //Cancel every unaccepted exchange requests to this product
            await _context.Exchanges.Include(e => e.ExchangeDetails)
                .ThenInclude(ed => ed.Product)
                .Where(e => e.ProductId == exchange.ProductId && e.ExchangeId != exchange.ExchangeId)
                .ForEachAsync(e =>
                    {
                        //Set the status of related ExchangeDetail
                        e.Status = 0;
                        if (e.ExchangeDetails.First().Product != null) //If there is a product
                        {
                            //Put Product back on view page (Status = 1)
                            var product = e.ExchangeDetails.First().Product!;
                            product.Status = product.Status == 2 ? 1 : product.Status;
                        }
                    });
            exchange.Status = 1;
            var updateExchange = _context.Exchanges.Update(exchange);
            await _context.SaveChangesAsync();
        }
    }
}
