using GoodsExchangeFU.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace GoodsExchangeFU.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly GoodsExchangeFudbContext _context;
        public static List<Product> list = new List<Product>();

        public ProductsController(GoodsExchangeFudbContext context)
        {
            _context = context ;
        }

        [HttpGet]
        public IActionResult GetAll()   
            //Status = 1: available; 2: exchanging; 0: disable
        {
            var products = _context.Products
                .Where(product => product.Status == 1)
                .Select(product => new
                {
                    product.ProductName,
                    product.ProductImage,
                    product.ProductDescription,
                    product.ProductPrice
                }).ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound();
            }

            return Ok(products);
        }

        [HttpGet("SearchProductsByName/{name}")]
        public IActionResult GetProductsByName(string name)
        {

            var products = _context.Products
             .Where(product => product.Status == 1 && product.ProductName.Contains(name))
             .Select(product => new
             {
                 product.ProductName,
                 product.ProductImage,
                 product.ProductDescription,
                 product.ProductPrice
             }).ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound();
            }

            return Ok(products);
        }

        [HttpGet("SearchProductsByCategory/{categoryID}")]
        public IActionResult GetProductsByCategory(int categoryID)
        {

            var products = _context.Products
             .Where(product => product.Status == 1 && product.TypeId == categoryID)
             .Select(product => new
             {
                 product.ProductName,
                 product.ProductImage,
                 product.ProductDescription,
                 product.Type.TypeName,
                 product.ProductPrice
             }).ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound();
            }

            return Ok(products);
        }

    }
}
