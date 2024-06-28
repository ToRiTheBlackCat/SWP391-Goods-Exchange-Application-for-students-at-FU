import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types'; 
import electronic from '../../assets/electronics.jpg';
import accessories from '../../assets/accessories.jpg';
import houseware from '../../assets/houseware.jpg';
import books from '../../assets/books.jpg';
import school_supplies from '../../assets/school_supplies.jpg';
import clothes from '../../assets/clothes.jpg';
import styles from '../../styles/Category.module.css';  // Import CSS module
import Filter from './Filter';

const categories = [
  { img: electronic, text: 'Electronics', id: 1 },
  { img: accessories, text: 'Accessories', id: 3 },
  { img: houseware, text: 'Houseware', id: 4 },
  { img: books, text: 'Books', id: 2 },
  { img: school_supplies, text: 'School supplies', id: 5 },
  { img: clothes, text: 'Clothes', id: 6 },
];

function Category({ onCategorySelect, selectedCategoryId, onSortChange }) {
  return (
    <div className={styles.App}>
      <Filter onSortChange={onSortChange} />
      <main className={`container mt-4 ${styles.main}`}>
        <h2 className={styles.heading}>Categories</h2>
        <Container>
          <Row>
            {categories.map((category) => (
              <Col md={4} key={category.id} className={`mb-4 d-flex ${styles.col}`}>
                <Card
                  className={`${styles.card} ${selectedCategoryId === category.id ? styles.selectedCategory : ''}`}
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className={styles.cardContent}>
                    <Card.Img
                      variant="top"
                      src={category.img}
                      alt={category.text}
                      className={styles.cardImg}
                    />
                    <Card.Body className={styles.cardBody}>
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
Category.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.number,
  onSortChange: PropTypes.func.isRequired,
};

// Define default props
Category.defaultProps = {
  selectedCategoryId: null,
};

export default Category;
``