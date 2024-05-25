using Repositories.Entities;
using Repositories.ModelsView;
using static Repositories.ModelsView.UserModel;

namespace Services.IRepositories
{
    public interface IAccountService
    {
        
        Task<(bool, string)> LoginByEmailAndPassword(LoginUserModel login);
        
    }
}
