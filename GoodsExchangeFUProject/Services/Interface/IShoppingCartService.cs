using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
	public interface IShoppingCartService
	{
		Task<ShoppingCart?> GetCartAsync(int userId);
		Task AddItemAsync(int userId, int productId, int quantity, decimal unitPrice);
		Task RemoveItemAsync(int userId, int itemId);
		Task ClearCartAsync(int userId);
	}
}
