using System.Threading.Tasks;
using Repositories.ModelsView;
using Microsoft.AspNetCore.Mvc;
using static Repositories.ModelsView.UserModel;
using Services.Interface;
using Repositories.Repositories;
using Microsoft.AspNetCore.Authorization;
using Repositories.Entities;
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

        [HttpPost("/user/login")]
        public async Task<IActionResult> LoginWithEmailAndPassword([FromBody] LoginUserModel loginModel)
        {
            
            var (success, response, id) = await _userRepository.LoginByEmailAndPassword(loginModel);

            if (!success)
            {
                return Unauthorized(response);
            }

            return Ok(new { Token = response, userId = id } );
        }

        //[Authorize]
        //[HttpPost("user/logout")]
        //public async Task<IActionResult> LogOutAccount()
        //{
        //    try
        //    {
        //        await _userRepository.LogOutAccount(string token);
        //        return Ok("Sign out successfully");
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

    }
}
