using AutoMapper;
using GoodsExchangeFUProject.Entities;
using GoodsExchangeFUProject.ModelsView;
using static  GoodsExchangeFUProject.ModelsView.ProductModel;
using static GoodsExchangeFUProject.ModelsView.UserModel;


using static System.Runtime.InteropServices.JavaScript.JSType;

namespace GoodsExchangeFU.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<Product, ProductModel>().ReverseMap();
            CreateMap<User, LoginUserModel>().ReverseMap();



            ;
        }
    }
}
