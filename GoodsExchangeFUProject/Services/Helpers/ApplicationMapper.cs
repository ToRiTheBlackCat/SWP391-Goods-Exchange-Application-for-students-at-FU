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
            // Mapping for Product to ProductModel
            CreateMap<Product, ProductModel>()
                .ForMember(dest => dest.ProductType, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.ProductOwner, opt => opt.MapFrom(src => src.User));

            // Mapping for Product to AddNewProductModel (this was missing)
            CreateMap<Product, AddNewProductModel>()
                .ForMember(dest => dest.TypeId, opt => opt.MapFrom(src => src.TypeId))
                .ForMember(dest => dest.ProductOwnerV2, opt => opt.MapFrom(src => new ProductOwnerV2 { UserId = src.UserId }));

            

            // Mapping for Product to OwnProductModel
            CreateMap<Product, OwnProductModel>()
                .ForMember(dest => dest.ProductType, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.ProductOwnerV2, opt => opt.MapFrom(src => src.User));

            // Mapping for ProductType to ProductTypeModel
            CreateMap<ProductType, ProductTypeModel>();

            // Mapping for User to ProductOwner
            CreateMap<User, ProductOwner>();

            // Mapping for User to LoginUserModel
            CreateMap<User, LoginUserModel>().ReverseMap();
           


        }
    }
}
