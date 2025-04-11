import React, { useState } from "react";
import { Table, Button, Container } from "react-bootstrap";

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    { id: 1, table: "Bàn 5", total: 120000, status: "Chờ xác nhận" },
    { id: 2, table: "Bàn 2", total: 80000, status: "Đang chuẩn bị" },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <Container>
      <h2 className="mt-4">Quản lý món </h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bàn</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.table}</td>
              <td>{order.total} VND</td>
              <td>{order.status}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => updateStatus(order.id, "Đã hoàn thành")}
                >
                  Hoàn thành
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderManagement;

