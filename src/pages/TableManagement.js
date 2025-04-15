import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Badge,
  Modal,
  ListGroup,
} from "react-bootstrap";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const tableList = [
  ...Array.from({ length: 10 }, (_, i) => `A${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `B${i + 1}`),
];

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTables = async () => {
    const tableCollection = collection(db, "Tables");
    const querySnapshot = await getDocs(tableCollection);
    const existingTableIds = querySnapshot.docs.map((doc) => doc.id);

    // Nếu chưa có dữ liệu thì tạo toàn bộ bàn mới
    if (existingTableIds.length === 0) {
      for (let name of tableList) {
        await setDoc(doc(db, "Tables", name), {
          status: "Trống",
          orders: [],
        });
      }
    }

    const refreshedSnapshot = await getDocs(tableCollection);
    const data = {};
    refreshedSnapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });

    const formatted = tableList.map((name) => ({
      name,
      status: data[name]?.status || "Trống",
      orders: data[name]?.orders || [],
    }));

    setTables(formatted);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const getVariant = (status) => {
    switch (status) {
      case "Trống":
        return "success";
      case "Đang dùng":
        return "warning";
      case "Đặt trước":
        return "info";
      default:
        return "secondary";
    }
  };

  const handleCardClick = (table) => {
    setSelectedTable(table);
    setShowModal(true);
  };

  const updateStatus = async (name, newStatus) => {
    await updateDoc(doc(db, "Tables", name), { status: newStatus });
    fetchTables();
  };

  const handlePayment = async () => {
    if (!selectedTable) return;

    // Lưu lịch sử thanh toán
    const historyRef = collection(db, "Payments");
    await addDoc(historyRef, {
      table: selectedTable.name,
      orders: selectedTable.orders,
      total: selectedTable.orders.reduce((sum, item) => sum + item.price, 0),
      timestamp: Timestamp.now(),
    });

    // Reset trạng thái bàn
    await setDoc(doc(db, "Tables", selectedTable.name), {
      status: "Trống",
      orders: [],
    });

    setShowModal(false);
    fetchTables();
  };

  return (
    <Container>
      <h2 className="mt-4">📋 Quản lý bàn</h2>
      <Row>
        {tables.map((table) => (
          <Col key={table.name} md={3} className="mb-3">
            <Card
              border={getVariant(table.status)}
              className="text-center cursor-pointer"
              onClick={() => handleCardClick(table)}
            >
              <Card.Body>
                <Card.Title>{table.name}</Card.Title>
                <Badge bg={getVariant(table.status)}>{table.status}</Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal xem chi tiết đơn hàng của bàn */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🍽 Đơn hàng - {selectedTable?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTable?.orders?.length > 0 ? (
            <ListGroup>
              {selectedTable.orders.map((item, index) => (
                <ListGroup.Item key={index}>
                  {item.name} - {item.price.toLocaleString()} VND
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Bàn chưa có món nào.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => updateStatus(selectedTable.name, "Đang dùng")}
          >
            Đang dùng
          </Button>
          <Button
            variant="info"
            onClick={() => updateStatus(selectedTable.name, "Đặt trước")}
          >
            Đặt trước
          </Button>
          <Button variant="danger" onClick={handlePayment}>
            ✅ Thanh toán & Reset bàn
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TableManagement;
