﻿using System.Threading.Tasks;
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
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;
using NuGet.Protocol;
using Microsoft.AspNetCore.Http.HttpResults;
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
        [Authorize(Roles = "admin")]
        [HttpGet("Admin/GetAllAccountList")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var list = await _userService.GetAllAccountList();
            return Ok(list);
        }
        //TRI
        [HttpGet("user/GetUserInfo/{userId}")]
        public async Task<IActionResult> GetUserInfoById(int userId)
        {
            var userFound = await _userService.GetUserInfo(userId);
            if (userFound != null)
            {
                var (result, aveScore) = await _userService.GetAverageScore(userFound.UserId);
                userFound.AverageScore = aveScore;
                return Ok(userFound);
            }
            return BadRequest("User not found ");
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
        [HttpPut("user/UpdateUserInfo/{userId}")]
        public async Task<IActionResult> UpdateUserInfoById(int userId, [FromBody] UpdateInfoUserModel updateModel)
        {
            var userFound = await _userService.GetUserInfo(userId);
            if (userFound != null)
            {
                //var (result, aveScore) = await _userService.GetAverageScore(userFound.UserId);
                //userFound.AverageScore = aveScore;
                var message = await _userService.UpdateUserInfo(userId, updateModel);

                return Ok(message);
            }
            return BadRequest("User not found ");
        }

        //TRI
        [HttpPost("/user/login")]
        public async Task<IActionResult> LoginWithEmailAndPassword([FromBody] LoginUserModel loginModel)
        {
            var (success, response, id, name, role) = await _userService.LoginByEmailAndPassword(loginModel);

            if (!success)
            {
                return Unauthorized(response);
            }

            return Ok(new { Token = response, userId = id, userName = name, Role = role.Trim() });
        }

        //TUAN
        [HttpPost("/api/user/google-login")]
        public async Task<ActionResult> GoogleLogin([FromBody] string credential)
        {
            var (success, response, id, name, role) = await _userService.GoogleAuthorizeUser(credential);

            if (!success)
            {
                return Unauthorized(new { Message = response, userId = id, userName = name, Role = role.Trim() });
            }

            return Ok(new { Token = response, userId = id, userName = name, Role = role.Trim() });
        }
        //TRI
        //[Authorize(Roles = "admin")]
        [HttpPost("Admin/DeleteAccount/{userId}")]
        public async Task<IActionResult> AdminDeleteAccount(int userId)
        {
            var userFound = await _userService.GetUserInfo(userId);
            if (userFound != null)
            {
                await _userService.AdminDeleteAccount(userId);
                return Ok("Delete successfully");
            }
            return BadRequest("User not found");
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
        [HttpGet("GetAllRatingAndComment/{userId}")]
        public async Task<IActionResult> GetAllRatingAndCommentOfUser(int userId)
        {
            var list = await _userService.GetAllRatingAndComment(userId);
            return Ok(list);
        }
        //TRI
        [Authorize(Roles = "admin")]
        [HttpGet("Admin/DashboardAccount")]
        public async Task<IActionResult> AdminDashboardAccount()
        {

            var (all, mod, ad) = await _userService.AdminDashBoardAccounts();
            return Ok(new { AllAccounts = all, ModAccounts = mod, AdminAccount = ad });

        }

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

            (bool, string) result = await _userService.RegisterUserUI(registerModel, (int)RoleEnum.Student);
            if (result.Item1)
                return Ok(result.Item2);
            //return CreatedAtAction("GetUser", new { id = 20 }, registerView);
            return BadRequest(result.Item2);
        }

        //TUAN
        //[Authorize(Roles = "admin")]
        [HttpPost("Create-Modderator-Account")]
        public async Task<ActionResult<string>> PostModderator(UserRegisterModel registerView)
        {

            (bool, string) result = await _userService.RegisterUserUI(registerView, (int)RoleEnum.Mod);
            if (result.Item1)
                return Ok(result.Item2);
            //return CreatedAtAction("GetUser", new { id = 20 }, registerView);
            return BadRequest(result.Item2);
        }

        //TUAN
        [HttpGet("GetAllNotification/{userId}")]
        public async Task<IActionResult> GetAllNotificationOfUser(int userId)
        {
            var (result, list) = await _userService.GetReceivedNotifications(userId);
            return Ok(new
            {
                Result = result,
                Notifications = list,
            });
        }

        [HttpPost("SendNotificationToUser")]
        public async Task<IActionResult> SendNotificationToUser(NotificationSendView sendView)
        {
            var (message, result) = await _userService.SendNotification(sendView);
            return Ok(new
            {
                Message = message,
                Result = result
            });
        }

        [HttpPost("ReplyNotification")]
        public async Task<IActionResult> ReplyNotification(NotificationReceivedView sendView)
        {
            var (message, result) = await _userService.UserReplyToNotification(sendView);
            return Ok(new
            {
                Message = message,
                Result = result
            });
        }
    }
}
