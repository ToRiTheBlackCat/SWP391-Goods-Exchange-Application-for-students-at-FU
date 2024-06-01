using Repositories.ModelsView;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IReportService
    {
        Task<(bool, string)> StudentAddNewReport(ReportModel reportModel);
        Task<List<ReportModel>> ModGetReportWaitingList();
    }
}
