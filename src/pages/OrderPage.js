import React, { useState } from "react";
import { Card, Button, Container, Row, Col, Nav } from "react-bootstrap";

const foodItems = [
  { id: 1, name: "Phở Bò", price: 50000, image: "/images/pho.jpg" },
  { id: 2, name: "Bún Chả", price: 60000, image: "/images/buncha.jpg" },
  { id: 3, name: "Cơm Tấm", price: 55000, image: "/images/comtam.jpg" },
  { id: 4, name: "Hủ Tiếu", price: 45000, image: "/images/hutieu.jpg" },
  { id: 5, name: "Bánh Mì", price: 30000, image: "/images/banhmi.jpg" },
  { id: 6, name: "Lẩu Thái", price: 250000, image: "/images/lauthai.jpg" },
];

const drinkItems = [
  { id: 7, name: "Trà Đào", price: 30000, image: "/images/tradao1.jpg" },
  { id: 8, name: "Cà Phê Sữa", price: 25000, image: "/images/cafe.jpg" },
  { id: 9, name: "Sinh Tố Bơ", price: 40000, image: "/images/sinhtobo.jpg" },
  { id: 10, name: "Nước Cam", price: 35000, image: "/images/nuoccam.jpg" },
  { id: 11, name: "Trà Sữa Trân Châu", price: 45000, image: "/images/trasua.jpg" },
  { id: 12, name: "Coca Cola", price: 20000, image: "/images/coca.jpg" },
];

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("food");
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <Container>
      <h2 className="mt-4">Thực đơn</h2>

      {/* Tabs Chọn Danh Mục */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
        <Nav.Item>
          <Nav.Link eventKey="food">🍛 Đồ ăn</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="drink">🥤 Thức uống</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Hiển thị nội dung theo tab */}
      {activeTab === "food" && (
        <>
          <h3 className="mt-4">🍛 Đồ ăn</h3>
          <Row>
            {foodItems.map((item) => (
              <Col key={item.id} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={item.image} alt={item.name} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.price.toLocaleString()} VND</Card.Text>
                    <Button variant="primary" onClick={() => addToCart(item)}>
                      Đặt món
                    </Button>
                    <Button variant="primary" onClick={() => addToCart(item)}>
                      Thêm món 
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {activeTab === "drink" && (
        <>
          <h3 className="mt-4">🥤 Thức uống</h3>
          <Row>
            {drinkItems.map((item) => (
              <Col key={item.id} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={item.image} alt={item.name} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.price.toLocaleString()} VND</Card.Text>
                    <Button variant="primary" onClick={() => addToCart(item)}>
                      Đặt món
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default OrderPage;
