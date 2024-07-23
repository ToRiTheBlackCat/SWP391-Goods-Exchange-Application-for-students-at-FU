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
using System.Net.Mail;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http.HttpResults;
using Google.Apis.Util;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Net.WebSockets;

namespace Services.Service
{
    public class UserService : IUserService
    {
        private readonly AuthHelper _authHelper;
        private readonly UserRepository _repo;
        private readonly ProductRepository _productRepo;
        private readonly IMapper _mapper;
        IConfiguration config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", true, true)
                        .Build();

        public UserService(AuthHelper authHelper, UserRepository repo, IMapper mapper, ProductRepository productRepo)
        {
            _authHelper = authHelper;
            _repo = repo;
            _mapper = mapper;
            _productRepo = productRepo;
        }

        //TRI
        public async Task<(bool, string?, int?, string?, string?)> LoginByEmailAndPassword(LoginUserModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return (false, "Invalid email or password", 0, null, null);
            }
            else
            {

                login.Password = ComputeSha256Hash(login.Password + config["SecurityStr:Key"]);
                var (isAuthenticated, user, id, name, role) = await _repo.AuthenticateUser(login);
                if (!isAuthenticated)
                {
                    return (false, null, 0, null, null);
                }
                else
                {
                    var token = _authHelper.GenerateJwtToken(user);
                    return (true, token, id, name, role);
                }
            }
        }

        //TRI
        public async Task<List<AllRatingAndCommentModel>> GetAllRatingAndComment(int userId)
        {
            var ratings = await _repo.GetRatingAndComment(userId);
            return ratings;
        }


