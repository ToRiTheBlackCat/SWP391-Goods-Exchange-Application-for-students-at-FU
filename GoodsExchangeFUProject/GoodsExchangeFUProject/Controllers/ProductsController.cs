using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GoodsExchangeFUProject.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Repositories;
using Repositories.Entities;
using Services.Service;
using static GoodsExchangeFUProject.ModelsView.ProductModel;

namespace GoodsExchangeFUProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly GoodsExchangeFudbContext _context;
        private readonly IWebHostEnvironment _env;

        private ProductService _service = new();

        public ProductsController(GoodsExchangeFudbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public string NameSort { get; set; }
        public string PriceSort { get; set; }
        public string CurrentFilter { get; set; }
        public string CurrentSort { get; set; }

        // GET: api/Products
        [HttpGet("GetSorted")]
        public async Task<ActionResult<List<ProductViewModel>>> GetProducts(int pageIndex, string? sortString, int? cateId, string sortOder = null!)
        {
            ProductSortView sortView = new ProductSortView()
            {
                SearchString = sortString,
                CategoryId = cateId,
            };
            if (!(pageIndex > 0)) pageIndex = 1; 
            (bool, List<ProductViewModel>) sortedList = await _service.GetSortedProductsUI(sortView, sortOder, pageIndex);


            return Ok(sortedList.Item2);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // GET: api/Products/Create
        [HttpGet("Create")]
        public IActionResult GetProductCreate()
        {
            //// Construct the path to the HTML file within the content root directory
            //var htmlPath = Path.Combine(_env.ContentRootPath, "Pages", "ProductsController.cs.html");

            //// Check if the HTML file exists
            //if (!System.IO.File.Exists(htmlPath))
            //{
            //    return NotFound(); // Return 404 if HTML file doesn't exist
            //}

            //// Read the content of the HTML file
            //var htmlContent = System.IO.File.ReadAllText(htmlPath);

            //// Return the HTML content with the appropriate content type
            //return Content(htmlContent, "text/html");

            return Ok();


        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.ProductId)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products/Create
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Create")]
        public async Task<IActionResult> CreateItem(ProductCreateView product, IFormFile productImage)
        {
            if (productImage == null || productImage.Length == 0)
            {
                return BadRequest("No image uploaded.");
            }

            var uploadPath = Path.Combine(_env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadPath); // Ensure the directory exists

            var filePath = Path.Combine(uploadPath, Path.GetFileName(productImage.FileName));

            // Save the image to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await productImage.CopyToAsync(stream);
            }

            (bool,string) success = await _service.CreateProductUI(product, productImage);
            if (success.Item1) 
                return Ok(product);

            return StatusCode(500, $"Falied to add product: {success.Item2}");
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
