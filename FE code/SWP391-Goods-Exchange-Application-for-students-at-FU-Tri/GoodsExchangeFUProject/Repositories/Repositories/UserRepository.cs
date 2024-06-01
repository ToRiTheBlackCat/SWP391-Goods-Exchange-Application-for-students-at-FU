using Microsoft.Build.Utilities;
using Microsoft.CodeAnalysis.Elfie.Extensions;
using Microsoft.EntityFrameworkCore;
using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Repositories.ModelsView.UserModel;

namespace Repositories.Repositories
{
    public class UserRepository
    {
        private GoodsExchangeFudbContext _context;
        public UserRepository(GoodsExchangeFudbContext context)
        {
            _context = context;
        }
        public async Task<(bool, User,int)> AuthenticateUser(LoginUserModel login)
        {
            string salt = "BallsInYoJaws2069";
            string loginPassword = (login.Password.Trim() + salt).ToSHA256String();
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.Trim() == login.Email.Trim() && u.Password.Trim() == loginPassword);
            if (user != null)
                return (true, user,user.UserId);
            return (false, null,0);
        }
    }
}
