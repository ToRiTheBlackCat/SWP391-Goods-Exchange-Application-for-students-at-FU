using AutoMapper;
using Repositories.ModelsView;
using Repositories.Entities;
using Repositories.Repositories;
using Services.Interface;
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Services.Helpers;

namespace Services.Service
{
    public class ProductServices : IProductService
    {
        private readonly ProductRepository _repo;
        private readonly UserRepository _user_repo;

        private readonly IMapper _mapper;

        public ProductServices(ProductRepository productRepository, IMapper mapper, UserRepository userRepository)
        {
            _repo = productRepository;
            _mapper = mapper;
            _user_repo = userRepository;
        }
        //TRI
        public async Task<(bool, object?)> GetProductDetail(int productId)
        {
            var product = await _repo.FindProductByIdAsync(productId);
            if (product != null)
            {
                var productModel = _mapper.Map<ProductModel>(product);
                var (userFound, listScores) = await _user_repo.GetAllScoresOfUserByIdAsync(product.UserId);
                if (listScores == null || !listScores.Any())
                {
                    productModel.ProductOwner.AverageScore = 0;
                }
                else
                {
                    productModel.ProductOwner.AverageScore = (double)listScores.Average();
                }
                return (true, productModel);
            }
            return (false, null);
        }
        //TRI
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
        //TRI
        //Support for StudentViewOwnProductList()
        public List<OwnProductModel> ConvertProductToModel2(List<Product> listIn)
        {
            var listOut = new List<OwnProductModel>();
            foreach (var product in listIn)
            {
                listOut.Add(_mapper.Map<OwnProductModel>(product));
            }

            return listOut;
        }
        
        public async Task<List<ViewAllProductModel>> ConvertProductToModel3(List<Product> listIn)
        {
            var listOut = new List<ViewAllProductModel>();
            foreach (var product in listIn)
            {
                var productModel = _mapper.Map<ViewAllProductModel>(product);

                // Get the average score of the user
                //var (userFound, averageScore) = await _userService.GetAverageScore(product.UserId);
                var (userFound, listScores) = await _user_repo.GetAllScoresOfUserByIdAsync(product.UserId);
                // Set the average score in the product owner if user is found
                if (listScores == null || !listScores.Any())
                {
                    productModel.ProductOwner.AverageScore = 0;
                }
                else
                {
                    productModel.ProductOwner.AverageScore = (double)listScores.Average();
                }

                listOut.Add(productModel);
            }

            return listOut;
        }

        //=======================
        //TRI
        public async Task<List<ProductModel>> ModGetProductWaitingList()
        {

            return ConvertProductToModel(_repo.ViewProductsByStatus(3).ToList());
        }

        public async Task<(bool, string)> ModAcceptProduct(int productId)
        {

            var success = await _repo.UpdateProductStatusAsync(productId, 1);
            if (success)
            {
                return (true, "Product accepted");
            }
            return (false, "Product not found in the waiting list.");
        }
        //TRI
        public async Task<(bool, string)> ModRejectProduct(int productId)
        {
            try
            {
                await _repo.RemoveProduct(productId);
                return (true, "Product rejected");
            }
            catch (Exception ex)
            {
                return (false, "Product not found in the waiting list. "+ ex.Message);
            }
            
            
        }
        //TRI
        public async Task<(bool, string)> StudentDeleteProduct(int productId)
        {

            var success = await _repo.UpdateProductStatusAsync(productId, 0);
            if (success)
            {
                return (true, "Product Deleted");
            }
            return (false, "Product not exist");
        }
        //TRI
        public async Task<(bool, string)> StudentUpdateProduct(OwnProductModel update )
        {
            var success = await _repo.UpdateProductByIdAsync(update);
            if (success)
            {
                return (true, "Product updated");
            }
            return (false, "Product not exist");
        }
        //TRI
        public async Task<(bool, string)> StudentAddNewProduct(AddNewProductModel addNewProductModel)
        {
            var newProduct = _mapper.Map<Product>(addNewProductModel);
            newProduct.Status = 3;  //set to 3 for waiting list  
            await _repo.AddProductAsync(newProduct);
            return (true, "Product added to the waiting list.");
        }
        //TRI
        public async Task<List<OwnProductModel>?> StudentViewOwnProductList(int userId)
        {
            var list = ConvertProductToModel2(_repo.ViewProductsOfUser(userId).ToList());
            if (list is not null)
            {
                return (list);
            }
            return (null);
        }
        public async Task<List<OwnProductModel>?> StudentViewOwnProductList(int userId, int statusNum)
        {
            var list = ConvertProductToModel2(_repo.ViewProductsOfUser(userId, statusNum).ToList());
            if (list is not null)
            {
                return (list);
            }
            return (null);
        }

        //=========================
        //TUAN
        public async Task<(bool, List<ViewAllProductModel>?, int)> GetSortedProductsUI(ProductSortView sortView, string sortOrder, int pageIndex)
        {
            //get products that sastify the fields
            var foundProducts = _repo
                .GetProductsByField(sortView.SearchString, sortView.SearchString, sortView.CategoryId);
            if (foundProducts != null)
            {
                var fromPrice = sortView.FromPrice;
                var toPrice = sortView.ToPrice;

                if (!(fromPrice >= 0) || !(toPrice >= 0) || fromPrice > toPrice)
                {
                    fromPrice = 0;
                    toPrice = 0;
                }

                if (fromPrice <= toPrice && toPrice > 0)
                {
                    foundProducts = foundProducts.Where(x => x.ProductPrice >= sortView.FromPrice
                        && x.ProductPrice <= sortView.ToPrice);
                }

                //sort the products
                foundProducts = SortProduct(foundProducts, sortOrder);

                //paging the products
                int pageSize = 12;
                var totalPage = (int)Math.Ceiling(foundProducts.Count() / (double)pageSize);
                PaginatedList<Product> list = await PaginatedList<Product>.CreateAsync(foundProducts, pageIndex, pageSize);

                var models = await ConvertProductToModel3(list);
                return (true, models, totalPage);

            }
            //no product found
            return (false, null, 0);
        }
        public string? NameSort { get; set; }
        public string? PriceSort { get; set; }
        public string? CurrentSort { get; set; }
        public IQueryable<Product> SortProduct(IQueryable<Product> productsIQ, string sortOrder)
        {
            CurrentSort = sortOrder;
            NameSort = sortOrder.IsNullOrEmpty() ? "name_desc" : "";
            PriceSort = sortOrder == "Price" ? "price_desc" : "Price";

            switch (sortOrder)
            {
                case "Name":
                    productsIQ = productsIQ.OrderBy(p => p.ProductName);
                    break;
                case "name_desc":
                    productsIQ = productsIQ.OrderByDescending(p => p.ProductName);
                    break;
                case "Price":
                    productsIQ = productsIQ.OrderBy(p => p.ProductPrice);
                    break;
                case "price_desc":
                    productsIQ = productsIQ.OrderByDescending(p => p.ProductPrice);
                    break;
                default: return productsIQ;
            }
            return productsIQ;
        }

    }
}

