using Repositories.ModelsView;

namespace Services.Interface
{
    public interface IProductService
    {
        Task<(bool, object)> GetProductDetail(int productId);

    }
}
