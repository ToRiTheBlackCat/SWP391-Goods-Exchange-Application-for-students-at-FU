using GoodsExchangeFU.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GoodsExchangeFU.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly GoodsExchangeFudbContext _context;

        public ProductsController(GoodsExchangeFudbContext context)
        {
            _context = context ;
        }

        [HttpGet]
        public IActionResult GetAll() 
        {
            return Ok(_context.Products.ToList());
        }
    }
}
