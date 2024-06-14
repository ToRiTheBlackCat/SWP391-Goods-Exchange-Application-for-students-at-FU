import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';
import { Container, Row, Col, Card } from 'react-bootstrap';
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

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedPage(page);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Update selected category
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className={styles.App}>
          <header>
            <h2 className={styles.heading}>Categories</h2>
            <Container>
              <Row>
                {categories.map((category, index) => (
                  <Col md={4} key={index} className={`mb-4 d-flex ${styles.col}`}>
                    <Card
                      className={`${styles.card} ${selectedCategory === category.text ? styles.selected : ''}`}
                      onClick={() => handleCategorySelect(category.text)}
                    >
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
          </header>
          <main className={`container mt-4 ${styles.main}`}>
            <ProductList currentPage={currentPage} />
            <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
