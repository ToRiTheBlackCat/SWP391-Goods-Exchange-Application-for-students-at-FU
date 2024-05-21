
using GoodsExchangeFUProject.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace GoodsExchangeFUProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //================================================
            //Khai b�o dependencies cho DBContext
            builder.Services.AddDbContext<GoodsExchangeFudbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("GoodsExchangeFU")));
            builder.Services.AddAuthorization();
            //===============================================
            //??ng k� cho MAPPER 
            object value = builder.Services.AddAutoMapper(typeof(Program));
            //===============================================
            //Life Cycle DI
            //builder.Services.AddScoped<IProductRepository, ProductRepository>();
            //builder.Services.AddScoped<UserManager<User>>();
            //builder.Services.AddScoped<SignInManager<User>>();
            //===============================================
            //??ng k� cho Identity  - D�ng cho ph�n quy?n 
            //builder.Services.AddIdentity<User, IdentityRole>()
            //                .AddEntityFrameworkStores<GoodsExchangeFudbContext>().AddDefaultTokenProviders();
            //===============================================
            //Khai b�o cho Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"])),

                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    ClockSkew = TimeSpan.Zero
                };

                //    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
                //};
            });
            builder.Services.AddSingleton<AuthHelpers>();

            //===============================================



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
