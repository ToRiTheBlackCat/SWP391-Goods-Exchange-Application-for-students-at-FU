
import './Product.css';
import Laptop from './ảnh/msi1.jpg';
import screen from './ảnh/màn hình.jpg';
import design from './ảnh/thiết kế.jpg';
import os from './ảnh/hệ điều hành.jpg';
import connect from './ảnh/cổng kết nối.jpg';
import doben from './ảnh/độ bền.jpg';
import anhliem from './ảnh/anhliem.jpg';

function Product() {
  return (
    <div className="container mt-5">
      <div className="product">
        <h1 className="display-4">Laptop MSI Modern 14</h1>
        <p className="price text-danger">12.999.000 đ</p>
        <div className="location">
          <p>Vinhome Grand Park</p>
          <p>Posted 1 hour ago</p>
          <p>Information has been censored.</p>
        </div>
        <div className="gallery text-center">
          <img src={Laptop} className="img-fluid" alt="Laptop" />
          <div className="thumbnails d-flex justify-content-center mt-3">
            <img src={screen} className="img-thumbnail mx-1" alt="màn hình" />
            <img src={design} className="img-thumbnail mx-1" alt="thiết kế" />
            <img src={os} className="img-thumbnail mx-1" alt="hệ điều hành" />
            <img src={connect} className="img-thumbnail mx-1" alt="cổng kết nối" />
            <img src={doben} className="img-thumbnail mx-1" alt="độ bền" />
          </div>
        </div>
        <div className="details mt-4">
          <h2 className="h4">Detailed description</h2>
          <p>Bought 6 months ago but rarely used</p>
        </div>
      </div>
      <div className="chat-box position-fixed">
        <div className="user-info d-flex align-items-center mb-3">
          <img src={anhliem} alt="User Avatar" className="user-avatar rounded-circle mr-3" />
          <div className="user-details">
            <div className="user-name font-weight-bold">Chu Quoc Thanh</div>
            <div className="user-rating text-muted">
              <span className="star">⭐</span> 4.8 (3)
            </div>
          </div>
        </div>
        <div className="chat-buttons d-flex justify-content-between mb-3">
          <button className="btn btn-success w-50 mr-1">Phone</button>
          <button className="btn btn-primary w-50 ml-1">Chat</button>
        </div>
        <div className="chat-inputs">
          <button className="btn btn-info w-100">Exchange</button>
        </div>
      </div>
    </div>
  );
}

export default Product;
