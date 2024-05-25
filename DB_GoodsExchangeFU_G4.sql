USE [master]
GO
/****** Object:  Database [GoodsExchangeFUDB]    Script Date: 5/21/2024 2:21:35 AM ******/
CREATE DATABASE [GoodsExchangeFUDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'GoodsExchangeFUDB', FILENAME = N'D:\Documents\UNI\chuyen nganh 5\SWP\Database\GoodsExchangeFUDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'GoodsExchangeFUDB_log', FILENAME = N'D:\Documents\UNI\chuyen nganh 5\SWP\Database\GoodsExchangeFUDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [GoodsExchangeFUDB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [GoodsExchangeFUDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [GoodsExchangeFUDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET RECOVERY FULL 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET  MULTI_USER 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [GoodsExchangeFUDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [GoodsExchangeFUDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'GoodsExchangeFUDB', N'ON'
GO
ALTER DATABASE [GoodsExchangeFUDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [GoodsExchangeFUDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [GoodsExchangeFUDB]
GO
/****** Object:  Table [dbo].[Exchange]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Exchange](
	[exchangeID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NOT NULL,
	[productID] [int] NOT NULL,
	[createDate] [date] NOT NULL,
	[status] [int] NOT NULL,
 CONSTRAINT [PK_Exchange] PRIMARY KEY CLUSTERED 
(
	[exchangeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ExchangeDetail]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ExchangeDetail](
	[EXDID] [int] IDENTITY(1,1) NOT NULL,
	[productID] [int] NULL,
	[balance] [int] NULL,
	[exchangeID] [int] NOT NULL,
 CONSTRAINT [PK_ExchangeDetail] PRIMARY KEY CLUSTERED 
(
	[EXDID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[productID] [int] IDENTITY(1,1) NOT NULL,
	[productName] [nvarchar](100) NOT NULL,
	[productImage] [nvarchar](255) NOT NULL,
	[productDescription] [nvarchar](255) NULL,
	[productPrice] [int] NOT NULL,
	[typeID] [int] NOT NULL,
	[userID] [int] NOT NULL,
	[status] [int] NOT NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[productID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductType]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductType](
	[typeID] [int] IDENTITY(1,1) NOT NULL,
	[typeName] [nchar](15) NOT NULL,
 CONSTRAINT [PK_ProductType] PRIMARY KEY CLUSTERED 
(
	[typeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rating]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rating](
	[exchangeID] [int] NOT NULL,
	[userID] [int] NOT NULL,
	[score] [decimal](18, 0) NOT NULL,
	[comment] [nvarchar](255) NULL,
	[ratingDate] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Report]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Report](
	[reportID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NOT NULL,
	[productID] [int] NOT NULL,
	[detail] [nvarchar](255) NOT NULL,
	[reportDate] [datetime] NOT NULL,
 CONSTRAINT [PK_Report] PRIMARY KEY CLUSTERED 
(
	[reportID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[roleID] [int] IDENTITY(1,1) NOT NULL,
	[roleName] [nchar](50) NOT NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[roleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 5/21/2024 2:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[userID] [int] IDENTITY(1,1) NOT NULL,
	[userName] [nvarchar](50) NOT NULL,
	[password] [nchar](255) NOT NULL,
	[email] [nchar](100) NOT NULL,
	[phone] [char](12) NOT NULL,
	[gender] [bit] NOT NULL,
	[DOB] [date] NULL,
	[roleID] [int] NOT NULL,
	[address] [nvarchar](255) NULL,
	[averageScore] [float] NULL,
	[isBanned] [bit] NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[userID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Product] ON 

INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (4, N'Tai nghe Sony', N'Link ảnh', N'Hàng nữ dùng còn tốt ', 1000000, 1, 8, 1)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (5, N'Giày Nike', N'Link ảnh', N'Size 42, Con 90%', 500000, 6, 10, 1)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (6, N'Kệ INOX', N'Link ảnh', N'Bền chắc mua được 2 tháng ít dùng', 200000, 4, 8, 2)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (7, N'Sách Đắc Nhân Tâm', N'Link ảnh', N'Mới mua ít đọc', 195000, 2, 8, 0)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (8, N'Chuột Logitech', N'Link ảnh', N'Mua được 1 năm hơi sờn nhẹ', 700000, 1, 10, 1)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (9, N'x10 Cây bút bi', N'Link ảnh', N'Hàng mới 100%', 50000, 5, 10, 1)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (10, N'Bộ bàn ghế gỗ', N'Link ảnh', N'Bàn có 2 ghế, còn mới', 500000, 4, 11, 2)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (11, N'Laptop Acer', N'Link ảnh', N'Hàng mới 85%', 10000000, 1, 11, 0)
INSERT [dbo].[Product] ([productID], [productName], [productImage], [productDescription], [productPrice], [typeID], [userID], [status]) VALUES (12, N'Nhẫn bạc', N'Link ảnh', N'Hàng like new 95%', 500000, 3, 8, 1)
SET IDENTITY_INSERT [dbo].[Product] OFF
GO
SET IDENTITY_INSERT [dbo].[ProductType] ON 

INSERT [dbo].[ProductType] ([typeID], [typeName]) VALUES (1, N'electronics    ')
INSERT [dbo].[ProductType] ([typeID], [typeName]) VALUES (2, N'books          ')
INSERT [dbo].[ProductType] ([typeID], [typeName]) VALUES (3, N'assessories    ')
INSERT [dbo].[ProductType] ([typeID], [typeName]) VALUES (4, N'housewares     ')
INSERT [dbo].[ProductType] ([typeID], [typeName]) VALUES (5, N'schoolSupplies ')
INSERT [dbo].[ProductType] ([typeID], [typeName]) VALUES (6, N'clothes        ')
SET IDENTITY_INSERT [dbo].[ProductType] OFF
GO
SET IDENTITY_INSERT [dbo].[Role] ON 

INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (1, N'admin                                             ')
INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (2, N'mod                                               ')
INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (3, N'student                                           ')
SET IDENTITY_INSERT [dbo].[Role] OFF
GO
SET IDENTITY_INSERT [dbo].[User] ON 

INSERT [dbo].[User] ([userID], [userName], [password], [email], [phone], [gender], [DOB], [roleID], [address], [averageScore], [isBanned]) VALUES (1, N'admin', N'ca6d267b6bc04b7931fce76b7cf7bc20ad9a865a                                                                                                                                                                                                                       ', N'triminh0502@gmail.com                                                                               ', N'0898410174  ', 1, NULL, 1, NULL, NULL, 0)
INSERT [dbo].[User] ([userID], [userName], [password], [email], [phone], [gender], [DOB], [roleID], [address], [averageScore], [isBanned]) VALUES (5, N'mod1', N'ca6d267b6bc04b7931fce76b7cf7bc20ad9a865a                                                                                                                                                                                                                       ', N'nq2019.nguyenhuynhminhtri5204@gmail.com                                                             ', N'0123456789  ', 0, NULL, 2, NULL, NULL, 0)
INSERT [dbo].[User] ([userID], [userName], [password], [email], [phone], [gender], [DOB], [roleID], [address], [averageScore], [isBanned]) VALUES (6, N'mod2', N'ca6d267b6bc04b7931fce76b7cf7bc20ad9a865a                                                                                                                                                                                                                       ', N'abc@gmai.com                                                                                        ', N'033344442   ', 1, CAST(N'2000-01-02' AS Date), 2, N'Dist9', NULL, 1)
INSERT [dbo].[User] ([userID], [userName], [password], [email], [phone], [gender], [DOB], [roleID], [address], [averageScore], [isBanned]) VALUES (8, N'thang123', N'ca6d267b6bc04b7931fce76b7cf7bc20ad9a865a                                                                                                                                                                                                                       ', N'thang123@gmaio.com                                                                                  ', N'099221345   ', 1, CAST(N'2001-05-05' AS Date), 3, N'ThuDuc', NULL, 0)
INSERT [dbo].[User] ([userID], [userName], [password], [email], [phone], [gender], [DOB], [roleID], [address], [averageScore], [isBanned]) VALUES (10, N'tuan231', N'ca6d267b6bc04b7931fce76b7cf7bc20ad9a865a                                                                                                                                                                                                                       ', N'tuan1122@fpt.edu.vn                                                                                 ', N'011111111   ', 0, CAST(N'1999-01-01' AS Date), 3, NULL, NULL, 1)
INSERT [dbo].[User] ([userID], [userName], [password], [email], [phone], [gender], [DOB], [roleID], [address], [averageScore], [isBanned]) VALUES (11, N'thanh333', N'ca6d267b6bc04b7931fce76b7cf7bc20ad9a865a                                                                                                                                                                                                                       ', N'thanh333@fpt.edu.vn                                                                                 ', N'099999999   ', 1, NULL, 3, N'Q7', NULL, 0)
SET IDENTITY_INSERT [dbo].[User] OFF
GO
ALTER TABLE [dbo].[Exchange]  WITH CHECK ADD  CONSTRAINT [FK_Exchange_Product_SellerProductID] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
GO
ALTER TABLE [dbo].[Exchange] CHECK CONSTRAINT [FK_Exchange_Product_SellerProductID]
GO
ALTER TABLE [dbo].[Exchange]  WITH CHECK ADD  CONSTRAINT [FK_Exchange_User_BuyerID] FOREIGN KEY([userID])
REFERENCES [dbo].[User] ([userID])
GO
ALTER TABLE [dbo].[Exchange] CHECK CONSTRAINT [FK_Exchange_User_BuyerID]
GO
ALTER TABLE [dbo].[ExchangeDetail]  WITH CHECK ADD  CONSTRAINT [FK_ExchangeDetail_Exchange_ExchangeID] FOREIGN KEY([exchangeID])
REFERENCES [dbo].[Exchange] ([exchangeID])
GO
ALTER TABLE [dbo].[ExchangeDetail] CHECK CONSTRAINT [FK_ExchangeDetail_Exchange_ExchangeID]
GO
ALTER TABLE [dbo].[ExchangeDetail]  WITH CHECK ADD  CONSTRAINT [FK_ExchangeDetail_Product_BuyerProduct] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
GO
ALTER TABLE [dbo].[ExchangeDetail] CHECK CONSTRAINT [FK_ExchangeDetail_Product_BuyerProduct]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_ProductType_TypeID] FOREIGN KEY([typeID])
REFERENCES [dbo].[ProductType] ([typeID])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_ProductType_TypeID]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_User_UserProduct] FOREIGN KEY([userID])
REFERENCES [dbo].[User] ([userID])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_User_UserProduct]
GO
ALTER TABLE [dbo].[Rating]  WITH CHECK ADD  CONSTRAINT [FK_Rating_Exchange] FOREIGN KEY([exchangeID])
REFERENCES [dbo].[Exchange] ([exchangeID])
GO
ALTER TABLE [dbo].[Rating] CHECK CONSTRAINT [FK_Rating_Exchange]
GO
ALTER TABLE [dbo].[Rating]  WITH CHECK ADD  CONSTRAINT [FK_Rating_User_RatingForUserID] FOREIGN KEY([userID])
REFERENCES [dbo].[User] ([userID])
GO
ALTER TABLE [dbo].[Rating] CHECK CONSTRAINT [FK_Rating_User_RatingForUserID]
GO
ALTER TABLE [dbo].[Report]  WITH CHECK ADD  CONSTRAINT [FK_Report_Product_ReportedProductID] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
GO
ALTER TABLE [dbo].[Report] CHECK CONSTRAINT [FK_Report_Product_ReportedProductID]
GO
ALTER TABLE [dbo].[Report]  WITH CHECK ADD  CONSTRAINT [FK_Report_User_StudentID] FOREIGN KEY([userID])
REFERENCES [dbo].[User] ([userID])
GO
ALTER TABLE [dbo].[Report] CHECK CONSTRAINT [FK_Report_User_StudentID]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_User_User_RoleID] FOREIGN KEY([roleID])
REFERENCES [dbo].[Role] ([roleID])
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_User_RoleID]
GO
USE [master]
GO
ALTER DATABASE [GoodsExchangeFUDB] SET  READ_WRITE 
GO
