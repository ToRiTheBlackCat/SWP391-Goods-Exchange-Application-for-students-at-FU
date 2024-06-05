using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Repositories.ModelsView;
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

        //TRI
        [Authorize(Roles = "student")]
        [HttpGet("Student/ViewProductDetailWithId/{id}")]   //View detail from all and from self
        public async Task<IActionResult> StudentViewProductDetailWithID(int id)    
        {
            var (success, productModel) = await _productService.GetProductDetail(id);
            if (success)
            {
                return Ok(productModel);
            }
            return NotFound("Product does not exist");
        }

        //TRI
        [Authorize(Roles = "mod")]
        [HttpGet("Mod/ViewProductWaitingList")]
        public async Task<IActionResult> ModGetProductWaitingList()
        {
            var products = await _productService.ModGetProductWaitingList();
            return Ok(products);
        }

        //TRI
        [Authorize(Roles = "Student")]
        [HttpGet("Student/ViewOwnProductList/{userId}")]
        public async Task<IActionResult> StudentViewOwnProductList(int userId)
        {
            var list = await _productService.StudentViewOwnProductList(userId);
            return Ok(list);
        }

        //TRI
        [Authorize(Roles = "Student")]
        [HttpPost("Student/DeleteProduct/{productId}")]
        public async Task<IActionResult> StudentDeleteProduct(int productId)
        {
            var (success, message) = await _productService.StudentDeleteProduct(productId);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //TRI
        [Authorize(Roles = "Student")]
        [HttpPost("Student/AddNewProduct")]
        public async Task<IActionResult> StudentAddNewProduct(AddNewProductModel addNewProductModel)
        {
            var (success, message) = await _productService.StudentAddNewProduct(addNewProductModel);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //TRI
        [Authorize(Roles = "mod")]
        [HttpPost("Mod/AcceptProductInWaitingList/{id}")]
        public async Task<IActionResult> ModAcceptProductInWaitingList(int id)
        {
            var (success, message) = await _productService.ModAcceptProduct(id);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //TRI
        [Authorize(Roles = "mod")]
        [HttpPost("Mod/RejectProduct/{id}")]
        public async Task<IActionResult> ModRejectProductInWaitingList(int id)
        {
            var (success, message) = await _productService.ModRejectProduct(id);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //TRI
        [Authorize(Roles = "Student")]
        [HttpPut("Student/UpdateProduct")]
        public async Task<IActionResult> StudentUpdateProduct([FromBody] OwnProductModel product)
        {
            var (success, message) = await _productService.StudentUpdateProduct(product);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //=====================
        //TUAN
        // GET: api/Products
        [HttpGet("GetSorted")]
        public async Task<ActionResult<List<ViewAllProductModel>>> GetProductsSorted(int pageIndex, string? sortString, int? cateId, string sortOder = null!)
        {
            ProductSortView sortView = new ProductSortView()
            {
                SearchString = sortString,
                CategoryId = cateId,
            };
            if (!(pageIndex > 0)) pageIndex = 1;
            (bool, List<ViewAllProductModel>) sortedList = await _productService.GetSortedProductsUI(sortView, sortOder, pageIndex);


            return Ok(sortedList.Item2);
        }
    }
}
