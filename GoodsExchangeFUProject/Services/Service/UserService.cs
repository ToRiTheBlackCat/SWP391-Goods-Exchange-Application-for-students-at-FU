
using GoodsExchangeFUProject.Repositories;
using Microsoft.Extensions.Configuration;
using Services.Helpers;
using static GoodsExchangeFUProject.ModelsView.UserViewModel;
using static Services.Helpers.EncodingClass;
using Repositories.Entities;

namespace Services.Service
{
    public class UserService
    {
        private UserRepository _repo = new UserRepository();

        public async Task<(bool, string)> RegisterUserUI(UserRegisterView registerView)
        {
            if (!await _repo.DuplicatedCredentials(registerView.UserName, registerView.Email, registerView.PhoneNumber))
            {
                IConfiguration config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", true, true)
                        .Build();
                registerView.Password = ComputeSha256Hash(registerView.Password + config["SecurityStr:Key"]);
                await _repo.CreateUser(registerView, (int)RoleEnum.Student);
                return (true, "Registration successful!");
            }

            return (false, "Register failed");
        }

        public async Task<(bool, string)> RegisterModUI(UserRegisterView registerView)
        {
            if (!await _repo.DuplicatedCredentials(registerView.UserName, registerView.Email, registerView.PhoneNumber))
            {
                IConfiguration config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", true, true)
                        .Build();
                registerView.Password = ComputeSha256Hash(registerView.Password + config["SecurityStr:Key"]);
                await _repo.CreateUser(registerView, (int)RoleEnum.Modderator);
                return (true, "Registration successful!");
            }

            return (false, "Register failed");
        }

        //public async Task<(bool, string)> LoginUserUI(UserLoginView loginView)
        //{
        //    if (await _repo.DuplicatedCredentials(loginView))
        //    {

        //    }
        //}
    }
}
