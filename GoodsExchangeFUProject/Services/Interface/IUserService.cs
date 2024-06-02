﻿using Repositories.Entities;
using Repositories.ModelsView;
using static Repositories.ModelsView.UserModel;

namespace Services.Interface
{
    public interface IUserService
    {
        
        Task<(bool, string, int)> LoginByEmailAndPassword(LoginUserModel login);
        Task<(bool, string)> ModBanAccount(int userId);
        Task<(bool, string)> ModUnBanAccount(int userId);

        Task<List<UserModel2>> ModGetBanAccountList();

    }
}
