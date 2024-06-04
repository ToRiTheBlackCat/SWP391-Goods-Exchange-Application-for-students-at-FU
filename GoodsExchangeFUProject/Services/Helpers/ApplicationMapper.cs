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
                .ForMember(dest => dest.TypeId, opt => opt.MapFrom(src => src.TypeId))
                .ForMember(dest => dest.ProductOwner, opt => opt.MapFrom(src => src.User));

            // Mapping for Product to AddNewProductModel (this was missing)
            CreateMap<AddNewProductModel, Product>()
                .ForMember(dest => dest.TypeId, opt => opt.MapFrom(src => src.TypeId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));



            // Mapping for Product to OwnProductModel
            CreateMap<Product, OwnProductModel>()
                .ForMember(dest => dest.TypeId, opt => opt.MapFrom(src => src.Type.TypeId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.UserId));

            // Mapping for ProductType to ProductTypeModel
            //CreateMap<ProductType, ProductTypeModel>();

            // Mapping for User to ProductOwner
            CreateMap<User, ProductOwner>();

            // Mapping for User to LoginUserModel
            CreateMap<User, LoginUserModel>().ReverseMap();

            // Mapping for User to LoginUserModel
            CreateMap<User, UserModel2>().ReverseMap();

            // Mapping for Report to CreateReportModel
            CreateMap<CreateReportModel, Report>().ReverseMap();

            // Mapping for Report to ViewReportModel
            CreateMap<ViewReportModel, Report>().ReverseMap();

            // Mapping for Rating to RatingModel
            CreateMap<RatingModel, Rating>().ReverseMap();


        }
    }
}
