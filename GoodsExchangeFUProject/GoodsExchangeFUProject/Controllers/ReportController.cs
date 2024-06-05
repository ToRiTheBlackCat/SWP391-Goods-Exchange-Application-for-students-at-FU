using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.ModelsView;
using Services.Interface;
using Services.Service;
using Microsoft.AspNetCore.Authorization;


namespace GoodsExchangeFUProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        //TRI
        [Authorize(Roles = "mod")]
        [HttpGet("Mod/ViewReportList")]
        public async Task<IActionResult> ModGetReportList()
        {
            var reports = await _reportService.ModGetReportWaitingList();
            return Ok(reports);
        }

        //TRI
        [Authorize(Roles = "mod")]
        [HttpPost("Mod/MarkDoneReport/{reportId}")]
        public async Task<IActionResult> ModMarkDoneReport(int reportId)
        {
            var (success, message) = await _reportService.ModMarkDoneReport(reportId);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //TRI
        [Authorize(Roles = "student")]
        [HttpPost("Student/CreateReport")]   
        public async Task<IActionResult> StudentCreateReport(CreateReportModel createReportModel)
        {
            var (success, message) = await _reportService.StudentAddNewReport(createReportModel);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest("Fail to create report");
        }
    }
}
