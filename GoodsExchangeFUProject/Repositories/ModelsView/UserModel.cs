using System.ComponentModel.DataAnnotations;

namespace Repositories.ModelsView
{

    public class UserModel
    {
        public class UserModel2
        {
            public int UserId { get; set; }

            public string UserName { get; set; } = null!;

            public string Password { get; set; } = null!;

            public string Email { get; set; } = null!;

            public string Phone { get; set; } = null!;

            public bool Gender { get; set; }

            public DateOnly? Dob { get; set; }

            public int RoleId { get; set; }

            public string? Address { get; set; }

            public double? AverageScore { get; set; }

            public bool IsBanned { get; set; }
        }

        public class LoginUserModel
        {
            [EmailAddress]
            public string Email { get; set; } = null!;

            public string Password { get; set; } = null!;
        }

        public class UserRegisterModel
        {
            [EmailAddress]
            public required string Email { get; set; }

            [StringLength(50, MinimumLength = 5)]
            public required string Password { get; set; }
            [StringLength(50, MinimumLength = 5)]
            public required string UserName { get; set; }
            [Phone]
            [StringLength(12, MinimumLength = 9)]
            public string? PhoneNumber { get; set; } = null!;

            public string? Address { get; set; }

            public bool Gender { get; set; }

            public DateOnly Dob { get; set; }
        }

        public class UserPassResetModel 
        {
            [EmailAddress]
            public required string Email { get; set; }

            public string resetCode { get; set; } = null!;

            public string Password { get; set; } = null!;
        }

        public class UpdateInfoUserModel
        {
            public string UserName { get; set; } = null!;

            public bool Gender { get; set; }

            public DateOnly? Dob { get; set; }

            public string? Address { get; set; }

        }
    }
}
