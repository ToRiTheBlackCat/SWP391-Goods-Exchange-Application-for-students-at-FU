using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.ModelsView;
using Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Repositories.Entities;
using Repositories.Repositories;
using Services.Service;


namespace GoodsExchangeFUProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExchangeController : ControllerBase
    {
        private readonly IExchangeService _exchangeService;

        public ExchangeController(IExchangeService exchangeService)
        {
            _exchangeService = exchangeService;
        }

        //TRI
        [Authorize(Roles = "admin")]
        [HttpGet("Admin/GetAllExchangeList")]
        public IActionResult GetAllExchange()
        {
            var list = _exchangeService.GetAllExchangeList();
            return Ok(list);
        }
        //TRI
        //[Authorize(Roles = "student")]
        [HttpPost("CancelExchangeList/{productID}")]
        public async Task<IActionResult> CancelExchangeListOfProduct(int productID)
        {
            var result = await _exchangeService.CancelExchangesOfProduct(productID);

            return Ok(result);
        }

        //TRI
        [Authorize(Roles = "admin")]
        [HttpGet("Admin/DashboardExchange")]
        public async Task<IActionResult> AdminDashboardExchange(string? fromDate, string? toDate)
        {
            DateOnly? fromDateParsed = null;
            DateOnly? toDateParsed = null;

            if (fromDate != null)
            {
                fromDateParsed = DateOnly.ParseExact(fromDate, "yyyy-MM-dd");
            }

            if (toDate != null)
            {
                toDateParsed = DateOnly.ParseExact(toDate, "yyyy-MM-dd");
            }
            var (allEx, waitingEx, acceptedEx, declinedEx) = await _exchangeService.AdminDashBoardExchanges(fromDateParsed, toDateParsed);
            return Ok(new
            {
                AllExchanges = allEx,
                WaitingExchanges = waitingEx,
                AcceptedExchanges = acceptedEx,
                DeclinedExchanges = declinedEx
            });

        }
        //TUAN
        // GET: api/Exchanges/EchangeRequests
        [HttpGet("EchangeRequests")]
        public IActionResult GetExchangeRequests(int userID)
        {
            var list = _exchangeService.GetExchangeOfUserUI(userID);
            return Ok(list);
        }

        //TUAN
        // GET: api/Exchanges/ProductExchanges/5
        [HttpGet("ProductExchanges/{productId}")]
        public async Task<IActionResult> GetProductExchanges(int productId)
        {
            var list = await _exchangeService.GetProductExchangesUI(productId);
            if (list.Item2 == null)
                return NotFound("The product you are finding doesn't exist!");
            return Ok(list.Item1);
        }

        //TUAN
        // POST: api/CreateExchange
        [HttpPost("CreateExchange")]
        public async Task<IActionResult> CreateExchange(ExchangeCreateView exchangeCreate)
        {
            //Create Exchange request
            var result = await _exchangeService.CreateExchangeUI(exchangeCreate);

            return Ok(result);
        }

        //TUAN
        [HttpPut("AcceptExchange")]
        public async Task<IActionResult> AcceptExchange(int exchangeId)
        {
            var (result, message) = await _exchangeService.AcceptExchangeUI(exchangeId);

            if (!result)
                return BadRequest(message);

            return Ok(message);
        }

        //TUAN
        //[Authorize(Roles = "student")]
        [HttpDelete("Student/CancelExchange")]
        public async Task<IActionResult> CancelExchange(int exchangeId)
        {
            var (result, message) = await _exchangeService.CancelExchangeUI(exchangeId);
            if (result)
                return Ok(message);
            return BadRequest(message);
        }

        //TUAN
        [HttpPut("Student/DeclineExchangeRequest")]
        public async Task<IActionResult> DeclineExchange(int exchangeId)
        {
            var (result, message) = await _exchangeService.DeclineExchangeUI(exchangeId);
            if (result)
                return Ok(message);
            return BadRequest(message);
        }

        //===============
        //TRI
        [Authorize(Roles = "student")]
        [HttpPost("Student/Rating&Comment")]
        public async Task<IActionResult> StudentRating(RatingModel ratingModel)
        {
            var (success, message) = await _exchangeService.StudentRatingAndCommentUser(ratingModel);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }
    }
}
