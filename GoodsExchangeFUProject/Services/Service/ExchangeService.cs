using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Repositories.Entities;
using Repositories.ModelsView;
using Repositories.Repositories;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public class ExchangeService : IExchangeService
    {
        private readonly ExchangeRepository _repo;
        private readonly IMapper _mapper;
        private readonly ProductRepository _pro_repo;

        public ExchangeService(ExchangeRepository exchangeRepository, IMapper mapper, ProductRepository pro_repo)
        {
            _repo = exchangeRepository;
            _mapper = mapper;
            _pro_repo = pro_repo;
        }
        //TRI
        public async Task<(bool, string)> StudentRatingAndCommentUser(RatingModel ratingModel)
        {
            var findExchange = await _repo.FindExchangeByIdAsync(ratingModel.ExchangeId,1);
            if (findExchange != null)
            {
                bool findRating = await _repo.FindRatingByExchangeIdAsync(findExchange.ExchangeId);
                if (findRating) 
                {
                    return (false, "Exchange aldready has rating/ comment");
                }
                else
                {
                    var rating = _mapper.Map<Rating>(ratingModel);
                    await _repo.AddRatingAsync(rating);
                    return (true, "Rating successfully.");
                }
            }
            else
                return (false, "ExchangeId not existed or exchange not completed");
        }
        //TRI
        public List<AllExchangeModelView> GetAllExchangeList()
        {
            List<AllExchangeModelView> list = _repo.GetExchangeList();
            return list;
        }

        //=================

        //TUAN
        public List<ExchangeModelView> GetExchangeOfUserUI(int userId)
        {
            if (_repo == null)
            {
                throw new NullReferenceException("_exchangeRepository is null");
            }

            List<ExchangeModelView> result = _repo.GetExchangesByUser(userId);

            return result;
        }
        

        //TUAN
        public async Task<(List<ExchangeSellerView>?, Product?)> GetProductExchangesUI(int productId)
        {
            //Only get the exchanges that is waiting for the user to response
            //. Do not need to see other cases
            var exchangeProList = _repo.GetExchangesByProduct(productId).ToList();
            //Get the product to display (Just bonus)
            var product = await _pro_repo.FindProductByIdAsync(productId,1);
            return (exchangeProList, product);
        }

        //TUAN
        public async Task<String> CreateExchangeUI(ExchangeCreateView createView)
        {
            //Get exchange product(with owner info)
            //Only products that are available (Status = 1) are able to participate in exchange
            var product = await _pro_repo.FindProductByIdAsync(createView.ProductId, 1);
            Product? exProduct = null;
            if (createView.ExProductId != null)
                exProduct = await _pro_repo.FindProductByIdAsync((int)createView.ExProductId!, 1);

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
                Status = createView.Status,
            };

            try
            {
                //Add exchange to DB
                await _repo.AddExchangeAsync(exchange, createView.balance, createView.ExProductId);

                //Change product status of ExchangeProduct to "trading"
                if (exProduct != null)
                {
                    
                    await _pro_repo.UpdateProductStatusAsync(exProduct.ProductId,2);
                }


            }
            catch (Exception ex)
            {
                return ex.Message;
            }


            return "Exchange created successfully!";
        }

        //TUAN
        public async Task<(bool, string)> AcceptExchangeUI(int exchangeId)
        {

            try
            {

                var exchange1 = await _repo.FindExchangeByIdAsync(exchangeId, 2);
                if (exchange1 == null)
                    return (true, "Exchange doesn't exist or Status is invalid!");


                var product1 = await _pro_repo.FindProductByIdAsync(exchange1.ProductId, 1);
                if (product1 == null)
                    return (true, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");

                Product? exchangeProduct = null;
                if (exchange1.ExchangeDetails.Single().ProductId != null)
                {
                    exchangeProduct = await _pro_repo.FindProductByIdAsync((int)exchange1.ExchangeDetails.Single().ProductId!, 2);
                    if (exchangeProduct == null)
                        return (true, "Your product currently is currently not available for exchanging! (Check if it has been banned or removed)");
                }

                //var buyerId = exchange1.UserId;
                //var sellerId = product1.UserId;

                //Transfer the owner ship of products (If there is a product offer)
                if (exchangeProduct != null)
                {
                    exchangeProduct.Status = 0;     //set to disabled
                    //exchangeProduct1.UserId = sellerId;   //set ownership to seller
                    await _pro_repo.UpdateProductStatusAsync(exchangeProduct.ProductId, 0);
                }

                product1.Status = 0;     //set to disabled
                //product1.UserId = buyerId;    //set ownership to buyer
                await _pro_repo.UpdateProductStatusAsync(product1.ProductId, 0);

                //Accept Exchange
                await _repo.ExchangeAcceptedAsync(exchange1);
                return (true, "Exchange accepted");
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        ////TUAN
        //public async Task<String> cancelExchangeUI(int exchangeId)
        //{
        //    //find the exchange that is still WAITING (2)

        //    if ( exchange == null)
        //    {
        //        //return 
                
        //    }

        //    try
        //    {
        //        //try Removing the exchange
        //        await _repo.RemoveExchangeAsync(exchangeId);
        //    }
        //    catch (Exception ex)
        //    {
                
        //    }
        //}
    }
}
