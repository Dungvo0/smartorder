import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ListGroup,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editableOrders, setEditableOrders] = useState([]);

  const fetchTables = async () => {
    const querySnapshot = await getDocs(collection(db, "Tables"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTables(data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleViewTable = (table) => {
    setSelectedTable(table);
    setEditableOrders(table.orders ? [...table.orders] : []);
    setShowModal(true);
  };

  const handleUpdateItemField = (index, field, value) => {
    const updated = [...editableOrders];
    updated[index][field] = field === "price" || field === "quantity" ? Number(value) : value;
    setEditableOrders(updated);
  };

  const handleToggleStatus = (index) => {
    const updated = [...editableOrders];
    updated[index].status =
      updated[index].status === "Hoàn thành" ? "Chờ hoàn thành" : "Hoàn thành";
    setEditableOrders(updated);
  };

  const handleSaveChanges = async () => {
    const tableRef = doc(db, "Tables", selectedTable.id);
    await updateDoc(tableRef, {
      orders: editableOrders,
    });
    alert("✅ Đã lưu thay đổi!");
    fetchTables();
    setSelectedTable((prev) => ({
      ...prev,
      orders: editableOrders,
    }));
  };

  const handlePayment = async () => {
    const tableRef = doc(db, "Tables", selectedTable.id);
    await updateDoc(tableRef, {
      status: "Trống",
      orders: deleteField(),
    });
    alert("✅ Thanh toán thành công. Bàn đã được đặt lại về trạng thái Trống.");
    setShowModal(false);
    fetchTables();
  };

  const calculateTotal = () => {
    return editableOrders.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  return (
    <Container>
      <h2 className="mt-4">📋 Quản lý bàn ăn</h2>
      <Row>
        {tables.map((table) => (
          <Col key={table.id} md={3} className="mb-4">
            <Card
              style={{ cursor: "pointer" }}
              bg={table.status === "Trống" ? "light" : "warning"}
              onClick={() => handleViewTable(table)}
            >
              <Card.Body>
                <Card.Title>Bàn {table.id}</Card.Title>
                <Card.Text>
                  Trạng thái:{" "}
                  <Badge
                    bg={table.status === "Trống" ? "success" : "danger"}
                  >
                    {table.status || "Không xác định"}
                  </Badge>
                </Card.Text>
                <Card.Text>
                  Món đã gọi: {table.orders ? table.orders.length : 0}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết bàn {selectedTable?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editableOrders.length > 0 ? (
            <ListGroup>
              {editableOrders.map((item, idx) => (
                <ListGroup.Item key={idx}>
                  <Row>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleUpdateItemField(idx, "name", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          handleUpdateItemField(
                            idx,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        value={item.price}
                        min="0"
                        onChange={(e) =>
                          handleUpdateItemField(idx, "price", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={4}>
                      <Badge
                        bg={
                          item.status === "Hoàn thành"
                            ? "success"
                            : "secondary"
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggleStatus(idx)}
                      >
                        {item.status}
                      </Badge>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>🪑 Chưa có món nào được đặt cho bàn này.</p>
          )}

          <h5 className="mt-3 text-end">
            Tổng tiền:{" "}
            <strong>{calculateTotal().toLocaleString()} VND</strong>
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSaveChanges}>
            💾 Lưu thay đổi
          </Button>
          <Button variant="danger" onClick={handlePayment}>
            💰 Thanh toán
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TableManagement;
