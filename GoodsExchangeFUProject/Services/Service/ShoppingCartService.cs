using NuGet.Protocol.Core.Types;
using Repositories.Entities;
using Repositories.Repositories;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
	public class ShoppingCartService : IShoppingCartService
	{
		private readonly ShoppingCartRepository _repo;

		public ShoppingCartService(ShoppingCartRepository repo)
		{
			_repo = repo;
		}

		public async Task AddItemAsync(int userId, int productId, int quantity, decimal unitPrice)
		{
			var cart = await _repo.GetCartByUserIdAsync(userId)
				  ?? new ShoppingCart { UserId = userId, ShoppingCartItems = new List<ShoppingCartItem>() };

			var newItem = new ShoppingCartItem
			{
				ProductId = productId,
				Quantity = quantity,
				UnitPrice = unitPrice
			};

			await _repo.AddItemToCartAsync(cart.ShoppingCartId, newItem);

		}

		public async Task ClearCartAsync(int userId)
		{
			var cart = await _repo.GetCartByUserIdAsync(userId);
			if (cart != null)
			{
				await _repo.ClearCartAsync(cart.ShoppingCartId);
			}
		}

		public async Task<ShoppingCart?> GetCartAsync(int userId)
		{
			return await _repo.GetCartByUserIdAsync(userId);
		}

		public async Task RemoveItemAsync(int userId, int itemId)
		{
			var cart = await _repo.GetCartByUserIdAsync(userId);
			if (cart != null)
			{
				await _repo.RemoveItemFromCartAsync(cart.ShoppingCartId, itemId);
			}
		}
	}
}
