import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Nav,
  Spinner,
  Form,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("food");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const tables = [
    ...Array.from({ length: 10 }, (_, i) => `A${i + 1}`),
    ...Array.from({ length: 8 }, (_, i) => `B${i + 1}`),
  ];

  const fetchMenu = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "Menu"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMenuItems(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((i) =>
        i.id === id ? { ...i, quantity: parseInt(quantity) } : i
      )
    );
  };

  const confirmOrder = async () => {
    if (!selectedTable || cart.length === 0) {
      alert("Vui lòng chọn bàn và ít nhất 1 món!");
      return;
    }

    const tableRef = doc(db, "Tables", selectedTable);
    const tableDoc = await getDoc(tableRef);

    if (!tableDoc.exists()) {
      await setDoc(tableRef, {
        status: "Đang dùng",
        orders: [],
      });
    }

    const tableData = tableDoc.exists() ? tableDoc.data() : {};
    const newOrders = [...(tableData.orders || []), ...cart.map((item) => ({
      ...item,
      status: "Chờ hoàn thành",
    }))];

    await updateDoc(tableRef, {
      orders: newOrders,
      status: "Đang dùng",
    });

    setCart([]);
    setSelectedTable("");
    setShowConfirmModal(false);
    alert("✅ Đặt món thành công!");
  };

  const renderItems = (category) =>
    menuItems
      .filter((item) => item.category === category)
      .map((item) => {
        const isUnavailable = item.status === "unavailable";

        const cardContent = (
          <Card
            className="h-100"
            style={{
              opacity: isUnavailable ? 0.5 : 1,
              pointerEvents: isUnavailable ? "none" : "auto",
            }}
          >
            <Card.Img
              variant="top"
              src={item.image}
              alt={item.name}
              style={{ objectFit: "cover", height: "200px" }}
            />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>
                {/* Display price with discount if available */}
                {item.discountPercent ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "gray",
                        marginRight: 5,
                      }}
                    >
                      {item.originalPrice?.toLocaleString()} VND
                    </span>
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      {item.price.toLocaleString()} VND (-{item.discountPercent}%)
                    </span>
                  </>
                ) : (
                  <>{item.price.toLocaleString()} VND</>
                )}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => addToCart(item)}
                disabled={isUnavailable}
              >
                Đặt món
              </Button>
              {isUnavailable && (
                <div className="mt-2 text-danger fw-bold">Tạm thời không có sẵn</div>
              )}
            </Card.Body>
          </Card>
        );

        return (
          <Col key={item.id} md={4} className="mb-4">
            {isUnavailable ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Món này hiện đang hết</Tooltip>}
              >
                <div>{cardContent}</div>
              </OverlayTrigger>
            ) : (
              cardContent
            )}
          </Col>
        );
      });

  return (
    <Container>
      <h2 className="mt-4">📋 Thực đơn</h2>

      <Form.Group controlId="selectTable" className="mb-3">
        <Form.Label>Chọn bàn</Form.Label>
        <Form.Select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">-- Chọn bàn --</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
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

      <h4 className="mt-5">🛒 Các món đã chọn:</h4>
      {cart.length === 0 ? (
        <p>Chưa có món nào được chọn.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - {item.price.toLocaleString()} VND ×{" "}
                <Form.Control
                  type="number"
                  min={1}
                  value={item.quantity}
                  style={{
                    display: "inline-block",
                    width: "70px",
                    marginRight: "10px",
                  }}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setCart(cart.filter((i) => i.id !== item.id))}
                >
                  ❌
                </Button>
              </li>
            ))}
          </ul>
          <h5>
            💰 Tổng tiền:{" "}
            {cart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString()}{" "}
            VND
          </h5>
        </>
      )}

      <Button
        variant="success"
        className="mt-3"
        onClick={() => setShowConfirmModal(true)}
        disabled={!selectedTable || cart.length === 0}
      >
        ✅ Xác nhận đặt món
      </Button>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn đặt {cart.length} món cho bàn{" "}
          <strong>{selectedTable}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Huỷ
          </Button>
          <Button variant="primary" onClick={confirmOrder}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderPage;
