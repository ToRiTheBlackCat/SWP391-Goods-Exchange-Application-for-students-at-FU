import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from '../components/Navbar.jsx';
import {Container, Row, Col, Card } from 'react-bootstrap';
import electronic from '../assets/electronics.jpg';
import accessories from '../assets/accessories.jpg';
import houseware from '../assets/houseware.jpg';
import books from '../assets/books.jpg';
import school_supplies from '../assets/school_supplies.jpg';
import clothes from '../assets/clothes.jpg';
import styles from '../styles/Category.module.css';  // Import CSS module

const categories = [
  { img: electronic, text: 'Electronics' },
  { img: accessories, text: 'Accessories' },
  { img: houseware, text: 'Houseware' },
  { img: books, text: 'Books' },
  { img: school_supplies, text: 'School supplies' },
  { img: clothes, text: 'Clothes' },
];

function Category() {
  return (
    <div className={styles.App}>
      <header>
        <NavbarComponent/>
      </header>
      <main className={`container mt-4 ${styles.main}`}>
        <h2 className={styles.heading}>Categories</h2>
        <Container>
          <Row>
            {categories.map((category, index) => (
              <Col md={4} key={index} className={`mb-4 d-flex ${styles.col}`}>
                <Card className={styles.card}>
                  <div className={styles.cardContent}>
                    <Card.Img variant="top" src={category.img} alt={category.text} className={styles.cardImg} />
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

export default Category;
