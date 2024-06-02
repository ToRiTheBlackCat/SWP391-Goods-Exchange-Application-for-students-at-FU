using System.Threading.Tasks;
using Repositories.ModelsView;
using Microsoft.AspNetCore.Mvc;
using static Repositories.ModelsView.UserModel;
using Services.Interface;
using Repositories.Repositories;
using Microsoft.AspNetCore.Authorization;
using Repositories.Entities;
using Services.Service;
namespace GoodsExchangeFUProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userRepository)
        {
            _userService = userRepository;
        }
        //[Authorize(Roles = "mod")]
        [HttpGet("Mod/ViewBanAccountList")]
        public async Task<IActionResult> ModViewBanAccountList()
        {
            var accounts = await _userService.ModGetBanAccountList();
            return Ok(accounts);
        }

        [HttpPost("/user/login")]
        public async Task<IActionResult> LoginWithEmailAndPassword([FromBody] LoginUserModel loginModel)
        {
            
            var (success, response, id) = await _userService.LoginByEmailAndPassword(loginModel);

            if (!success)
            {
                return Unauthorized(response);
            }

            return Ok(new { Token = response, userId = id } );
        }

        
        
        //[Authorize(Roles = "mod")]
        [HttpPost("Mod/BanAccount/{userId}")]
        public async Task<IActionResult> ModBanAccount(int userId)
        {
            var (success, message) = await _userService.ModBanAccount(userId);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
        }

        //[Authorize(Roles = "mod")]
        [HttpPost("Mod/UnBanAccount/{userId}")]
        public async Task<IActionResult> ModUnBanAccount(int userId)
        {
            var (success, message) = await _userService.ModUnBanAccount(userId);
            if (success)
            {
                return Ok(message);
            }
            return BadRequest(message);
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
