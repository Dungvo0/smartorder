import React, { useState, useEffect } from "react";
import { Table, Button, Form, Container, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const AdminMenu = () => {
  const [menu, setMenu] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountItem, setDiscountItem] = useState(null);
  const [discountValue, setDiscountValue] = useState(10);

  const fetchMenu = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Menu"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setMenu(items);
    } catch (error) {
      console.error("Lỗi khi tải menu:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "Menu", id));
      fetchMenu();
    } catch (error) {
      console.error("Lỗi khi xóa món:", error);
    }
  };

  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditedName(item.name);
    setEditedPrice(item.originalPrice || item.price); // Sửa cả khi đã có giảm giá
  };

  const saveChanges = async (id) => {
    try {
      await updateDoc(doc(db, "Menu", id), {
        name: editedName,
        price: Number(editedPrice),
        originalPrice: null, // Nếu admin chỉnh giá thì xóa giảm giá cũ
        discountPercent: null,
      });
      setEditingItemId(null);
      fetchMenu();
    } catch (error) {
      console.error("Lỗi khi cập nhật món:", error);
    }
  };

  const handleDiscountClick = (item) => {
    setDiscountItem(item);
    setDiscountValue(10);
    setShowDiscountModal(true);
  };

  const applyDiscountToItem = async () => {
    try {
      const originalPrice = discountItem.originalPrice || discountItem.price;
      const discountedPrice = Math.floor(originalPrice * (1 - discountValue / 100));

      await updateDoc(doc(db, "Menu", discountItem.id), {
        originalPrice,
        price: discountedPrice,
        discountPercent: discountValue,
      });

      setShowDiscountModal(false);
      fetchMenu();
    } catch (error) {
      console.error("Lỗi khi giảm giá:", error);
    }
  };

  const toggleStatus = async (item) => {
    try {
      await updateDoc(doc(db, "Menu", item.id), {
        status: item.status === "available" ? "unavailable" : "available",
      });
      fetchMenu();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const renderNameWithTooltip = (item) => {
    if (item.status === "unavailable") {
      return (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Món này đã hết</Tooltip>}
        >
          <span style={{ color: "gray" }}>{item.name}</span>
        </OverlayTrigger>
      );
    }
    return item.name;
  };

  return (
    <Container>
      <h2 className="mt-4 mb-3">🛠️ Quản lý Menu</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tên món</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td>
                {editingItemId === item.id ? (
                  <Form.Control
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  renderNameWithTooltip(item)
                )}
              </td>
              <td>
                {editingItemId === item.id ? (
                  <Form.Control
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                ) : item.originalPrice ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "gray", marginRight: 5 }}>
                      {item.originalPrice.toLocaleString()}₫
                    </span>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {item.price.toLocaleString()}₫ (-{item.discountPercent}%)
                    </span>
                  </>
                ) : (
                  <>{item.price.toLocaleString()}₫</>
                )}
              </td>
              <td>
                <Button
                  variant={item.status === "available" ? "success" : "secondary"}
                  size="sm"
                  onClick={() => toggleStatus(item)}
                >
                  {item.status === "available" ? "Còn món" : "Hết món"}
                </Button>
              </td>
              <td>
                {editingItemId === item.id ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => saveChanges(item.id)}
                  >
                    💾 Lưu
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => startEditing(item)}
                    >
                      ✏️ Sửa
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDiscountClick(item)}
                    >
                      💸 Giảm giá
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      ❌ Xóa
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal chọn mức giảm giá */}
      <Modal show={showDiscountModal} onHide={() => setShowDiscountModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn mức giảm giá (%)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Mức giảm giá</Form.Label>
            <Form.Select
              value={discountValue}
              onChange={(e) => setDiscountValue(parseInt(e.target.value))}
            >
              {[0, 10, 20, 30, 40, 50].map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDiscountModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={applyDiscountToItem}>
            Áp dụng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminMenu;
