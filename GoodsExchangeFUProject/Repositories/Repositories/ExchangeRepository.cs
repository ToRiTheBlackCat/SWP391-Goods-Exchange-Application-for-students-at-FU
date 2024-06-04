using Microsoft.EntityFrameworkCore;
using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
    public class ExchangeRepository
    {
        private GoodsExchangeFudbContext _context;
        public ExchangeRepository(GoodsExchangeFudbContext context)
        {
            _context = context;
        }
        public async Task AddRatingAsync(Rating rating)
        {
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
        }
        public async Task<Exchange?> FindExchangeByIdAsync(int exchangeId, int statusNum)
        {
            var exchange = await _context.Exchanges
                .FirstOrDefaultAsync(p => p.ExchangeId == exchangeId && p.Status == statusNum);
            if (exchange != null)
                return exchange;
            return null;
        }
        public async Task<bool> FindRatingByExchangeIdAsync(int exchangeId)
        {
            var rating = await _context.Ratings
                .FirstOrDefaultAsync(p => p.ExchangeId == exchangeId);
            if (rating == null)
                return false;
            return true;
        }

    }
}
