using Microsoft.EntityFrameworkCore;
using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
	public class ShoppingCartRepository
	{
		private GoodsExchangeFudbContext _context;
		public ShoppingCartRepository(GoodsExchangeFudbContext context)
		{
			_context = context;
		}
		public async Task<ShoppingCart?> GetCartByCartId(int cartId)
		{
			return await _context.ShoppingCarts
							.FirstOrDefaultAsync(c => c.ShoppingCartId == cartId);
		}
		public async Task<ShoppingCart?> GetCartByUserIdAsync(int userID)
		{
			var foundCart = await _context.ShoppingCarts
							.Include(c => c.ShoppingCartItems)
							.FirstOrDefaultAsync(c => c.UserId == userID);
			return foundCart;
		}
		public async Task AddItemToCartAsync(int cartId, ShoppingCartItem item)
		{
			var foundCart = GetCartByCartId(cartId);
			if (foundCart != null)
			{
				await _context.ShoppingCartItems.AddAsync(item);
				_context.SaveChanges();
			}
		}

		public async Task RemoveItemFromCartAsync(int cartId, int itemId)
		{
			var foundCart = GetCartByCartId(cartId);
			if (foundCart != null)
			{
				var foundCartItem = await _context.ShoppingCartItems.FirstOrDefaultAsync(x => x.ShoppingCartItemId == itemId);
				if (foundCartItem != null)
				{
					_context.ShoppingCartItems.Remove(foundCartItem);
					_context.SaveChanges();
				}
			}
		}

		public async Task ClearCartAsync(int cartId)
		{
			var items = _context.ShoppingCartItems.Where(i => i.ShoppingCartId == cartId);
			_context.ShoppingCartItems.RemoveRange(items);
			await _context.SaveChangesAsync();
		}
	}
}
