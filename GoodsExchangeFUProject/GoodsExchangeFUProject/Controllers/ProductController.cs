using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using Services.Service;

namespace GoodsExchangeFUProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        //[Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> PostProduct(int id)    
        {
            var (success, productModel) = await _productService.GetProductDetail(id);
            if (success)
            {
                return Ok(productModel);
            }
            return NotFound("Product does not exist");
        }
    }
}
