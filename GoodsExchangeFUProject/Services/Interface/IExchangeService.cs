using Repositories.Entities;
using Repositories.ModelsView;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IExchangeService
    {
        Task<(bool, string)> StudentRatingAndCommentUser(RatingModel rating);
        List<ExchangeModelView> GetExchangeOfUserUI(int userId);
        Task<(List<ExchangeSellerView>, Product)> GetProductExchangesUI(int productId);
        Task<String> CreateExchangeUI(ExchangeCreateView createView);
        Task<(bool, string)> AcceptExchangeUI(int exchangeId);
        List<AllExchangeModelView> GetAllExchangeList();
        Task<(bool, string)> CancelExchangeUI(int exchangeId);
    }
}
