using System.Threading.Tasks;
using GoodsExchangeFUProject.IRepositories;
using GoodsExchangeFUProject.ModelsView;
using Microsoft.AspNetCore.Mvc;
using static GoodsExchangeFUProject.ModelsView.UserModel;

namespace GoodsExchangeFUProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;

        public AccountController(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        [HttpPost("/user/login")]
        public async Task<IActionResult> LoginByEmailAndPassword([FromBody] LoginUserModel loginModel)
        {
            if (loginModel == null || string.IsNullOrEmpty(loginModel.Email) || string.IsNullOrEmpty(loginModel.Password))
            {
                return BadRequest("Invalid login request");
            }

            var (success, response) = await _accountRepository.LoginByEmailAndPassword(loginModel);

            if (!success)
            {
                return Unauthorized(response);
            }

            return Ok(new { Token = response });
        }
    }
}
