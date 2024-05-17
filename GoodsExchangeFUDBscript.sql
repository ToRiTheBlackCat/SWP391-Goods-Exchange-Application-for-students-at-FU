USE [master]
GO
/****** Object:  Database [GoodsExchangeFUDB]    Script Date: 5/17/2024 2:34:56 PM ******/
CREATE DATABASE [GoodsExchangeFUDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'GoodsExchangeFUDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER01\MSSQL\DATA\GoodsExchangeFUDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'GoodsExchangeFUDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER01\MSSQL\DATA\GoodsExchangeFUDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
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
/****** Object:  Table [dbo].[Comment]    Script Date: 5/17/2024 2:34:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comment](
	[userID] [int] NOT NULL,
	[productID] [int] NOT NULL,
	[detail] [nvarchar](255) NOT NULL,
	[commentDate] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Exchange]    Script Date: 5/17/2024 2:34:57 PM ******/
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
/****** Object:  Table [dbo].[ExchangeDetail]    Script Date: 5/17/2024 2:34:57 PM ******/
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
/****** Object:  Table [dbo].[Product]    Script Date: 5/17/2024 2:34:57 PM ******/
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
/****** Object:  Table [dbo].[ProductType]    Script Date: 5/17/2024 2:34:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductType](
	[typeID] [int] IDENTITY(1,1) NOT NULL,
	[typeName] [nchar](50) NOT NULL,
 CONSTRAINT [PK_ProductType] PRIMARY KEY CLUSTERED 
(
	[typeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rating]    Script Date: 5/17/2024 2:34:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rating](
	[exchangeID] [int] NOT NULL,
	[userID] [int] NOT NULL,
	[score] [decimal](18, 0) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 5/17/2024 2:34:57 PM ******/
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
/****** Object:  Table [dbo].[User]    Script Date: 5/17/2024 2:34:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[userID] [int] IDENTITY(1,1) NOT NULL,
	[userName] [nvarchar](50) NOT NULL,
	[password] [nchar](255) NOT NULL,
	[email] [nchar](50) NOT NULL,
	[phone] [int] NOT NULL,
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
SET IDENTITY_INSERT [dbo].[Role] ON 

INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (1, N'admin                                             ')
INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (2, N'mod                                               ')
INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (3, N'student                                           ')
SET IDENTITY_INSERT [dbo].[Role] OFF
GO
ALTER TABLE [dbo].[Comment]  WITH CHECK ADD  CONSTRAINT [FK_Comment_Comment_ProductID] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
GO
ALTER TABLE [dbo].[Comment] CHECK CONSTRAINT [FK_Comment_Comment_ProductID]
GO
ALTER TABLE [dbo].[Comment]  WITH CHECK ADD  CONSTRAINT [FK_Comment_User_UserID] FOREIGN KEY([userID])
REFERENCES [dbo].[User] ([userID])
GO
ALTER TABLE [dbo].[Comment] CHECK CONSTRAINT [FK_Comment_User_UserID]
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
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_User_User_RoleID] FOREIGN KEY([roleID])
REFERENCES [dbo].[Role] ([roleID])
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_User_RoleID]
GO
USE [master]
GO
ALTER DATABASE [GoodsExchangeFUDB] SET  READ_WRITE 
GO
