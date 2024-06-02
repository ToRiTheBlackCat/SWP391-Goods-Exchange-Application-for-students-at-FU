using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.ModelsView
{
    public class CreateReportModel
    {
        public int UserId { get; set; }

        public int ProductId { get; set; }

        public string Detail { get; set; } = null!;

        public DateTime ReportDate { get; set; }
    }
    public class ViewReportModel
    {
        public int ReportId { get; set; }

        public int UserId { get; set; }

        public int ProductId { get; set; }

        public string Detail { get; set; } = null!;

        public DateTime ReportDate { get; set; }
    }
}
