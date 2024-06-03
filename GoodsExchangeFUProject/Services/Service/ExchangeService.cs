using GoodsExchangeFUProject.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using Repositories.Entities;
using Repositories.ModelsView;
using Repositories.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public class ExchangeService
    {
        private readonly ExchangeRepository _repo = new();
        private readonly ProductRepository _pro_repo = new();
        private GoodsExchangeFudbContext _context;

        public List<ExchangeModelView> GetExchangeOfUserUI(int userId)
        {
            if (_repo == null)
            {
                throw new NullReferenceException("_exchangeRepository is null");
            }

            List<ExchangeModelView> result =  _repo.GetExchangesByUser(userId);

            return result;
        }

        public async Task<String> CreateExchangeUI(ExchangeCreateView createView)
        {
            //Get exchange product(with owner info)
            //Only products that are available (Status = 1) are able to participate in exchange
            var product = await _pro_repo.GetProductAvailableAsync(createView.ProductId, 1);
            Product? exProduct = null;
            if (createView.ExProductId != null)
                exProduct = await _pro_repo.GetProductAvailableAsync((int)createView.ExProductId!, 1);
            
            if (product == null 
                || (createView.ExProductId != null && exProduct == null))
            {
                return "Product no longer available for exchange!";
            }
            else if (product.UserId == createView.UserId)
                return "You already own this product";

            if (exProduct != null && exProduct.UserId != createView.UserId) // check if the user requesting exchange
                                                                            //owns the exchange product
                return "You don't own this item. Offer your own item to exchange.";

            //Create Exchange
            var exchange = new Exchange()
            {
                ProductId = createView.ProductId,
                UserId = createView.UserId,
                CreateDate = DateOnly.FromDateTime(DateTime.Now),
                Status = 3
            };
            
            try
            {
                //Add exchange to DB
                await _repo.AddExchangeAsync(exchange, createView.balance, createView.ExProductId);

                //Change product status of ExchangeProduct to "trading"
                if (exProduct != null)
                {
                    exProduct.Status = 2;
                    await _pro_repo.UpdateProductAsync(exProduct);
                }

                
            }
            catch (Exception ex)
            {
                return ex.Message;
            }


            return "Exchange created successfully!";
        }


        public async Task<(List<ExchangeSellerView>?, Product?)> GetProductExchangesUI(int productId)
        {
            //Only get the exchanges that is waiting for the user to response
            //. Do not need to see other cases
            var exchangeProList = _repo.GetExchangesByProduct(productId).ToList();
            //Get the product to display (Just bonus)
            var product = await _pro_repo.GetProductByIdAsync(productId);
            return (exchangeProList, product);
        }


        public async Task<(bool,string)> AcceptExchangeUI(int exchangeId)
        {
            
            try
            {
                ////get Exchange enity
                //var exchange = _repo.GetExchangeById(exchangeId);
                //if (exchange == null)
                //{
                //    return (false, "Exchange doesn't exist!");
                //}

                ////Check availability of product
                //var product = await _pro_repo.GetProductAvailableAsync(exchange.ProductId, 1);
                //if (product == null)
                //    return (false, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");
                ////Check availability of ExchangeProduct entity
                //var exchangeProduct = new Product();
                //if (exchange.ExchangeDetails.SingleOrDefault() != null)
                //{
                //    exchangeProduct = await _pro_repo.GetProductAvailableAsync( (int)exchange.ExchangeDetails.Single().ProductId!, 2);
                //    if (exchangeProduct == null)
                //        return (false, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");
                //}


                ////Transfer the owner ship of products
                //if (exchangeProduct != null)
                //{
                //    exchangeProduct.Status = 0;     //set to disabled
                //    exchangeProduct.UserId = product.UserId;   //set ownership to seller
                //    //await _pro_repo.UpdateProductAsync(exchangeProduct);
                //}

                //product.Status = 0;     //set to disabled
                //product.UserId = exchange.UserId;    //set ownership to buyer
                ////await _pro_repo.UpdateProductAsync(product);

                //exchange.Status = 1;

                ////Cancel every unaccepted exchange requests to this product

                //Check of the exchange is available (!= null) and in waiting (Status == 3)

                var exchange1 = _repo.GetExchangeById(exchangeId);
                if (exchange1 == null || exchange1.Status != 3)
                    return (false, "Exchange doesn't exist or Status is invalid!");

                _context = new();
                //var exchange = await _context.Exchanges.Include(e => e.ExchangeDetails).FirstOrDefaultAsync(e => e.ExchangeId == exchangeId);
                //if (exchange == null || exchange.Status != 3)
                //{
                //    return (false, "Exchange doesn't exist or Status is invalid!");
                //}


                var product1 = await _pro_repo.GetProductAvailableAsync(exchange1.ProductId, 1);
                if (product1 == null)
                    return (false, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");

                ////Check availability of product
                //var product = await _context.Products.FirstOrDefaultAsync(e => e.ProductId == exchange.ProductId && e.Status == 1);
                //if (product == null)
                //    return (false, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");

                Product? exchangeProduct1 = null;
                if (exchange1.ExchangeDetails.Single().ProductId != null)
                {
                    exchangeProduct1 = await _pro_repo.GetProductAvailableAsync((int)exchange1.ExchangeDetails.Single().ProductId!, 2);
                    if (exchangeProduct1 == null)
                        return (false, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");
                }
                
                ////Check availability of ExchangeProduct entity
                //var exchangeProduct = new Product();
                //if (exchange.ExchangeDetails.SingleOrDefault()!.ProductId != null)
                //{
                //    exchangeProduct = await _context.Products.FirstOrDefaultAsync(e => e.ProductId == exchange.ExchangeDetails.Single()!.ProductId && e.Status == 2);
                //    if (exchangeProduct == null)
                //        return (false, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");
                //}

                var buyerId = exchange1.UserId;
                var sellerId = product1.UserId;

                //Transfer the owner ship of products (If there is a product offer)
                if (exchangeProduct1 != null)
                {
                    exchangeProduct1.Status = 0;     //set to disabled
                    exchangeProduct1.UserId = sellerId;   //set ownership to seller
                    await _pro_repo.UpdateProductAsync(exchangeProduct1);
                }

                product1.Status = 0;     //set to disabled
                product1.UserId = buyerId;    //set ownership to buyer
                await _pro_repo.UpdateProductAsync(product1);

                //Accept Exchange
                await _repo.ExchangeAcceptedAsync(exchange1);

                //Cancel every unaccepted exchange requests to this product
                //await _context.Exchanges.Include(e => e.ExchangeDetails).ThenInclude(ed => ed.Product).Where(e => e.ProductId == product.ProductId).ForEachAsync(e => 
                //                                                                                {
                //                                                                                    e.Status = 0;
                //                                                                                    if(e.ExchangeDetails.First().Product != null)
                //                                                                                    {
                //                                                                                        var product = e.ExchangeDetails.First().Product!;
                //                                                                                        product.Status = product.Status == 2 ? 1 : product.Status;
                //                                                                                    }
                //                                                                                });
                //await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
            return (false, "Failed end");
        }
    }
}
