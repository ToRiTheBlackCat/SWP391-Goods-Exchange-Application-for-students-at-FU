using System.Linq;
using System.Threading.Tasks;
using GoodsExchangeFUProject.Entities;
using GoodsExchangeFUProject.Helpers;
using GoodsExchangeFUProject.IRepositories;
using GoodsExchangeFUProject.ModelsView;
using Microsoft.EntityFrameworkCore;
using static GoodsExchangeFUProject.ModelsView.UserModel;

namespace GoodsExchangeFUProject.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly GoodsExchangeFudbContext _context;
        private readonly AuthHelper _authHelper;

        public AccountRepository(GoodsExchangeFudbContext context, AuthHelper authHelper)
        {
            _context = context;
            _authHelper = authHelper;
        }

        public async Task<(bool, string)> LoginByEmailAndPassword(LoginUserModel login)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.Trim() == login.Email.Trim() && u.Password.Trim() == login.Password.Trim());

            if (user == null)
            {
                return (false, "Invalid email or password");
            }

            var token = _authHelper.GenerateJwtToken(user);
            return (true, token);
        }
    }
}
