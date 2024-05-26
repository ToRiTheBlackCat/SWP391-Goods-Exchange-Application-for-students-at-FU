using AutoMapper;
using Repositories.ModelsView;
using Repositories.Repositories;
using Services.Interface;

namespace Services.Service
{
    public class ProductServices : IProductService
    {
        private readonly ProductRepository _repo;
        private readonly IMapper _mapper;
        public ProductServices(ProductRepository productRepository, IMapper mapper)
        {
            _repo = productRepository;
            _mapper = mapper;
        }

        public async Task<(bool, object)> GetProductDetail(int productId)
        {
            var product = await _repo.FindProductByIdAsync(productId);
            if (product != null)
            {
                var productModel = _mapper.Map<ProductModel>(product);
                return (true, productModel);
            }
            return (false, null);
        }

        
    }
}

