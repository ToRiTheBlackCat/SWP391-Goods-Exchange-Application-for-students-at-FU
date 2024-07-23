using Repositories.Entities;
using Services.Helpers;
using Services.Interface;
using Repositories.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using Services.Service;
using Microsoft.AspNetCore.Authentication.Google;
using SignalRChat.Hubs;

namespace GoodsExchangeFUProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var config = builder.Configuration;

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSignalR();
            //===============
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:8075", "http://localhost:5173", "https://swp391.is-very.fun")
                            .AllowAnyHeader()
                            .WithMethods("GET", "POST")
                            .AllowCredentials();
                    });
            });
            //===============
            // Register DbContext
            builder.Services.AddDbContext<GoodsExchangeFudbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionStringDB")));

            //.AddSingleton.Tại lần đầu chạy nếu chưa có tự tạo ra, các lần sau gọi lại vẫn lấy chính đổi tượng lần đầu đó 
            //.AddTransient. Mỗi lần gọi dịch vụ là 1 đối tượng mới đc tạo ra
            //.AddScoped. Với mỗi phạm vi scope mà đc gọi dịch vụ đó sẽ tạo ra 1 đối tượng 

            // Register AuthHelper and other dependencies
            builder.Services.AddScoped<AuthHelper>();
            //đăng ký tương ứng giữa interface và service đó thiết kế này sau này muốn đổi chỉ cần thay thế chỗ service khác miễn implement cái interface đó - SỰ PHỤ THUỘC LỎNG LẺO 
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<UserRepository>(); // Register UserRepository
            builder.Services.AddScoped<IProductService, ProductServices>();
            builder.Services.AddScoped<ProductRepository>();
            builder.Services.AddScoped<IReportService, ReportService>();
            builder.Services.AddScoped<ReportRepository>();
            builder.Services.AddScoped<IExchangeService, ExchangeService>();
            builder.Services.AddScoped<ExchangeRepository>();

            // Configure AutoMapper
            builder.Services.AddAutoMapper(typeof(ApplicationMapper));

            //// Configure CORS 
            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowAll", builder =>
            //    {
            //        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            //    });
            //});

            // Configure Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Secret"])),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    ClockSkew = TimeSpan.Zero
                };
            });// AddGoogle(googleOptions =>
            //{
            //    googleOptions.ClientId = config["Authentication:Google:ClientId"];
            //    googleOptions.ClientSecret = config["Authentication:Google:ClientSecret"];
            //});

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseRouting();
            //app.UseCors(c => c.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
            app.UseCors();
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            
            app.MapControllers();
            app.MapHub<ChatHub>("/chat");
            app.Run();
        }
    }
}
