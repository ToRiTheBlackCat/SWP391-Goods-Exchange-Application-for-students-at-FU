using Microsoft.CodeAnalysis.Text;
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
            var exchange = await _context.Exchanges.Include(ex => ex.ExchangeDetails).AsNoTracking()
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
        public List<AllExchangeModelView> GetExchangeList()
        {
            return _context.Exchanges.AsNoTracking()
                            .Where(ex => ex.Status == 1)
                            .Select(exchange => new AllExchangeModelView()
                            {
                                ExchangeId = exchange.ExchangeId,
                                ExchangeReceiver = exchange.Product.User.UserName,
                                ProductWantToGet = exchange.Product.ProductName,
                                ExchangeSender = exchange.User.UserName,
                                ProductUseToExchange = exchange.ExchangeDetails.First().Product != null ? exchange.ExchangeDetails.First().Product!.ProductName : null,
                                Balance = exchange.ExchangeDetails.First().Balance,
                                CreateDate = exchange.CreateDate,
                            }).OrderByDescending(e => e.CreateDate).ToList();
        }
        //TRI
        public async Task CancelExchangesOfProduct(int productID)
        {
            var list = _context.Exchanges.Where(e => e.ProductId ==  productID).ToList();
            foreach (var exchange in list)
            {
                var declinedExchange = await _context.Exchanges.Include(ex => ex.ExchangeDetails).FirstOrDefaultAsync(ex => ex.ExchangeId == exchange.ExchangeId && (ex.Status == 2 || ex.Status == 0));

                if (declinedExchange == null)
                    throw new Exception("Invalid exchangeId or exchange is not in WAITING.");

                if(declinedExchange.Status != 0)
                {
                    var exchangeDetails = declinedExchange.ExchangeDetails.FirstOrDefault();

                    Product exchangeProduct;
                    if (exchangeDetails.ProductId != null)//Revert product status to (1) if there is one in exDetail
                    {
                        exchangeProduct = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == exchangeDetails.ProductId && p.Status == 2);
                        if (exchangeProduct == null)
                        {
                            declinedExchange.Status = 0;
                            await _context.SaveChangesAsync();
                            throw new Exception("The product used in exchange not found or in invalid state to switch back to (1). The exchange will still be decline.");
                        }
                        exchangeProduct.Status = 1;
                    }

                    declinedExchange.Status = 0;

                    await _context.SaveChangesAsync();
                }
               
            }
        }
        public int GetAllExchangeByStatus(int status, DateOnly? fromDate, DateOnly? toDate)
        {
            IQueryable<Exchange> query = _context.Exchanges;
            //Both null 
            if (fromDate == null && toDate == null)
            {
                query = status == 4 ? query : query.Where(e => e.Status == status);
            }
            //FromDate null 
            else if (fromDate != null && toDate == null)
            {
                query = status == 4 ? query.Where(e => e.CreateDate >= fromDate) : query.Where(e => e.Status == status && e.CreateDate >= fromDate);
            }
            //ToDate null 
            else if (fromDate == null && toDate != null)
            {
                query = status == 4 ? query.Where(e => e.CreateDate <= toDate) : query.Where(e => e.Status == status && e.CreateDate <= toDate);
            }
            //Both not null 
            else if (fromDate != null && toDate != null)
            {
                query = status == 4 ? query.Where(e => e.CreateDate >= fromDate && e.CreateDate <= toDate) : query.Where(e => e.Status == status && e.CreateDate >= fromDate && e.CreateDate <= toDate);
            }


            return query.Count();
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
            return _context.Exchanges.Where(e => e.ProductId == productId && e.Status == 2).Select(e => new ExchangeSellerView()
            {
                ExProductId = e.ExchangeDetails.First().ProductId != null ? e.ExchangeDetails.First().ProductId : null,
                ExProductName = e.ExchangeDetails.First().ProductId != null ? e.ExchangeDetails.First().Product!.ProductName : null,
                Balance = e.ExchangeDetails.First().Balance,
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

        //TUAN
        public async Task RemoveExchangeAsync(int exchangeId)
        {
            _context = new();
            var exchange = await _context.Exchanges.AsNoTracking().FirstOrDefaultAsync(ex => ex.ExchangeId == exchangeId && ex.Status == 2);
            var exchangeDetails = await _context.ExchangeDetails.AsNoTracking().FirstOrDefaultAsync(ex => ex.ExchangeId == exchangeId);
            if (exchangeDetails == null || exchange == null)
                throw new Exception("Invalid exchangeId or exchange is not in WAITING.");

            Product exchangeProduct;
            if (exchangeDetails.ProductId != null)//Revert product status to (1) if there is one in exDetail
            {
                exchangeProduct = await _context.Products.FirstAsync(p => p.ProductId == exchangeDetails.ProductId);
                exchangeProduct.Status = 1;
            }

            _context.ExchangeDetails.Remove(exchangeDetails);
            _context.Exchanges.Remove(exchange);

            await _context.SaveChangesAsync();
        }

        //TUAN
        public async Task DeclineExchangeAsync(int exchangeId)
        {
            _context = new GoodsExchangeFudbContext();
            var declinedExchange = await _context.Exchanges.Include(ex => ex.ExchangeDetails).FirstOrDefaultAsync(ex => ex.ExchangeId == exchangeId && ex.Status == 2);

            if (declinedExchange == null)
                throw new Exception("Invalid exchangeId or exchange is not in WAITING.");

            var exchangeDetails = declinedExchange.ExchangeDetails.FirstOrDefault();

            Product exchangeProduct;
            if (exchangeDetails.ProductId != null)//Revert product status to (1) if there is one in exDetail
            {
                exchangeProduct = await _context.Products.FirstAsync(p => p.ProductId == exchangeDetails.ProductId && p.Status == 2);
                if (exchangeProduct == null)
                {
                    declinedExchange.Status = 0;
                    await _context.SaveChangesAsync();
                    throw new Exception("The product used in exchange not found or in invalid state to switch back to (1). The exchange will still be decline.");
                }
                exchangeProduct.Status = 1;
            }

            declinedExchange.Status = 0;

            await _context.SaveChangesAsync();
        }

        public async Task ExchangeAcceptedAsync(Exchange exchange)
        {
            //Cancel every unaccepted exchange requests to this product
            _context = new();
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
