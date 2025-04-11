import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const AdminAdd = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "food",
    image: "",
  });

  // Tải dữ liệu từ Firestore
  const fetchMenu = async () => {
    const querySnapshot = await getDocs(collection(db, "Menu"));
    const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMenu(items);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Xử lý chọn ảnh từ thiết bị
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewItem((prev) => ({ ...prev, image: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Thêm món mới vào Firestore
  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.image) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "Menu"), {
        name: newItem.name,
        price: newItem.price,
        category: newItem.category,
        image: newItem.image, // base64
        createdAt: serverTimestamp(),
      });
      setNewItem({ name: "", price: "", category: "food", image: "" });
      fetchMenu();
    } catch (error) {
      console.error("Lỗi khi thêm món:", error);
      alert("❌ Lỗi khi thêm món. Xem console.");
    } finally {
      setLoading(false);
    }
  };

  // Xoá món
  const removeMenuItem = async (id) => {
    await deleteDoc(doc(db, "Menu", id));
    fetchMenu();
  };

  return (
    <Container>
      <h2 className="mt-4">🔧 Quản lý Menu (Admin)</h2>

      <h4 className="mt-4">➕ Thêm Món Mới</h4>
      <Form>
        <Form.Group>
          <Form.Label>Tên món:</Form.Label>
          <Form.Control
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Giá (VND):</Form.Label>
          <Form.Control
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Loại:</Form.Label>
          <Form.Select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            <option value="food">🍛 Đồ ăn</option>
            <option value="drink">🥤 Thức uống</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Ảnh từ thiết bị:</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
        </Form.Group>

        <Button className="mt-3" variant="success" onClick={addMenuItem} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "➕ Thêm Món"}
        </Button>
      </Form>

      {/* DANH SÁCH */}
      <h3 className="mt-5">📜 Danh sách Món Ăn & Thức Uống</h3>

      <h4>🍛 Đồ ăn</h4>
      <Row>
        {menu.filter((item) => item.category === "food").map((item) => (
          <Col key={item.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.price.toLocaleString()} VND</Card.Text>
                <Button variant="danger" onClick={() => removeMenuItem(item.id)}>
                  ❌ Xóa
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h4>🥤 Thức uống</h4>
      <Row>
        {menu.filter((item) => item.category === "drink").map((item) => (
          <Col key={item.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.price.toLocaleString()} VND</Card.Text>
                <Button variant="danger" onClick={() => removeMenuItem(item.id)}>
                  ❌ Xóa
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminAdd;
