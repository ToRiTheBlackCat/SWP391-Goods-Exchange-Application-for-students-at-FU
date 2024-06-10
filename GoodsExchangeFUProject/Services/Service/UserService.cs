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
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using static Services.Helpers.EncodingClass;
using Google.Apis.Auth;

namespace Services.Service
{
    public class UserService : IUserService
    {
        private readonly AuthHelper _authHelper;
        private readonly UserRepository _repo;
        private readonly IMapper _mapper;
        IConfiguration config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", true, true)
                        .Build();

        public UserService(AuthHelper authHelper, UserRepository repo, IMapper mapper)
        {
            _authHelper = authHelper;
            _repo = repo;
            _mapper = mapper;
        }

        //TRI
        public async Task<(bool, string?, int?, string?)> LoginByEmailAndPassword(LoginUserModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return (false, "Invalid email or password", 0, null);
            }
            else
            {
                
                login.Password = ComputeSha256Hash(login.Password + config["SecurityStr:Key"]);
                var (isAuthenticated, user, id, name ) = await _repo.AuthenticateUser(login);
                if (!isAuthenticated)
                {
                    return (false, null, 0, null);
                }
                else
                {
                    var token = _authHelper.GenerateJwtToken(user);
                    return (true, token, user.UserId, user.UserName);
                }
            }
        }

        //TRI
        public async Task<(bool, string)> ModBanAccount(int userId)
        {

            var success = await _repo.UpdateUserStatusAsync(userId, 1);
            if (success)
            {
                return (true, "Account Banned");
            }
            return (false, "Account not found!");

        }
        //TRI
        public async Task<(bool, string)> ModUnBanAccount(int userId)
        {

            var success = await _repo.UpdateUserStatusAsync(userId, 0);
            if (success)
            {
                return (true, "Account Unbanned");
            }
            return (false, "Account not found!");

        }
        //TRI
        public List<UserModel2> ConvertUserToModel(List<User> listIn)
        {
            var listOut = new List<UserModel2>();
            foreach (var user in listIn)
            {
                listOut.Add(_mapper.Map<UserModel2>(user));
            }

            return listOut;
        }
        //TRI
        public async Task<List<UserModel2>> ModGetBanAccountList()
        {
            return ConvertUserToModel(_repo.ViewUserByStatus(1).ToList());
        }

        //=====================================
        //TUAN
        public async Task<(bool, string?, int)> GoogleAuthorizeUser(string id_token)
        {
            //string accountId;
            //RoleEnum role;
            var payload = await GoogleJsonWebSignature.ValidateAsync(id_token);

            //Get account with the same email address as the payload sent by Google
            var getUser = await _repo.GetUserByMailAsync(payload.Email.Trim());


            if (getUser == null)    // If there is no account then register
            {
                UserRegisterModel register = new UserRegisterModel()
                {
                    Email = payload.Email,
                    Password = ComputeSha256Hash(payload.Email + config["SecurityStr:Key"]),
                    UserName = payload.Name,
                };
                var result = await RegisterUserUI(register, (int)RoleEnum.Student);
                getUser = await _repo.GetUserByMailAsync(payload.Email.Trim());
            }
            else    // If there is then login
            {
                if (getUser.IsBanned)
                    return (false, "Get banned Bozo!!!", 0);
            }

            var token = _authHelper.GenerateJwtToken(getUser);
            return (true, token, getUser.UserId);
        }
        //TUAN
        public async Task<string> UserForgotPasswordUI(string emailAddress)
        {

            //Find user with email address
            User user = await _repo.GetUserByMailAsync(emailAddress);
            if (user == null)
                return "Not found";

            //Refresh resetPW Token

            //Sending Reset TOKEN to email address
            //*Note: set mail address to varible
            SendEmail.Send("triminh0502@gmail.com", "You seem lonely", "I can fix that...");

            return "Not found";
        }

        //TUAN
        public async Task<(bool, string)> RegisterUserUI(UserRegisterModel registerModel, int n)
        {
            if (!await _repo.DuplicatedCredentials(registerModel.UserName, registerModel.Email, registerModel.PhoneNumber))
            {
                //IConfiguration config = new ConfigurationBuilder()
                //    .SetBasePath(Directory.GetCurrentDirectory())
                //        .AddJsonFile("appsettings.json", true, true)
                //        .Build();
                registerModel.Password = ComputeSha256Hash(registerModel.Password + config["SecurityStr:Key"]);
                
                await _repo.CreateUser(registerModel, n);
                return (true, "Registration successful!");
            }
            return (false, "Register failed");
        }
    }
}
