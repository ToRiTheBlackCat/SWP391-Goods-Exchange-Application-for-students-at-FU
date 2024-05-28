using Repositories.Entities;
using Repositories.ModelsView;

namespace Services.Interface
{
    public interface IProductService
    {
        Task<(bool, object)> GetProductDetail(int productId);
        //==================================
        Task<(bool, string)> StudentAddNewProduct(AddNewProductModel addNewProductModel);
        Task<List<ProductModel>> ModGetProductWaitingList();
        Task<(bool, string)> ModAcceptProduct(int productId);
        Task<(bool, string)> ModRejectProduct(int productId);

    }
}