        //TUAN
        public async Task<(bool, string?, int?, string?, string?)> GoogleAuthorizeUser(string id_token)
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
                    PhoneNumber = "",
                };

                try
                {
                    await _repo.CreateUser(register, (int)RoleEnum.Student);
                    getUser = await _repo.GetUserByMailAsync(payload.Email.Trim());
                }
                catch (Exception ex)
                {
                    return (false, $"Error: {ex}", getUser.UserId, getUser.UserName, getUser.Role.RoleName);
                }
            }
            else    // If there is then login
            {
                if (getUser.IsBanned)
                    return (false, "Get banned Bozo!!!", getUser.UserId, getUser.UserName, getUser.Role.RoleName);
            }

            var token = _authHelper.GenerateJwtToken(getUser);
            return (true, token, getUser.UserId, getUser.UserName, getUser.Role.RoleName);
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
                user.Password = user.Password.Trim();
                user.Email = user.Email.Trim();
                user.Phone = user.Phone.Trim();


                listOut.Add(_mapper.Map<UserModel2>(user));
            }

            return listOut;
        }
        //TRI
        public async Task<List<UserModel2>> ModGetBanAccountList()
        {
            return ConvertUserToModel(_repo.ViewUserByStatus(1).ToList());
        }
        //TRI
        public async Task<(bool, double?)> GetAverageScore(int userId)
        {
            var (userFound, listScores) = await _repo.GetAllScoresOfUserByIdAsync(userId);

            if (!userFound)
                return (false, null);

            if (listScores == null || !listScores.Any())
                return (true, 0);

            double averageScore = (double)listScores.Average();
            return (true, averageScore);
        }

        //TRI
        public async Task<UserModel2?> GetUserInfo(int userId)
        {
            var user = await _repo.GetUserInfo(userId, 1);
            if (user != null)
                return (_mapper.Map<UserModel2>(user));
            return (null);


        }
        public async Task<string> UpdateUserInfo(int userId, UpdateInfoUserModel updateInfoUserModel)
        {
            var user = await _repo.GetUserInfo(userId, 1);
            if (user != null)
            {
                try
                {
                    user.UserName = updateInfoUserModel.UserName;
                    user.Address = updateInfoUserModel.Address;
                    user.Gender = updateInfoUserModel.Gender;
                    user.Dob = updateInfoUserModel.Dob;

                    await _repo.UpdateUserAsync(user);
                }
                catch (Exception ex)
                {
                    return (ex.Message);
                }

                return "User profile updated";
            }

            return "No user found";
        }
        //TRI
        public async Task<List<UserModel2>> GetAllAccountList()
        {
            var list = await _repo.GetAllUserList();
            foreach (var x in list)
            {
                var (result, avescore) = await GetAverageScore(x.UserId);
                x.AverageScore = avescore;
            }

            return ConvertUserToModel(list);
        }

        //TRI
        public async Task AdminDeleteAccount(int userId)
        {
            await _repo.RemoveUser(userId);
        }

        //TUAN
        public async Task<string> UserForgotPasswordUI(string emailAddress)
        {
            try
            {
                //Find user with email address
                User user = await _repo.GetUserByMailAsync(emailAddress);
                if (user == null)
                    return "Account not found";
                var resetToken = user.ResetToken;
                string resetCode = AuthHelper.GenerateRandomString();
                if (resetToken == null)
                    await _repo.CreateResetTokenAsync(user.UserId, resetCode, DateTime.Now);
                else    //Refresh resetPW Token
                {
                    resetToken.ResetToken1 = resetCode;
                    resetToken.CreatedDate = DateTime.Now;
                    await _repo.UpdateResetTokenAsync(resetToken);
                }

                //Sending Reset TOKEN to email address
                SendEmail.Send(emailAddress, "FU Exchange - Password Reset", $"Your reset code is: {resetCode}");
                return $"Password reset requested. (Sent to {emailAddress})";
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.StackTrace);
                return "Encountered an Error!" + ex.Message;
            }
        }

        public async Task<(bool, string)> UserResetPasswordUI(UserPassResetModel resetModel)
        {
            if (resetModel.resetCode.IsNullOrEmpty())
                return (false, "Code not iputed!");
            try
            {
                //Find user with email address
                User? user = await _repo.GetUserByMailAsync(resetModel.Email);
                if (user == null)
                    return (false, "Account not found!");
                var resetToken = user.ResetToken;
                if (resetToken != null && resetToken.ResetToken1.Equals(resetModel.resetCode))
                {
                    if ((DateTime.Now - (DateTime)resetToken.CreatedDate!).TotalSeconds > 60 * 3)
                        return (false, "Reset code is invalid!");
                    user.Password = ComputeSha256Hash(resetModel.Password + config["SecurityStr:Key"]);
                    await _repo.UpdateUserAsync(user);
                    resetToken.ResetToken1 = "";
                    await _repo.UpdateResetTokenAsync(resetToken);
                    return (true, "Password updated.");
                }
                return (false, "Wrong reset code!");
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.StackTrace);
                return (true, ex.Message);
            }
        }

        //TUAN
        public async Task<(bool, string)> RegisterUserUI(UserRegisterModel registerModel, int roleId)
        {
            try
            {
                if (!await _repo.DuplicatedCredentials(registerModel.UserName, registerModel.Email, registerModel.PhoneNumber))
                {
                    //Encode the password
                    registerModel.Password = ComputeSha256Hash(registerModel.Password + config["SecurityStr:Key"]);

                    await _repo.CreateUser(registerModel, roleId);
                    return (true, "Registration successful!");
                }
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.StackTrace);
            }
            return (false, "Register failed");
        }

        //TUAN
        public async Task<(string, List<NotificationReceivedView>?)> GetReceivedNotifications(int userId)
        {
            try
            {
                await _repo.ClearOutDatedNotifications();
                var notifications = await _repo.GetNotifications();
                var receivedNotifications = notifications.Where(n => n.UserId == userId).OrderByDescending(n => n.CreatedDate)
                    .Select(n => new NotificationReceivedView()
                    {
                        UserId = n.UserId,
                        ProductId = n.ProductId,
                        ProductName = n.Product.ProductName,
                        RequesterId = n.RequesterId,
                        RequesterUserName = n.Requester.UserName,
                    });
                if (receivedNotifications.Count() > 0)
                    return ($"{receivedNotifications.Count()} notification(s)", receivedNotifications.ToList());

                return ($"No notifications", null);
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.StackTrace);
            }

            return ("Error fetching notifications", null);
        }

        public async Task<(string, bool)> SendNotification(NotificationSendView sendView)
        {
            try
            {
                var users = await _repo.GetAllUserList();

                var requester = users.FirstOrDefault(u => u.UserId == sendView.RequesterId && u.RoleId == 3);
                if (requester == null || requester.IsBanned)
                    throw new Exception("Your account is banned.");

                var receiver = users.FirstOrDefault(u => u.UserId == sendView.UserId && u.RoleId == 3);
                if (receiver == null || receiver.IsBanned)
                    throw new Exception("User not found or is banned.");

                if (receiver.UserId == requester.UserId)
                    throw new Exception("Can't send notification to yourself.");

                var product = await _productRepo.FindProductByIdAsync(sendView.ProductId, 1);
                if (product == null)
                    throw new Exception("Product not found or is unavailable.");

                if (product.UserId != receiver.UserId)
                    throw new Exception("Product not own by this user.");

                Notification notification = new Notification()
                {
                    UserId = sendView.UserId,
                    ProductId = sendView.ProductId,
                    RequesterId = sendView.RequesterId,
                    CreatedDate = DateTime.Now,
                };
                await _repo.CreateNotification(notification);

                return ($"Notification successfully sent to {receiver.UserName}.", true);
            }
            catch (Exception ex)
            {
                Console.Out.WriteLineAsync(ex.StackTrace);
                return ($"Failed to send notification. {ex.Message}", false);
            }
        }

        public async Task<(string, bool)> UserReplyToNotification(NotificationReceivedView receivedView)
        {
            try
            {
                await _repo.RemoveNotification(receivedView);

                var users = await _repo.GetAllUserList();
                var requester = users.FirstOrDefault(u => u.UserId == receivedView.RequesterId && u.RoleId == 3);
                if (requester == null || requester.IsBanned)
                    throw new Exception("Your account is banned.");

                var receiver = users.FirstOrDefault(u => u.UserId == receivedView.UserId && u.RoleId == 3);
                if (receiver == null || receiver.IsBanned)
                    throw new Exception("User not found or is banned.");

                if (receiver.UserId == requester.UserId)
                    throw new Exception("Can't send notification to yourself.");

                var product = await _productRepo.FindProductByIdAsync(receivedView.ProductId, 1);
                if (product == null)
                    throw new Exception("Product not found or is unavailable.");

                if (product.UserId != receiver.UserId)
                    throw new Exception("Product not own by this user.");

                return ($"Notification successfully removed(replied)", true);
            }
            catch (Exception ex)
            {
                return ($"Failed to reply to notification. {ex.Message}", false);
            }
        }
    }
}
