using System.ComponentModel.DataAnnotations;

namespace Repositories.ModelsView
{

    public class UserModel
    {
        //public class RegisterUserModel 
        //{
        //    public string UserName { get; set; } = null!;

        //    public string Password { get; set; } = null!;

        //    public string Email { get; set; } = null!;

        //    public string Phone { get; set; } = null!;
        //}

        public class LoginUserModel
        {
            [EmailAddress]
            public string Email { get; set; } = null!;

            public string Password { get; set; } = null!;
        }

        //public class UserProfileModel
        //{
        //    public string UserName { get; set; } = null!;
        //    public string Email { get; set; } = null!;

        //    public string Phone { get; set; } = null!;

        //    public bool Gender { get; set; }
        //    public DateOnly? Dob { get; set; }
        //    public string? Address { get; set; }

        //    public double? AverageScore { get; set; }
        //}
    }
}
