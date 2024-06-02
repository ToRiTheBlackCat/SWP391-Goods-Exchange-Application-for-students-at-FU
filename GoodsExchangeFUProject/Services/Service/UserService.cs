using System.Linq;
using System.Threading.Tasks;
using Repositories.Entities;
using Services.Helpers;
using Services.Interface;
using Repositories.ModelsView;
using Microsoft.EntityFrameworkCore;
using static Repositories.ModelsView.UserModel;
using Repositories.Repositories;
using Microsoft.CodeAnalysis.Elfie.Extensions;
using AutoMapper;

namespace Services.Service
{
    public class UserService : IUserService
    {
        private readonly AuthHelper _authHelper;
        private readonly UserRepository _repo;
        private readonly IMapper _mapper;

        public UserService(AuthHelper authHelper, UserRepository repo, IMapper mapper)
        {
            _authHelper = authHelper;
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<(bool, string?, int)> LoginByEmailAndPassword(LoginUserModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return (false, "Invalid email or password", 0);
            }
            else
            {
                var (isAuthenticated, user,id) = await _repo.AuthenticateUser(login);
                if (!isAuthenticated)
                {
                    return (false, null, 0);
                }
                else
                {
                    var token = _authHelper.GenerateJwtToken(user);
                    return (true, token, user.UserId);
                }
            }
        }


        public async Task<(bool, string)> ModBanAccount(int userId)
        {

            var success = await _repo.UpdateUserStatusAsync(userId, 1);
            if (success)
            {
                return (true, "Account Banned");
            }
            return (false, "Account not found!");

        }


        public async Task<(bool, string)> ModUnBanAccount(int userId)
        {

            var success = await _repo.UpdateUserStatusAsync(userId, 0);
            if (success)
            {
                return (true, "Account Unbanned");
            }
            return (false, "Account not found!");

        }
        public List<UserModel2> ConvertUserToModel(List<User> listIn)
        {
            var listOut = new List<UserModel2>();
            foreach (var user in listIn)
            {
                listOut.Add(_mapper.Map<UserModel2>(user));
            }

            return listOut;
        }
        public async Task<List<UserModel2>> ModGetBanAccountList()
        {
            return ConvertUserToModel(_repo.ViewUserByStatus(1).ToList());
        }
    }
}
