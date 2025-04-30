using Microsoft.EntityFrameworkCore;
using Repositories.Entities;
using Repositories.Repositories;
using Services.Helpers;
using Services.Interface;
using Services.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<GoodsExchangeFudbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionStringDB")));

builder.Services.AddScoped<AuthHelper>();
//??ng ký t??ng ?ng gi?a interface và service ?ó thi?t k? này sau này mu?n ??i ch? c?n thay th? ch? service khác mi?n implement cái interface ?ó - S? PH? THU?C L?NG L?O 
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<UserRepository>(); // Register UserRepository
builder.Services.AddScoped<IProductService, ProductServices>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<ReportRepository>();
builder.Services.AddScoped<IExchangeService, ExchangeService>();
builder.Services.AddScoped<ExchangeRepository>();
//builder.Services.AddScoped<IShoppingCartService, ShoppingCartService>();
//builder.Services.AddScoped<ShoppingCartRepository>();

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(ApplicationMapper));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
