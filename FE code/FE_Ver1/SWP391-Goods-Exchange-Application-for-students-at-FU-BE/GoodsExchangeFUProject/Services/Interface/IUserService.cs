﻿using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Repositories.ModelsView;
using static Repositories.ModelsView.UserModel;

namespace Services.Interface
{
    public interface IUserService
    {
        
        Task<(bool, string?, int?, string?)> LoginByEmailAndPassword(LoginUserModel login);
        Task<(bool, string)> ModBanAccount(int userId);
        Task<(bool, string)> ModUnBanAccount(int userId);
        Task<List<UserModel2>> ModGetBanAccountList();

        //==============
        Task<string> UserForgotPasswordUI(string emailAddress);
        Task<(bool, string)> RegisterUserUI(UserRegisterModel registerModel, int n);

        Task<(bool, string?, int)> GoogleAuthorizeUser(string id_token);

        Task<(bool, string)> UserResetPasswordUI(UserPassResetModel resetModel);
    }
}