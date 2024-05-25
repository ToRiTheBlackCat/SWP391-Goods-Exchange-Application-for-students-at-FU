using System.ComponentModel.DataAnnotations;

namespace GoodsExchangeFUProject.ModelsView
{
    public class UserViewModel
    {
        public class UserRegisterView
        {
            [EmailAddress]
            public required string Email { get; set; }

            [StringLength(50, MinimumLength = 5)]
            public required string Password { get; set; }
            [StringLength(50, MinimumLength = 5)]
            public required string UserName { get; set; }
            public string? PhoneNumber { get; set; } = null!;
        }

        public class UserLoginView
        {
            [EmailAddress]
            public required string Email { get; set; }

            [StringLength(50, MinimumLength = 5)]
            public required string Password { get; set; }
        }
    }
}
