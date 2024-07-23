import 'bootstrap/dist/css/bootstrap.min.css'; // Import CSS Bootstrap
import { Container, Row, Col, Card } from 'react-bootstrap'; // Import các thành phần từ react-bootstrap
import electronic from '../../assets/electronics.jpg'; // Import hình ảnh từ thư mục assets
import accessories from '../../assets/accessories.jpg'; 
import houseware from '../../assets/houseware.jpg'; 
import books from '../../assets/books.jpg'; 
import school_supplies from '../../assets/school_supplies.jpg'; 
import clothes from '../../assets/clothes.jpg'; 
import styles from '../../styles/Category.module.css';  // Import CSS module tùy chỉnh
import Filter from './Filter'; // Import component Filter

// Danh sách các category với hình ảnh và text tương ứng
const categories = [
  { img: electronic, text: 'Electronics', id: 1 },
  { img: accessories, text: 'Accessories', id: 3 },
  { img: houseware, text: 'Houseware', id: 4 },
  { img: books, text: 'Books', id: 2 },
  { img: school_supplies, text: 'School supplies', id: 5 },
  { img: clothes, text: 'Clothes', id: 6 },
];

// Component Category nhận 3 props: onCategorySelect, selectedCategoryId, và onSortChange
function Category({ onCategorySelect, selectedCategoryId, onSortChange }) {
  return (
    <div className={styles.App}>
      {/* Component Filter để thay đổi sắp xếp danh mục */}
      <Filter onSortChange={onSortChange} />
      <main className={`container mt-4 ${styles.main}`}>
        {/* Tiêu đề cho phần danh mục */}
        <h2 className={styles.heading}>Categories</h2>
        <Container>
          <Row>
            {/* Duyệt qua mảng categories và render từng danh mục */}
            {categories.map((category) => (
              <Col md={4} key={category.id} className={`mb-4 d-flex ${styles.col}`}>
                {/* Thẻ Card để hiển thị thông tin của từng danh mục */}
                <Card
                  className={`${styles.card} ${selectedCategoryId === category.id ? styles.selectedCategory : ''}`}
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className={styles.cardContent}>
                    {/* Hình ảnh của danh mục */}
                    <Card.Img
                      variant="top"
                      src={category.img}
                      alt={category.text}
                      className={styles.cardImg}
                    />
                    <Card.Body className={styles.cardBody}>
                      {/* Text hiển thị tên của danh mục */}
                      <Card.Text className={styles.cardText}>{category.text}</Card.Text>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default Category;
