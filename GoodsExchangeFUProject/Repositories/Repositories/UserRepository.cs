
using Microsoft.EntityFrameworkCore;
using Repositories;
using Repositories.Entities;
using static GoodsExchangeFUProject.ModelsView.UserViewModel;

namespace GoodsExchangeFUProject.Repositories
{
    public class UserRepository
    {
        private GoodsExchangeFudbContext _context;
        public async Task<bool> DuplicatedCredentials(string userName, string email, string? phone)
        {
            _context = new();
            var existUser = await _context.Users.FirstOrDefaultAsync(u 
                => u.Email == email || u.UserName == userName || u.Phone == phone);
            if (existUser != null)
            {
                return true;
            }
            return false;
        }

        public async Task CreateUser(UserRegisterView registerView, int RoleId)
        {
            _context = new();
            var list = await _context.Users.Where(u => true).FirstOrDefaultAsync();
            if (list == null) 
                return;

            
            await _context.Users.AddAsync(new User
            {
                Email = registerView.Email,
                Password = registerView.Password,
                UserName = registerView.UserName,
                RoleId = RoleId,
            });
            await _context.SaveChangesAsync();
        }
    }
}
