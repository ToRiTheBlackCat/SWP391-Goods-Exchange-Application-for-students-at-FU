﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        //[Authorize(Roles = "admin")]
        //[Authorize(Roles = "mod")]

        [HttpGet("Student/ViewProductDetailWithId/{id}")]
        public async Task<IActionResult> StudentViewProductDetailWithID(int id)    
        {
            var (success, productModel) = await _productService.GetProductDetail(id);
            if (success)
            {
                return Ok(productModel);
            }
            return NotFound("Product does not exist");
        }

        //[Authorize(Roles = "mod")]
        [HttpGet("Mod/ViewProductWaitingList")]
        public async Task<IActionResult> ModGetProductWaitingList()
        {
            var products = await _productService.ModGetProductWaitingList();
            return Ok(products);
        }

        //[Authorize(Roles = "Student")]
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

        //[Authorize(Roles = "mod")]
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

        //[Authorize(Roles = "mod")]
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

    }
}
