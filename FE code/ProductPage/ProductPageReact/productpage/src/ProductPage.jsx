
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
          <p>Information has been censored.<a href="#">Find out more</a></p>
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
        <div className="specs mt-4">
          <h2 className="h4">Configuration</h2>
          <ul className="list-unstyled">
            <li className="bg-light p-2 mb-2">CPU: i31115G43GHz</li>
            <li className="bg-light p-2 mb-2">RAM: 8 GBDDR4 2 slots (1 8 GB slot + 1 removable slot) 3200 MHz</li>
            <li className="bg-light p-2 mb-2">Hard Drive: 256 GB NVMe PCIe SSD (Can be removed and installed with another stick up to 2 TB)</li>
            <li className="bg-light p-2 mb-2">Screen: 14 Full HD (1920 x 1080)</li>
            <li className="bg-light p-2 mb-2">Graphic card: Intel UHD integrated card</li>
            <li className="bg-light p-2 mb-2">Connector: USB Type-C3.5mm headphone jack HDMI2 x USB 3.2</li>
            <li className="bg-light p-2 mb-2">Operating system: Windows 11 Home SL</li>
            <li className="bg-light p-2 mb-2">Design: Metal case</li>
            <li className="bg-light p-2 mb-2">Size, mass: Length 319 mm - Width 219 mm - Thickness 18.1 mm - Weight 1.3 kg</li>
            <li className="bg-light p-2 mb-2">Time of use: 1 year</li>
          </ul>
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
