using Microsoft.Build.Utilities;
using Microsoft.CodeAnalysis.Elfie.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Repositories.ModelsView.UserModel;
using Task = System.Threading.Tasks.Task;

namespace Repositories.Repositories
{
    public class UserRepository
    {
        private GoodsExchangeFudbContext _context;
        public UserRepository(GoodsExchangeFudbContext context)
        {
            _context = context;
        }
        //TRI
        public async Task<(bool, User?, int)> AuthenticateUser(LoginUserModel login)
        {
            //string salt = "BallsInYoJaws2069";
            //string loginPassword = (login.Password.Trim() + salt).ToSHA256String();
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.Trim() == login.Email.Trim() && u.Password.Trim() == login.Password);
            if (user != null)
                return (true, user, user.UserId);
            return (false, null, 0);
        }

        //TRI
        public async Task<bool> UpdateUserStatusAsync(int userId, int status)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            user.IsBanned = status == 1 ? true : false;
            await _context.SaveChangesAsync();
            return true;
        }

        //TRI
        public IQueryable<User> ViewUserByStatus(int status)
        {
            var ban = status == 1 ? true : false;
            return _context.Users
               .Where(p => p.IsBanned == ban);
        }

        //======================================
        public async Task<User> GetUserByMailAsync(string emailAddress)
        {
            if (emailAddress.IsNullOrEmpty())
                throw new Exception("Email field is null");
            _context = new();
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email.Equals(emailAddress) && u.RoleId == (int)RoleEnum.Admin);
            _context.Entry(user).Reference(u => u.ResetToken).Load();
            if (user == null)
                throw new Exception("No user with this email!");
            return user;
        }

        //TUAN
        public async Task<bool> DuplicatedCredentials(string userName, string email, string? phone)
        {
           
            var existUser = await _context.Users.FirstOrDefaultAsync(u
                => u.Email == email || u.UserName == userName || u.Phone == phone);
            if (existUser != null)
            {
                return true;
            }
            return false;
        }

        public async Task CreateUser(UserRegisterModel registerModel, int RoleId)
        {
            
            var list = await _context.Users.Where(u => true).FirstOrDefaultAsync();
            if (list == null)
                return;


            await _context.Users.AddAsync(new User
            {
                Email = registerModel.Email,
                Password = registerModel.Password,
                UserName = registerModel.UserName,
                Phone = registerModel.PhoneNumber,
                Address = registerModel.Address,
                RoleId = RoleId,
            }); 
            await _context.SaveChangesAsync();
        }
    }
}
