using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.ModelsView;
using Services.Interface;

namespace GoodsExchangeFUProject.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ShoppingCartController : ControllerBase
	{
		private readonly IShoppingCartService _service;
		public ShoppingCartController(IShoppingCartService service)
		{
			_service = service;
		}

		[HttpGet]
		public async Task<IActionResult> GetCart(int userId)
		{
			var cart = await _service.GetCartAsync(userId);
			return Ok(cart);
		}

		[HttpPost]
		public async Task<IActionResult> AddItem(int userId, [FromBody] ShoppingCartItemModel itemDto)
		{
			await _service.AddItemAsync(userId, itemDto.ProductId, itemDto.Quantity, itemDto.UnitPrice);
			return Ok();
		}

		[HttpDelete]
		public async Task<IActionResult> RemoveItem(int userId, int itemId)
		{
			await _service.RemoveItemAsync(userId, itemId);
			return Ok();
		}

		[HttpDelete]
		public async Task<IActionResult> ClearCart(int userId)
		{
			await _service.ClearCartAsync(userId);
			return Ok();
		}
	}
}
