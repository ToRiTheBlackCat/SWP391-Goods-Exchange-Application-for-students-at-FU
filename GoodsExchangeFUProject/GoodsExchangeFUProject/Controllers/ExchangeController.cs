using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.ModelsView;
using Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Repositories.Entities;
using Repositories.Repositories;


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
