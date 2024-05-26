using System.Linq;
using System.Threading.Tasks;
using Repositories.Entities;
using  Services.Helpers;
using Services.Interface;
using Repositories.ModelsView;
using Microsoft.EntityFrameworkCore;
using static Repositories.ModelsView.UserModel;
using  Repositories.Repositories;
using Services.Helpers;
using Microsoft.CodeAnalysis.Elfie.Extensions;

namespace Services.Service
{
    public class UserService : IUserService
    {
        private readonly AuthHelper _authHelper;
        private readonly UserRepository _repo;

        public UserService(AuthHelper authHelper, UserRepository repo)
        {
            _authHelper = authHelper;
            _repo = repo;
        }

        public async Task<(bool, string)> LoginByEmailAndPassword(LoginUserModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return (false, "Invalid email or password");
            }
            else
            {
                var (isAuthenticated, user) = await _repo.AuthenticateUser(login);
                if (!isAuthenticated)
                {
                    return (false, null);
                }
                else
                {
                    var token = _authHelper.GenerateJwtToken(user);
                    return (true, token);
                }
            }
        }
    }
}
