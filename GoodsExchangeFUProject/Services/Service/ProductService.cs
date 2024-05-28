using AutoMapper;
using Repositories.ModelsView;
using Repositories.Entities;
using Repositories.Repositories;
using Services.Interface;
using System.Collections.Concurrent;

namespace Services.Service
{
    public class ProductServices : IProductService
    {
        private readonly ProductRepository _repo;
        private readonly IMapper _mapper;

        //// In-memory waiting list
        //private static ConcurrentDictionary<int, ProductModel> _waitingList = new ConcurrentDictionary<int, ProductModel>();

        public ProductServices(ProductRepository productRepository, IMapper mapper)
        {
            _repo = productRepository;
            _mapper = mapper;
        }

        public async Task<(bool, object)> GetProductDetail(int productId)
        {
            var product = await _repo.FindProductByIdAsync(productId, 1);
            if (product != null)
            {
                var productModel = _mapper.Map<ProductModel>(product);
                return (true, productModel);
            }
            return (false, null);
        }
        //Support for ModGetProductWaitingList()
        public List<ProductModel> ConvertProductToModel(List<Product> listIn)
        {
            var listOut = new List<ProductModel>();
            foreach (var product in listIn)
            {
                listOut.Add(_mapper.Map<ProductModel>(product));
            }

            return listOut;
        }
        public async Task<List<ProductModel>> ModGetProductWaitingList()
        {

            return ConvertProductToModel(_repo.ViewProductsByStatus(3).ToList());
        }

        public async Task<(bool, string)> ModAcceptProduct(int productId)
        {

            var success = await _repo.UpdateProductStatusAsync(productId, 1);
            if (success != null)
            {
                return (true, "Product accepted");
            }
            return (false, "Product not found in the waiting list.");
        }

        public async Task<(bool, string)> ModRejectProduct(int productId)
        {
            var success = await _repo.UpdateProductStatusAsync(productId, 0);
            if (success != null)
            {
                return (true, "Product rejected");
            }
            return (false, "Product not found in the waiting list.");
        }

        public async Task<(bool, string)> StudentAddNewProduct(AddNewProductModel addNewProductModel)
        {
            var newProduct = _mapper.Map<Product>(addNewProductModel);
            newProduct.Status = 3;  //set to 3 for waiting list  
            await _repo.AddProductAsync(newProduct);

            //Status=3 nen lay truc tiep product ko can qua model
            // Map to ProductModel and add to in-memory waiting list
            //var productModel = _mapper.Map<ProductModel>(newProduct);
            //_waitingList[productModel.ProductId] = productModel;

            return (true, "Product added to the waiting list.");
        }

    }
}

