using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Repositories.ModelsView;
using static Repositories.ModelsView.UserModel;

namespace Services.Interface
{
    public interface IUserService
    {

        Task<(bool, string?, int?, string?, string?)> LoginByEmailAndPassword(LoginUserModel login);
        Task<(bool, string)> ModBanAccount(int userId);
        Task<(bool, string)> ModUnBanAccount(int userId);
        Task<List<UserModel2>> ModGetBanAccountList();
        Task<(bool, double?)> GetAverageScore(int userId);
        Task<UserModel2?> GetUserInfo(int userId);
        Task<string> UpdateUserInfo(int userId, UpdateInfoUserModel updateInfoUserModel);
        Task<List<UserModel2>> GetAllAccountList();
        Task AdminDeleteAccount(int userId );
        Task<List<AllRatingAndCommentModel>> GetAllRatingAndComment(int userId);

        //==============
        Task<string> UserForgotPasswordUI(string emailAddress);
        Task<(bool, string)> RegisterUserUI(UserRegisterModel registerModel, int n);

        Task<(bool, string?, int?, string?, string?)> GoogleAuthorizeUser(string id_token);

        Task<(bool, string)> UserResetPasswordUI(UserPassResetModel resetModel);
    }
}
