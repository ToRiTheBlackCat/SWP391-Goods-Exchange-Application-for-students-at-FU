import React from 'react';
import PropTypes from 'prop-types';
import BannerZero from "../../assets/GEF3.jpg";
import BannerOne from "../../assets/GEF2.jpg";
import BannerTwo from "../../assets/GEF1.jpg";

function BannerIndicator(props) {
  return (
    <button
      type="button"
      data-bs-target="#bannerIndicators"
      data-bs-slide-to={props.index}
      className={props.active ? "active" : ""}
      aria-current={props.active}
    />
  );
}

function BannerImage(props) {
  return (
    <div
      className={"carousel-item " + (props.active ? "active" : "")}
      data-bs-interval="5000"
    >
      <div
        className="ratio"
        style={{ "--bs-aspect-ratio": "50%", maxHeight: "460px" }}
      >
        <img
          className="d-block w-100 h-100 bg-dark cover"
          alt=""
          src={props.image}
        />
      </div>
      {/* <div className="carousel-caption d-none d-lg-block">
        <h5>Banner Header</h5>
        <p>Some representative placeholder content for the banner.</p>
      </div> */}
    </div>
  );
}

function Banner() {
  return (
    <div
      id="bannerIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="5000" // Tự động chuyển đổi hình ảnh sau mỗi 5 giây
      style={{ marginTop: "56px" }}
    >
      <div className="carousel-indicators">
        <BannerIndicator index={0} active={true} />
        <BannerIndicator index={1} active={false} />
        <BannerIndicator index={2} active={false} />
      </div>
      <div className="carousel-inner">
        <BannerImage image={BannerZero} active={true} />
        <BannerImage image={BannerOne} active={false} />
        <BannerImage image={BannerTwo} active={false} />
      </div>
    </div>
  );
}

BannerIndicator.propTypes = {
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};
BannerImage.propTypes = {
  active: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
};

export default Banner;
