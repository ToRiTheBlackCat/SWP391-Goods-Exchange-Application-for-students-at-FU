using AutoMapper;
using GoodsExchangeFUProject.ModelsView;
using Repositories.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace GoodsExchangeFU.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<Product, ProductModel>().ReverseMap()
;
        }
    }
}
