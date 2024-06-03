
using GoodsExchangeFUProject.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using System.Text;
using System.Text.Json.Serialization;


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
            //Khai báo dependencies cho DBContext
            builder.Services.AddDbContext<GoodsExchangeFudbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("GoodsExchangeFU")));
            builder.Services.AddAuthorization();
            //===============================================
            //??ng kí cho MAPPER 
            object value = builder.Services.AddAutoMapper(typeof(Program));
            //===============================================
            //Life Cycle DI
            //builder.Services.AddScoped<IProductRepository, ProductRepository>();
            //builder.Services.AddScoped<UserManager<User>>();
            //builder.Services.AddScoped<SignInManager<User>>();
            //===============================================
            //??ng kí cho Identity  - Dùng cho phân quy?n 
            //builder.Services.AddIdentity<User, IdentityRole>()
            //                .AddEntityFrameworkStores<GoodsExchangeFudbContext>().AddDefaultTokenProviders();
            //===============================================
            //Khai báo cho Authentication
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
            builder.Services.AddSingleton<AuthHelper>();

            

            //System.Text.Json.JsonException: A possible object cycle was detected
            //. This can either be due to a cycle or if the object depth is larger than
            //the maximum allowed depth of 32. Consider using ReferenceHandler
            //. Preserve on JsonSerializerOptions to support cycles.
            builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            //===============================================

            builder.Services.AddAuthorizationBuilder()
                .AddPolicy("admin", p =>
                {
                    p.RequireClaim("role", "admin");
                });


            // Configure CORS =============================
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });
            //===============================================

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseStaticFiles();               // Enable serving static files from the wwwroot folder

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
