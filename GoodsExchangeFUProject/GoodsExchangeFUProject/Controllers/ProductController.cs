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
        private readonly IWebHostEnvironment _env;
        public ProductController(IProductService productService, IWebHostEnvironment env)
        {
            _productService = productService;
            _env = env;
        }

        //TRI
        //[Authorize(Roles = "student")]
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
        //[Authorize(Roles = "student")]
        [HttpGet("Student/ViewOwnProductList/{userId}")]
        public async Task<IActionResult> StudentViewOwnProductList(int userId)  //Xem tất cả sản phẩm trong productList tất cả status 
        {
            var list = await _productService.StudentViewOwnProductList(userId);
            return Ok(list);
        }
        //TRI
        //[Authorize(Roles = "student")]
        [HttpGet("Student/ViewOwnAvailableProductList/{userId}")]
        public async Task<IActionResult> StudentViewOwnAvailableProductList(int userId)     //Xem chỉ được các product đang available với status = 1 
        {
            var list = await _productService.StudentViewOwnProductList(userId, 1);
            return Ok(list);
        }

        //TRI
        [Authorize(Roles = "student")]
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
        //[Authorize(Roles = "student")]
        [HttpPost("Student/AddNewProduct")]
        public async Task<IActionResult> StudentAddNewProduct([FromForm] AddNewProductModel addNewProductModel,
            [FromForm] IFormFile? productImage)
        {
            if (productImage == null || productImage.Length == 0)
            {
                return BadRequest("No image uploaded.");
            }

            var uploadPath = Path.Combine(_env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadPath); // Ensure the directory exists

            //path to the location to save image (with the file name included) .ie : <solution>/uploads/<filename>.<ext>
            var filePath = Path.Combine(uploadPath, Path.GetFileName(productImage.FileName));

            // Save the image to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await productImage.CopyToAsync(stream);
            }

            //Generate image path and create Product
            //string imagePath = Path.Combine("uploads", Path.GetFileName(productImage.FileName));
            addNewProductModel.ProductImage = productImage.FileName;
            var (success, message) = await _productService.StudentAddNewProduct(addNewProductModel);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //Maybe used for display for image?
        private string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return ext switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream",
            };
        }

        //[HttpGet("{fileName}")]
        //public async Task<IActionResult> GetImage(string fileName)
        //{
        //    var imagePath = Path.Combine(_environment.WebRootPath, "images", fileName);

        //    if (!System.IO.File.Exists(imagePath))
        //    {
        //        return NotFound();
        //    }

        //    var image = await System.IO.File.ReadAllBytesAsync(imagePath);
        //    var contentType = GetContentType(imagePath);
        //    return File(image, contentType);
        //}


        [HttpGet("GetUserImage")]
        public IActionResult GetUserImage(string imageName)
        {
            //get path to the image requested
            var imagePath = Path.Combine(_env.ContentRootPath, "uploads", imageName);

            if (!System.IO.File.Exists(imagePath))
            {
                return NoContent();
            }

            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                using (var defaultUserImg = new FileStream(imagePath, FileMode.Open))
                {
                    defaultUserImg.CopyTo(ms);
                }
                fileBytes = ms.ToArray();
            }

            string base64String = Convert.ToBase64String(fileBytes);
            return Ok(base64String);
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
        [Authorize(Roles = "student")]
        [HttpPut("Student/UpdateProduct")]
        public async Task<IActionResult> StudentUpdateProduct([FromForm] OwnProductModel updateProduct,
            [FromForm] IFormFile? productImage)
        {
            if (productImage == null || productImage.Length == 0)
            {

            }
            else
            {
                var uploadPath = Path.Combine(_env.ContentRootPath, "uploads");
                Directory.CreateDirectory(uploadPath); // Ensure the directory exists

                //path to the location to save image (with the file name included) .ie : <solution>/uploads/<filename>.<ext>
                var filePath = Path.Combine(uploadPath, Path.GetFileName(productImage.FileName));

                // Save the image to the server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productImage.CopyToAsync(stream);
                }

                //Generate image path and create Product
                //string imagePath = Path.Combine("uploads", Path.GetFileName(productImage.FileName));
                updateProduct.ProductImage = productImage.FileName;
            }

            var (success, message) = await _productService.StudentUpdateProduct(updateProduct);
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
        [AllowAnonymous]
        public async Task<ActionResult<List<ViewAllProductModel>>> GetProductsSorted(int pageIndex, string? searchString, int? cateId, int? fromPrice, int? toPrice, string sortOder = null!)
        {
            ProductSortView sortView = new ProductSortView()
            {
                SearchString = searchString,
                CategoryId = cateId,
                FromPrice = fromPrice,
                ToPrice = toPrice,  
            };
            if (!(pageIndex > 0)) pageIndex = 1;
            var (result, list, pageSize) = await _productService.GetSortedProductsUI(sortView, sortOder, pageIndex);
            if (result){
                return Ok(new
                {
                    FoundList = list,
                    PageSize = pageSize,
                });
                //return Ok(list);
            }

            return BadRequest("Internal error");
        }
    }
}
