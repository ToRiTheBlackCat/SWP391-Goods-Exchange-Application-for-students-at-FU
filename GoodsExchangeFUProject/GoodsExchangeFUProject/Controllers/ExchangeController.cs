using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.ModelsView;
using Services.Interface;

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
        //[Authorize(Roles = "student")]
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
