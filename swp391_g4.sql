USE [master]
GO
/****** Object:  Database [SWP391-G4]    Script Date: 5/15/2024 11:46:09 AM ******/
CREATE DATABASE [SWP391-G4]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SWP391-G4', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER01\MSSQL\DATA\SWP391-G4.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'SWP391-G4_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER01\MSSQL\DATA\SWP391-G4_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [SWP391-G4] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [SWP391-G4].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [SWP391-G4] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [SWP391-G4] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [SWP391-G4] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [SWP391-G4] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [SWP391-G4] SET ARITHABORT OFF 
GO
ALTER DATABASE [SWP391-G4] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [SWP391-G4] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [SWP391-G4] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [SWP391-G4] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [SWP391-G4] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [SWP391-G4] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [SWP391-G4] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [SWP391-G4] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [SWP391-G4] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [SWP391-G4] SET  DISABLE_BROKER 
GO
ALTER DATABASE [SWP391-G4] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [SWP391-G4] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [SWP391-G4] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [SWP391-G4] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [SWP391-G4] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [SWP391-G4] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [SWP391-G4] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [SWP391-G4] SET RECOVERY FULL 
GO
ALTER DATABASE [SWP391-G4] SET  MULTI_USER 
GO
ALTER DATABASE [SWP391-G4] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [SWP391-G4] SET DB_CHAINING OFF 
GO
ALTER DATABASE [SWP391-G4] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [SWP391-G4] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [SWP391-G4] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [SWP391-G4] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'SWP391-G4', N'ON'
GO
ALTER DATABASE [SWP391-G4] SET QUERY_STORE = ON
GO
ALTER DATABASE [SWP391-G4] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [SWP391-G4]
GO
/****** Object:  Table [dbo].[Comment]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comment](
	[userID] [nchar](10) NOT NULL,
	[productID] [nchar](10) NOT NULL,
	[detail] [nvarchar](255) NOT NULL,
	[commentDate] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Exchange]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Exchange](
	[exchangeID] [nchar](10) NOT NULL,
	[userID] [nchar](10) NOT NULL,
	[productID] [nchar](10) NOT NULL,
	[createDate] [datetime] NOT NULL,
	[status] [nchar](20) NOT NULL,
 CONSTRAINT [PK_Exchange] PRIMARY KEY CLUSTERED 
(
	[exchangeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ExchangeDetail]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ExchangeDetail](
	[EXDID] [nchar](10) NOT NULL,
	[productID] [nchar](10) NULL,
	[balance] [int] NULL,
	[exchangeID] [nchar](10) NOT NULL,
 CONSTRAINT [PK_ExchangeDetail] PRIMARY KEY CLUSTERED 
(
	[EXDID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[productID] [nchar](10) NOT NULL,
	[productName] [nvarchar](100) NOT NULL,
	[productImage] [nvarchar](100) NOT NULL,
	[productDescription] [nvarchar](255) NULL,
	[productPrice] [int] NOT NULL,
	[typeID] [nchar](10) NOT NULL,
	[userID] [nchar](10) NOT NULL,
	[status] [nchar](50) NOT NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[productID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductType]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductType](
	[typeID] [nchar](10) NOT NULL,
	[typeName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_ProductType] PRIMARY KEY CLUSTERED 
(
	[typeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rating]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rating](
	[exchangeID] [nchar](10) NOT NULL,
	[userID] [nchar](10) NOT NULL,
	[score] [decimal](18, 0) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[roleID] [nchar](10) NOT NULL,
	[roleName] [nchar](50) NOT NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[roleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Token]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Token](
	[tokenID] [nchar](50) NOT NULL,
	[token] [nchar](100) NOT NULL,
	[type] [nchar](50) NOT NULL,
	[status] [int] NOT NULL,
 CONSTRAINT [PK_Token] PRIMARY KEY CLUSTERED 
(
	[tokenID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 5/15/2024 11:46:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[userID] [nchar](10) NOT NULL,
	[userName] [nvarchar](100) NOT NULL,
	[password] [nchar](100) NOT NULL,
	[email] [nchar](50) NOT NULL,
	[phone] [int] NULL,
	[gender] [bit] NOT NULL,
	[DOB] [date] NULL,
	[roleID] [nchar](10) NOT NULL,
	[address] [nvarchar](200) NOT NULL,
	[isBanned] [bit] NOT NULL,
	[averageScore] [float] NULL,
	[tokenID] [nchar](50) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[userID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (N'1         ', N'admin                                             ')
INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (N'2         ', N'mod                                               ')
INSERT [dbo].[Role] ([roleID], [roleName]) VALUES (N'3         ', N'student                                           ')
GO
INSERT [dbo].[Token] ([tokenID], [token], [type], [status]) VALUES (N'1                                                 ', N'#                                                                                                   ', N'#                                                 ', 1)
GO
INSERT [dbo].[User] ([userID], [userName], [password], [email], [phone], [gender], [DOB], [roleID], [address], [isBanned], [averageScore], [tokenID]) VALUES (N'u00000    ', N'admin', N'ca6d267b6bc04b7931fce76b7cf7bc20ad9a865a                                                            ', N'#                                                 ', NULL, 0, NULL, N'1         ', N'#', 0, NULL, N'1                                                 ')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Comment]    Script Date: 5/15/2024 11:46:10 AM ******/
CREATE NONCLUSTERED INDEX [IX_Comment] ON [dbo].[Comment]
(
	[userID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Comment]  WITH CHECK ADD  CONSTRAINT [FK_Comment_Comment_productID] FOREIGN KEY([productID])
REFERENCES [dbo].[Product] ([productID])
GO
ALTER TABLE [dbo].[Comment] CHECK CONSTRAINT [FK_Comment_Comment_productID]
GO
ALTER TABLE [dbo].[Comment]  WITH CHECK ADD  CONSTRAINT [FK_Comment_User_userID] FOREIGN KEY([userID])
REFERENCES [dbo].[User] ([userID])
GO
ALTER TABLE [dbo].[Comment] CHECK CONSTRAINT [FK_Comment_User_userID]
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
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_ProductType_typeID] FOREIGN KEY([typeID])
REFERENCES [dbo].[ProductType] ([typeID])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_ProductType_typeID]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_User_userProduct] FOREIGN KEY([userID])
REFERENCES [dbo].[User] ([userID])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_User_userProduct]
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
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_User_Role_roleID] FOREIGN KEY([roleID])
REFERENCES [dbo].[Role] ([roleID])
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_Role_roleID]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_User_Token] FOREIGN KEY([tokenID])
REFERENCES [dbo].[Token] ([tokenID])
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_Token]
GO
USE [master]
GO
ALTER DATABASE [SWP391-G4] SET  READ_WRITE 
GO
