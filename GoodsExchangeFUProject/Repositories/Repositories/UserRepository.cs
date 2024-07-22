using Microsoft.Build.Utilities;
using Microsoft.CodeAnalysis.Elfie.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Repositories.ModelsView;
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
        public async Task<(bool, User?, int?, string?, string?)> AuthenticateUser(LoginUserModel login)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.Trim() == login.Email.Trim() && u.Password.Trim() == login.Password && u.IsBanned == false);
            if (user != null)
                return (true, user, user.UserId, user.UserName, user.Role.RoleName);
            return (false, null, 0, null, null);
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
        //TRI
        public async Task<(bool, List<decimal>?)> GetAllScoresOfUserByIdAsync(int userId)
        {
            var user = await _context.Users
                               .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return (false, null);
            }

            var listScore = await _context.Ratings
                                   .Where(r => r.UserId == userId)
                                   .Select(r => r.Score)
                                   .ToListAsync();

            return (true, listScore);
        }
        //TRI
        public async Task<User?> GetUserInfo(int userId, int statusNum)
        {
            var banned = false;
            if (statusNum == 0)
                banned = true;
            return _context.Users.Where(u => u.UserId == userId && u.IsBanned == banned).FirstOrDefault();
        }
        //TRI
        public async Task<List<User>> GetAllUserList()
        {
            return _context.Users.AsNoTracking().Where(u => u.RoleId != 1).ToList();

        }
        public async Task RemoveUser(int userId)
        {
            var user = await GetUserInfo(userId, 1);
            _context.Remove(user);
            await _context.SaveChangesAsync();
        }

        //TRI
        public async Task<List<AllRatingAndCommentModel>> GetRatingAndComment(int userId)
        {
            var ratings = await _context.Ratings
                .Include(r => r.Exchange)
                    .ThenInclude(e => e.User)
                .Include(r => r.User)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            var result = ratings.Select(r => new AllRatingAndCommentModel
            {
                RaterId = r.Exchange.UserId,
                RaterName = r.Exchange.User.UserName,
                UserId = r.UserId,
                Score = r.Score,
                Comment = r.Comment,
                RatingDate = r.RatingDate
            }).ToList();

            return result;
        }

        //======================================
        public async Task<User?> GetUserByMailAsync(string emailAddress)
        {
            if (emailAddress.IsNullOrEmpty())
                throw new Exception("Email field is null");
            _context = new();
            var user = await _context.Users.Include(u => u.Role).AsNoTracking().FirstOrDefaultAsync(u => u.Email.Equals(emailAddress) && u.RoleId == (int)RoleEnum.Student);
            if (user == null)
                return null;
            _context.Entry(user).Reference(u => u.ResetToken).Load();
            return user;
        }

        //TUAN
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

        //Tuan
        public async Task CreateUser(UserRegisterModel registerModel, int RoleId)
        {
            _context = new();
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
                Gender = registerModel.Gender,
                Dob = registerModel.Dob,
            });
            await _context.SaveChangesAsync();
        }

        //Tuan
        public async Task UpdateUserAsync(User user)
        {
            _context = new();
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        //Tuan
        public async Task<ResetToken?> GetResetTokenAsync(int userId)
        {
            _context = new GoodsExchangeFudbContext();
            return await _context.ResetTokens.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
        }

        //Tuan
        public async Task CreateResetTokenAsync(int userId, string token, DateTime createdDate)
        {
            _context = new GoodsExchangeFudbContext();
            await _context.ResetTokens.AddAsync(new ResetToken()
            {
                UserId = userId,
                CreatedDate = createdDate,
                ResetToken1 = token,
            });
            await _context.SaveChangesAsync();
        }

        //Tuan
        public async Task UpdateResetTokenAsync(ResetToken resetToken)
        {
            _context = new GoodsExchangeFudbContext();
            _context.ResetTokens.Update(resetToken);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Notification>> GetNotifications()
        {
            _context = new GoodsExchangeFudbContext();
            var notification = await _context.Notifications
                .Include(n => n.Product)
                .Include(n => n.User)
                .Include(n => n.Requester)
                .AsNoTracking()
                .ToListAsync();

            return notification;
        }

        public async Task CreateNotification(Notification notification)
        {
            _context = new GoodsExchangeFudbContext();
            var existNotification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.UserId == notification.UserId
                    && n.RequesterId == notification.RequesterId
                    && n.ProductId == notification.ProductId);

            if (existNotification != null)
            {
                existNotification.CreatedDate = notification.CreatedDate;
                await _context.SaveChangesAsync();
                throw new Exception("Chat request date updated");
            }

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
        }

        public async Task ClearOutDatedNotifications()
        {
            _context = new GoodsExchangeFudbContext();
            await _context.Notifications
                .ForEachAsync((n) =>
                {
                    if (DateTime.Now.Subtract(n.CreatedDate).TotalDays > 3.0)
                    {
                        _context.Remove(n);
                    }
                });
            await _context.SaveChangesAsync();
        }

        public async Task RemoveNotification(NotificationReceivedView receivedView)
        {
            _context = new GoodsExchangeFudbContext();
            var removedNotification = await _context.Notifications
                .FirstOrDefaultAsync(n =>
                n.ProductId == receivedView.ProductId
                && n.UserId == receivedView.UserId
                && n.RequesterId == receivedView.RequesterId);
            if (removedNotification != null)
            {
                _context.Notifications.Remove(removedNotification);
                await _context.SaveChangesAsync();
                return;
            }

            throw new Exception("Exception: Failed to remove notification");
        }
    }
}
