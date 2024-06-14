using System.Threading.Tasks;
using Repositories.ModelsView;
using Microsoft.AspNetCore.Mvc;
using static Repositories.ModelsView.UserModel;
using Services.Interface;
using Repositories.Repositories;
using Microsoft.AspNetCore.Authorization;
using Repositories.Entities;
using Services.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
namespace GoodsExchangeFUProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        //TRI
        [HttpGet("user/GetAverageScore/{userId}")]
        public async Task<IActionResult> UserGetAverageScore(int userId)
        {
            var (userFound, aveScore) = await _userService.GetAverageScore(userId);
            if (userFound)
            {
                return Ok(aveScore);
            }
            return BadRequest("User not found or has no score");
        }

        //TRI
        [Authorize(Roles = "mod")]
        [HttpGet("Mod/ViewBanAccountList")]
        public async Task<IActionResult> ModViewBanAccountList()
        {
            var accounts = await _userService.ModGetBanAccountList();
            return Ok(accounts);
        }

        //TRI
        [HttpPost("/user/login")]
        public async Task<IActionResult> LoginWithEmailAndPassword([FromBody] LoginUserModel loginModel)
        {
            var (success, response, id, name) = await _userService.LoginByEmailAndPassword(loginModel);

            if (!success)
            {
                return Unauthorized(response);
            }

            return Ok(new { Token = response, userId = id, userName = name });
        }

        //TUAN
        [HttpPost("/api/user/google-login")]
        public async Task<ActionResult> GoogleLogin([FromHeader] string token)
        {
            var (success, response, id) = await _userService.GoogleAuthorizeUser(token);

            if(!success)
            {
                return Unauthorized(response);
            }

            return Ok(new { Token = response, userId = id });
        }

        //TRI
        [Authorize(Roles = "mod")]
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

        //TRI
        [Authorize(Roles = "mod")]
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

        //TRI
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


        //TUAN
        [HttpPost("UserForgotPassword")]
        public async Task<IActionResult> ForgotPassword(string emailAddress)
        {
            var result = await _userService.UserForgotPasswordUI(emailAddress);

            return Ok(result);
        }

        //TUAN
        [HttpPost("UserResetPassword")]
        public async Task<IActionResult> ResetPassword(UserPassResetModel resetModel)
        {
            var (result, message) = await _userService.UserResetPasswordUI(resetModel);
            
            if (result)
                return Ok(message);

            return BadRequest(message);
        }

        //TUAN
        //[Authorize(Roles = "student")]
        [HttpPost("Create-Customer-Account")]
        public async Task<ActionResult<string>> PostUser(UserRegisterModel registerModel)
        {
           
            (bool, string) result = await _userService.RegisterUserUI(registerModel, 3);
            if (result.Item1)
                return Ok(result.Item2);
            //return CreatedAtAction("GetUser", new { id = 20 }, registerView);
            return Ok(result.Item2);
        }

        //TUAN
        //[Authorize(Roles = "admin")]
        [HttpPost("Create-Modderator-Account")]
        public async Task<ActionResult<string>> PostModderator(UserRegisterModel registerView)
        {
           
            (bool, string) result = await _userService.RegisterUserUI(registerView, 2);
            if (result.Item1)
                return Ok(result.Item2);
            //return CreatedAtAction("GetUser", new { id = 20 }, registerView);
            return Ok(result.Item2);
        }



    }
}
