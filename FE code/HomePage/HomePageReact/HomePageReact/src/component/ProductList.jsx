import Laptop from './image/LaptopMSI.jpg';
import keinox from './image/keinox.jpg';
import shoes from './image/shoes.jpg';
import ProductCard from './ProductCard.jsx';

const products = [
  {
    imgSrc: Laptop,
    alt: "Laptop MSI Modern 14",
    title: "Laptop MSI Modern 14",
    link: "/MSI-Modern-14",
    condition: "Used - 1 year used, condition like new",
    color: "Black",
    price: "12.990.000 vnd",
    seller: "Nguyen Van A",
    rating: 4.5
  },
  {
    imgSrc: keinox,
    alt: "Kệ để giày bằng inox",
    title: "Stainless steel shoe shelf",
    link: "/ke-de-giay",
    condition: "Used",
    color: "Black",
    price: "90.000 vnd",
    seller: "Nguyen Thi B",
    rating: 4
  },
  {
    imgSrc: shoes,
    alt: "Giày thể thao",
    title: "Sport shoes",
    link: "giay-the-thao",
    condition: "Used",
    color: "White+Blue",
    size: "Size: 40",
    price: "50.000 vnd",
    seller: "Nguyen Minh D",
    rating: 0
  }
];

const ProductList = () => {
  return (
    <div className="row">
      {products.map((product, index) => (
        <div className="col-md-4" key={index}>
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
}

export default ProductList;