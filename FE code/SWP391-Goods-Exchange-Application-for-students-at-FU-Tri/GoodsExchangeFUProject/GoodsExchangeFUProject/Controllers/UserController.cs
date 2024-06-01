using System.Threading.Tasks;
using Repositories.ModelsView;
using Microsoft.AspNetCore.Mvc;
using static Repositories.ModelsView.UserModel;
using Services.Interface;
using Repositories.Repositories;
namespace GoodsExchangeFUProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userRepository;

        public UserController(IUserService userRepository)
        {
            _userRepository = userRepository;
        }
        [HttpPost]
        public IActionResult stringA(string s, string s2)
        {
            if( s != null)
            return Ok(s);
            return null;
        }

        [HttpPost("/user/login")]
        public async Task<IActionResult> PostUser([FromBody] LoginUserModel loginModel)
        {
            
            var (success, response, id) = await _userRepository.LoginByEmailAndPassword(loginModel);

            if (!success)
            {
                return Unauthorized(response);
            }

            return Ok(new { Token = response, userId = id } );
        }
    }
}
