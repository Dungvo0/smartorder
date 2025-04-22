import React from "react";
import { Button, Form } from "react-bootstrap";

const Cart = ({ cart, updateQuantity, removeFromCart, confirmOrder }) => {
  return (
    <div
      style={{
        position: "sticky", // Giữ giỏ hàng cố định khi cuộn
        top: "20px", // Cách mép trên 20px
        right: "0", // Cách mép phải 0
        width: "300px", // Chiều rộng của giỏ hàng
        backgroundColor: "#f8f9fa", // Màu nền sáng
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
        borderRadius: "8px", // Bo góc
        padding: "15px", // Khoảng cách bên trong
        zIndex: 1000, // Đảm bảo giỏ hàng luôn nằm trên các thành phần khác
      }}
    >
      <h5 style={{ marginBottom: "15px", fontWeight: "bold" }}>🛒 Giỏ hàng</h5>
      {cart.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6c757d" }}>
          Chưa có món nào được chọn.
        </p>
      ) : (
        <>
          <div
            style={{
              maxHeight: "300px", // Chiều cao tối đa của danh sách
              overflowY: "auto", // Thêm thanh cuộn dọc nếu nội dung quá dài
              marginBottom: "15px",
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {cart.map((item) => (
                <li
                  key={item.id}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <br />
                    <span style={{ color: "#6c757d" }}>
                      {item.price.toLocaleString()} VND
                    </span>
                  </div>
                  <Form.Control
                    type="number"
                    min={1}
                    value={item.quantity}
                    style={{
                      width: "60px",
                      marginRight: "10px",
                      textAlign: "center",
                    }}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ❌
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <h6 style={{ textAlign: "right", fontWeight: "bold" }}>
            💰 Tổng tiền:{" "}
            {cart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString()}{" "}
            VND
          </h6>
          <Button
            variant="success"
            className="mt-3 w-100"
            onClick={confirmOrder}
            disabled={cart.length === 0}
          >
            ✅ Xác nhận đặt món
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;