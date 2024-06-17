import { useState } from 'react';
import './App.css';
import laptop1 from './ảnh/LaptopMSI.jpg';
import laptop2 from './ảnh/unnamed.webp';
import arrow from './ảnh/exchange.png';

function App() {
  const [indemnification, setIndemnification] = useState(0);
  const [compensation, setCompensation] = useState('');

  const handleConfirm = () => {
    alert('Bạn đã xác nhận trao đổi.');
  };

  const handleDecline = () => {
    alert('Bạn đã từ chối trao đổi.');
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4 laptop" id="laptop1">
          <img src={laptop1} alt="Laptop MSI Modern 14" className="img-fluid" />
          <p>Price: 12.999.000</p>
          <p>Owner: Chu Quoc Thanh</p>
          <p>Description: Purchased 6 months ago but rarely used</p>
          <p>Phone number: 012321316</p>
        </div>

        <div className="col-md-4 text-center exchange-arrow">
          <img src={arrow} alt="Exchange Arrows" className="img-fluid my-3" />
          <div className="compensation">
            <label htmlFor="indemnification-input">Tiền bù</label>
            <h5>
              <input
                type="number"
                id="indemnification"
                name="indemnification-input"
                min="0"
                value={indemnification}
                onChange={(e) => setIndemnification(e.target.value)}
                className="form-control"
              />
            </h5>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="compensation"
                value="buyer"
                id="buyer"
                checked={compensation === 'buyer'}
                onChange={() => setCompensation('buyer')}
              />
              <label className="form-check-label" htmlFor="buyer">Buyer</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="compensation"
                value="seller"
                id="seller"
                checked={compensation === 'seller'}
                onChange={() => setCompensation('seller')}
              />
              <label className="form-check-label" htmlFor="seller">Seller</label>
            </div>
          </div>
        </div>

        <div className="col-md-4 laptop" id="laptop2">
          <img src={laptop2} alt="Laptop Acer Aspire 3" className="img-fluid" />
          <p>Price: 13.500.000</p>
          <p>Owner: Ta Duc Thang</p>
          <p>Description: Used for 2 months</p>
          <p>Phone number: 0859627651</p>
        </div>
      </div>

      <div className="text-center mt-4 buttons">
        <button id="confirmExchange" className="btn btn-success" onClick={handleConfirm}>Make exchange</button>
        <button id="declineExchange" className="btn btn-danger" onClick={handleDecline}>Cancel</button>
      </div>
    </div>
  );
}

export default App;
