import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const tables = [
  ...Array.from({ length: 10 }, (_, i) => `A${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `B${i + 1}`),
];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [newOrderItems, setNewOrderItems] = useState([{ name: "", price: "" }]);

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "Orders"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrder = async () => {
    const total = newOrderItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

    try {
      await addDoc(collection(db, "Orders"), {
        table: selectedTable,
        items: newOrderItems,
        total,
        status: "Chờ xác nhận",
        createdAt: serverTimestamp(),
      });
      fetchOrders();
      setShowModal(false);
      setNewOrderItems([{ name: "", price: "" }]);
    } catch (err) {
      console.error("❌ Lỗi lưu đơn hàng:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const orderRef = doc(db, "Orders", id);
    await updateDoc(orderRef, { status: newStatus });
    fetchOrders();
  };

  const handlePrint = (order) => {
    const content = `
      <h3>🧾 Hóa đơn - ${order.table}</h3>
      <ul>
        ${order.items.map((item) => `<li>${item.name} - ${item.price} VND</li>`).join("")}
      </ul>
      <strong>Tổng tiền: ${order.total.toLocaleString()} VND</strong>
    `;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(content);
    newWindow.print();
    newWindow.close();
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...newOrderItems];
    updated[index][field] = value;
    setNewOrderItems(updated);
  };

  const addItemField = () => {
    setNewOrderItems([...newOrderItems, { name: "", price: "" }]);
  };

  return (
    <Container>
      <h2 className="mt-4">📋 Quản lý Đơn Hàng</h2>

      <Button className="mb-3" onClick={() => setShowModal(true)}>
        ➕ Tạo đơn hàng
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Bàn</th>
            <th>Chi tiết món</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.table}</td>
              <td>
                <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.price} VND
                    </li>
                  ))}
                </ul>
              </td>
              <td>{order.total.toLocaleString()} VND</td>
              <td>{order.status}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => updateStatus(order.id, "Đã hoàn thành")}
                >
                  ✅ Hoàn thành
                </Button>{" "}
                <Button variant="outline-primary" onClick={() => handlePrint(order)}>
                  🖨️ In
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Thêm đơn */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo đơn hàng mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Chọn bàn:</Form.Label>
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

          <h6 className="mt-3">Danh sách món:</h6>
          {newOrderItems.map((item, index) => (
            <Row key={index} className="mb-2">
              <Col>
                <Form.Control
                  placeholder="Tên món"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Giá"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                />
              </Col>
            </Row>
          ))}

          <Button variant="secondary" onClick={addItemField}>
            ➕ Thêm món
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddOrder}>
            Lưu đơn hàng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;
