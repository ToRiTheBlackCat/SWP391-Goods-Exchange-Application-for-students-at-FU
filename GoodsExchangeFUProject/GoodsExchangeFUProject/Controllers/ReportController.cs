using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.ModelsView;
using Services.Interface;
using Services.Service;

namespace GoodsExchangeFUProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportRepository;

        public ReportController(IReportService _reportService)
        {
            _reportRepository = _reportService;
        }

        //[Authorize(Roles = "mod")]
        [HttpGet("Mod/ViewReportList")]
        public async Task<IActionResult> ModGetReportList()
        {
            var reports = await _reportRepository.ModGetReportWaitingList();
            return Ok(reports);
        }

        //[Authorize(Roles = "student")]
        [HttpPost("Student/CreateReport")]   
        public async Task<IActionResult> StudentCreateReport(ReportModel reportModel)
        {
            var (success, message) = await _reportRepository.StudentAddNewReport(reportModel);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest("Fail to create report");
        }
    }
}
