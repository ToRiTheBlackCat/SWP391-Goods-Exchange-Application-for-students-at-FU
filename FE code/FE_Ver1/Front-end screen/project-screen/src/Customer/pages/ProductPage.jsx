import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance'; // Nhập axiosInstance
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ratings from "react-ratings-declarative";
import Navbar from '../components/Navbar';
import { setProductToExchange, setSelectedProduct } from '../store/store';

const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";
//đường dẫn SVG để tạo hình ngôi sao 
function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [error, setError] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/Product/Student/ViewProductDetailWithId/${id}`);
        console.log(response.data);
        const productData = response.data;
        setProduct(productData);
        setSellerInfo(productData.productOwner);

        // Fetch product image
        const imageResponse = await axiosInstance.get(`/api/Product/GetUserImage?imageName=${productData.productImage}`);

        const fileExtension = productData.productImage.split('.').pop().toLowerCase();
        let mimeType;
        switch (fileExtension) {
          case 'jpeg':
          case 'jpg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          default:
            mimeType = 'image/jpeg'; // Default to JPEG if MIME type cannot be determined
            break;
        }

        const imgSrc = `data:${mimeType};base64,${imageResponse.data}`;
        setImageSrc(imgSrc);
        productData.imageSrc = imgSrc;

      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product.');
      }
    };

    fetchProduct();
  }, [id]);

  const getTypeName = (typeId) => {
    switch (typeId) {
      case 1:
        return 'Electronic';
      case 2:
        return 'Accessories';
      case 3:
        return 'Houseware';
      case 4:
        return 'Books';
      case 5:
        return 'School supplies';
      case 6:
        return 'Clothes';
      default:
        return 'Unknown';
    }
  };


  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleExchangeClick = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user.userId;
    if (userId) {
      // Thực hiện hành động đổi sản phẩm
      dispatch(setProductToExchange(product));
      navigate('/choose-product');
    } else {
      toast.error("Please log in first to perform this action");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleChatClick = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user.userId;
    if (userId) {
        dispatch(setSelectedProduct(product));
        const queryParams = new URLSearchParams({
        user: sellerInfo.userName,
        productID: product.productId,
        productName: product.productName
      }).toString();
      navigate(`/chat?${queryParams}`, { state: { sellerInfo: sellerInfo.userName } });
    } else {
      toast.error("Please log in first to perform this action");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleProfileClick = () => {
    navigate('/other-profile', { state: { userId: product.userId } });
    console.log(product.userId);
  };

  const handleReportClick = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user.userId;
    if (userId) {
      // Thực hiện hành động báo cáo sản phẩm
      dispatch(setSelectedProduct(product));
      navigate('/report');
    } else {
      toast.error("Please log in first to perform this action");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const currentUser = localStorage.getItem('userName');
  return (
    <>
    <Navbar/>
    <div className="container mt-5 py-4 px-xl-5">
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="row">
            <div className="col-12 mb-4">
              <img
                className="border rounded ratio ratio-1x1"
                alt={product.productName}
                src={imageSrc || Image}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="d-flex flex-column h-100">
            <h2 style={{textAlign:'left'}}><strong className="mb-1">{product.productName}</strong></h2>
            <h4 className="text-muted mb-4">{product.productPrice.toLocaleString()} VND</h4>
    
            {currentUser !== sellerInfo.userName && (
                <>
                  <div className="row g-3 mb-2">
                    <div className="col">
                      <button className="btn btn-outline-dark py-2 w-100" onClick={handleChatClick}>
                        Chat
                      </button>
                    </div>
                    <div className="col">
                      <button className="btn btn-dark py-2 w-100" onClick={handleExchangeClick}>Exchange now</button>
                    </div>
                  </div>
                  <div className="row g-3 mb-4">
                    <div className="col">
                      <button className="btn btn-outline-dark py-2 w-100" onClick={handleProfileClick}>View profile</button>
                    </div>
                    <div className="col">
                      <button className="btn btn-outline-dark py-2 w-100" onClick={handleReportClick}>Report</button>
                    </div>
                  </div>
                </>
              )}

            <h4 className="mb-0">Details</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-4">ID</dt>
              <dd className="col-sm-8 mb-3">{product.productId}</dd>

              <dt className="col-sm-4">Category</dt>
              <dd className="col-sm-8 mb-3">{getTypeName(product.typeId)}</dd>

              <dt className="col-sm-4">Owner</dt>
              <dd className="col-sm-8 mb-3">{sellerInfo.userName}</dd>

              <dt className="col-sm-4">Phone</dt>
              <dd className="col-sm-8 mb-3">{sellerInfo.phone}</dd>

              <dt className="col-sm-4">Rating of {sellerInfo.userName}</dt>
              <dd className="col-sm-8 mb-3">
                <Ratings
                  rating={sellerInfo.averageScore}
                  widgetRatedColors="rgb(253, 204, 13)"
                  widgetSpacings="2px"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    return (
                      <Ratings.Widget
                        key={i}
                        widgetDimension="20px"
                        svgIconViewBox="0 0 19 20"
                        svgIconPath={iconPath}
                        widgetHoverColor="rgb(253, 204, 13)"
                      />
                    );
                  })}
                </Ratings>
              </dd>
            </dl>

            <h4 className="mb-0">Description</h4>
            <hr />
            <p className="lead flex-shrink-0">
              <small>{product.productDescription}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ProductDetail;
