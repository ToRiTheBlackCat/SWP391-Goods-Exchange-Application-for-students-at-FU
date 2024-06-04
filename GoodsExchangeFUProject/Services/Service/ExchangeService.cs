using AutoMapper;
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

        public ExchangeService(ExchangeRepository exchangeRepository, IMapper mapper)
        {
            _repo = exchangeRepository;
            _mapper = mapper;
        }
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
    }
}
