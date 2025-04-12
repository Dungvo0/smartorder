import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Nav, Spinner } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("food");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  // Lấy dữ liệu menu từ Firebase
  const fetchMenu = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "Menu"));
    const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMenuItems(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`✅ Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const renderItems = (category) =>
    menuItems
      .filter((item) => item.category === category && item.status !== "Ẩn")
      .map((item) => (
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
      ));

  return (
    <Container>
      <h2 className="mt-4">📋 Thực đơn</h2>

      <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
        <Nav.Item>
          <Nav.Link eventKey="food">🍛 Đồ ăn</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="drink">🥤 Thức uống</Nav.Link>
        </Nav.Item>
      </Nav>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {activeTab === "food" && (
            <>
              <h4 className="mt-4">🍛 Đồ ăn</h4>
              <Row>{renderItems("food")}</Row>
            </>
          )}
          {activeTab === "drink" && (
            <>
              <h4 className="mt-4">🥤 Thức uống</h4>
              <Row>{renderItems("drink")}</Row>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default OrderPage;
