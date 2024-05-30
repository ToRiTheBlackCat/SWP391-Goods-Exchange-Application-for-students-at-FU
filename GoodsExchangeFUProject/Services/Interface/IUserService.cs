using Repositories.Entities;
using Repositories.ModelsView;
using static Repositories.ModelsView.UserModel;

namespace Services.Interface
{
    public interface IUserService
    {
        
        Task<(bool, string, int)> LoginByEmailAndPassword(LoginUserModel login);
        
    }
}
