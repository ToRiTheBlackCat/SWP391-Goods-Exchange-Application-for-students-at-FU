using AutoMapper;
using Repositories.Entities;
using Repositories.ModelsView;
using static Repositories.ModelsView.ProductModel;
using static Repositories.ModelsView.UserModel;


using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Services.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            //CreateMap<Product, ProductModel>().ReverseMap();
            CreateMap<Product, ProductModel>()
                .ForMember(dest => dest.ProductType, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.ProductOwner, opt => opt.MapFrom(src => src.User));
            CreateMap<ProductType, ProductTypeModel>();
            CreateMap<User, ProductOwner>();
            CreateMap<User, LoginUserModel>().ReverseMap();


        }
    }
}
