using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Repositories.ModelsView;

namespace Services.Interface
{
    public interface IProductService
    {
        Task<(bool, object?)> GetProductDetail(int productId);
        Task<(bool, string)> StudentAddNewProduct(AddNewProductModel addNewProductModel);
        Task<List<OwnProductModel>?> StudentViewOwnProductList(int userId);
        Task<List<OwnProductModel>?> StudentViewOwnProductList(int userId, int statusNum);
        Task<(bool, string)> StudentDeleteProduct(int productId);
        Task<(bool, string)> StudentUpdateProduct(OwnProductModel product);
        Task<List<ProductModel>> ModGetProductWaitingList();
        Task<(bool, string)> ModAcceptProduct(int productId);
        Task<(bool, string)> ModRejectProduct(int productId);
        Task<(bool, List<ViewAllProductModel>, int)> GetSortedProductsUI(ProductSortView sortView, string sortOrder, int pageIndex);

    }
}
