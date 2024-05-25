using System.Linq;
using System.Threading.Tasks;
using Repositories.Entities;
using  Services.Helpers;
using Services.IRepositories;
using Repositories.ModelsView;
using Microsoft.EntityFrameworkCore;
using static Repositories.ModelsView.UserModel;
using Services.Helpers;

namespace Services.Repositories
{
    public class AccountService : IAccountService
    {
        private readonly GoodsExchangeFudbContext _context;
        private readonly AuthHelper _authHelper;

        public AccountService(GoodsExchangeFudbContext context, AuthHelper authHelper)
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
