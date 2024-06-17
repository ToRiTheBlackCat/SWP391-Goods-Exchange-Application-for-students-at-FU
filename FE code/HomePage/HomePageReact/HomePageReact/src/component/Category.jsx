
import 'bootstrap/dist/css/bootstrap.min.css';
import './Category.css';
import { Navbar, Nav, Form, FormControl, Button, Container, Row, Col, Card } from 'react-bootstrap';
import electronic from './img_cate/electronics.jpg';
import accessories from './img_cate/accessories.jpg';
import houseware from './img_cate/houseware.jpg';
import books from './img_cate/books.jpg';
import school_supplies from './img_cate/school_supplies.jpg';
import clothes from './img_cate/clothes.jpg';

const categories = [
  { img: electronic, text: 'Electronics' },
  { img: accessories, text: 'Accessories' },
  { img: houseware, text: 'Houseware' },
  { img: books, text: 'Book' },
  { img: school_supplies, text: 'School supplies' },
  { img: clothes, text: 'Clothes' },
];

function App() {
  return (
    <div className="App">
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="mr-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#" className="active">Category</Nav.Link>
            </Nav>
            <Form inline className="search-form ml-auto">
              <FormControl type="search" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">🔍</Button>
            </Form>
            <Nav className="ml-auto">
              <Nav.Link href="#" className="mr-2">Login</Nav.Link>
              <Nav.Link href="#">Sign up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
      <main className="container mt-4">
        <h2>Popular categories</h2>
        <Container>
          <Row>
            {categories.map((category, index) => (
              <Col md={4} key={index} className="mb-4 d-flex">
                <Card className="w-100">
                  <Card.Img variant="top" src={category.img} alt={category.text} />
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <Card.Text className="m-0">{category.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default App;