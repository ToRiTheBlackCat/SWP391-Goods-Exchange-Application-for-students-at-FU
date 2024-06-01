
using Microsoft.EntityFrameworkCore;
using Repositories.Entities;

namespace Repositories.Repositories
{
    public class ReportRepository
    {
        private GoodsExchangeFudbContext _context;
        public ReportRepository(GoodsExchangeFudbContext context)
        {
            _context = context;
        }
        public async Task AddReportAsync(Report report)
        {
            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
        }
        public IQueryable<Report> ViewReportByStatus(int statusNum)
        {
            return _context.Reports
               .Where(p => p.Status == statusNum);
        }
    }
}
