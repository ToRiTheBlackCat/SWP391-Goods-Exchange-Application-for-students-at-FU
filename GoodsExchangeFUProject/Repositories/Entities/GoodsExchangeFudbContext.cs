using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Entities
{



    public partial class GoodsExchangeFudbContext : DbContext
    {
        public GoodsExchangeFudbContext()
        {
        }

        public GoodsExchangeFudbContext(DbContextOptions<GoodsExchangeFudbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Exchange> Exchanges { get; set; }

        public virtual DbSet<ExchangeDetail> ExchangeDetails { get; set; }

        public virtual DbSet<Product> Products { get; set; }

        public virtual DbSet<ProductType> ProductTypes { get; set; }

        public virtual DbSet<Rating> Ratings { get; set; }

        public virtual DbSet<Report> Reports { get; set; }

        public virtual DbSet<Role> Roles { get; set; }

        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
            => optionsBuilder.UseSqlServer("Server=DESKTOP-UMGO1RR\\MSSQLSERVER01;Initial Catalog=GoodsExchangeFUDB;Persist Security Info=True;User Id=sa;Password=12345;TrustServerCertificate=True");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Exchange>(entity =>
            {
                entity.ToTable("Exchange");

                entity.Property(e => e.ExchangeId).HasColumnName("exchangeID");
                entity.Property(e => e.CreateDate).HasColumnName("createDate");
                entity.Property(e => e.ProductId).HasColumnName("productID");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.UserId).HasColumnName("userID");

                entity.HasOne(d => d.Product).WithMany(p => p.Exchanges)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Exchange_Product_SellerProductID");

                entity.HasOne(d => d.User).WithMany(p => p.Exchanges)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Exchange_User_BuyerID");
            });

            modelBuilder.Entity<ExchangeDetail>(entity =>
            {
                entity.HasKey(e => e.Exdid);

                entity.ToTable("ExchangeDetail");

                entity.Property(e => e.Exdid).HasColumnName("EXDID");
                entity.Property(e => e.Balance).HasColumnName("balance");
                entity.Property(e => e.ExchangeId).HasColumnName("exchangeID");
                entity.Property(e => e.ProductId).HasColumnName("productID");

                entity.HasOne(d => d.Exchange).WithMany(p => p.ExchangeDetails)
                    .HasForeignKey(d => d.ExchangeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ExchangeDetail_Exchange_ExchangeID");

                entity.HasOne(d => d.Product).WithMany(p => p.ExchangeDetails)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ExchangeDetail_Product_BuyerProduct");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Product");

                entity.Property(e => e.ProductId).HasColumnName("productID");
                entity.Property(e => e.ProductDescription)
                    .HasMaxLength(255)
                    .HasColumnName("productDescription");
                entity.Property(e => e.ProductImage)
                    .HasMaxLength(255)
                    .HasColumnName("productImage");
                entity.Property(e => e.ProductName)
                    .HasMaxLength(100)
                    .HasColumnName("productName");
                entity.Property(e => e.ProductPrice).HasColumnName("productPrice");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.TypeId).HasColumnName("typeID");
                entity.Property(e => e.UserId).HasColumnName("userID");

                entity.HasOne(d => d.Type).WithMany(p => p.Products)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Product_ProductType_TypeID");

                entity.HasOne(d => d.User).WithMany(p => p.Products)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Product_User_UserProduct");
            });

            modelBuilder.Entity<ProductType>(entity =>
            {
                entity.HasKey(e => e.TypeId);

                entity.ToTable("ProductType");

                entity.Property(e => e.TypeId).HasColumnName("typeID");
                entity.Property(e => e.TypeName)
                    .HasMaxLength(15)
                    .IsFixedLength()
                    .HasColumnName("typeName");
            });

            modelBuilder.Entity<Rating>(entity =>
            {
                entity.HasKey(e => e.RatingId);
                entity.ToTable("Rating");

                entity.Property(e => e.Comment)
                    .HasMaxLength(255)
                    .HasColumnName("comment");
                entity.Property(e => e.ExchangeId).HasColumnName("exchangeID");
                entity.Property(e => e.RatingDate)
                    .HasColumnType("datetime")
                    .HasColumnName("ratingDate");
                entity.Property(e => e.Score)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("score");
                entity.Property(e => e.UserId).HasColumnName("userID");

                entity.HasOne(d => d.Exchange).WithMany()
                    .HasForeignKey(d => d.ExchangeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Rating_Exchange");

                entity.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Rating_User_RatingForUserID");
            });

            modelBuilder.Entity<Report>(entity =>
            {
                entity.ToTable("Report");

                entity.Property(e => e.ReportId).HasColumnName("reportID");

                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.Detail)
                    .HasMaxLength(255)
                    .HasColumnName("detail");
                entity.Property(e => e.ProductId).HasColumnName("productID");
                entity.Property(e => e.ReportDate)
                    .HasColumnType("datetime")
                    .HasColumnName("reportDate");
                entity.Property(e => e.ReportId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("reportID");
                entity.Property(e => e.UserId).HasColumnName("userID");

                entity.HasOne(d => d.Product).WithMany()
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Report_Product_ReportedProductID");

                entity.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Report_User_StudentID");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");

                entity.Property(e => e.RoleId).HasColumnName("roleID");
                entity.Property(e => e.RoleName)
                    .HasMaxLength(50)
                    .IsFixedLength()
                    .HasColumnName("roleName");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.UserId).HasColumnName("userID");
                entity.Property(e => e.Address)
                    .HasMaxLength(255)
                    .HasColumnName("address");
                entity.Property(e => e.AverageScore).HasColumnName("averageScore");
                entity.Property(e => e.Dob).HasColumnName("DOB");
                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsFixedLength()
                    .HasColumnName("email");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.IsBanned).HasColumnName("isBanned");
                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .IsFixedLength()
                    .HasColumnName("password");
                entity.Property(e => e.Phone)
                    .HasMaxLength(12)
                    .IsUnicode(false)
                    .IsFixedLength()
                    .HasColumnName("phone");
                entity.Property(e => e.RoleId).HasColumnName("roleID");
                entity.Property(e => e.UserName)
                    .HasMaxLength(50)
                    .HasColumnName("userName");

                entity.HasOne(d => d.Role).WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_User_RoleID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}