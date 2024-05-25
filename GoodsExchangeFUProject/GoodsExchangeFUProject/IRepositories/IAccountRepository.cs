using GoodsExchangeFUProject.Entities;
using GoodsExchangeFUProject.ModelsView;
using static GoodsExchangeFUProject.ModelsView.UserModel;

namespace GoodsExchangeFUProject.IRepositories
{
    public interface IAccountRepository
    {
        /*tTask<(bool, string)> AddAccoun(RegisterUserModel register);*/

        Task<(bool, string)> LoginByEmailAndPassword(LoginUserModel login);
        
    }
}
