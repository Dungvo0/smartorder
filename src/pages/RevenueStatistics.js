import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Container, Table, Button, Row, Col } from "react-bootstrap";

const RevenueStatistics = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("day");

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "Orders"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const groupOrders = () => {
    const map = new Map();

    orders.forEach((order) => {
      let key;
      if (filter === "day") {
        const d = new Date(order.date.seconds * 1000);
        key = d.toLocaleDateString("vi-VN");
      } else if (filter === "week") {
        key = `Tuần ${order.week}`;
      } else if (filter === "month") {
        key = `Tháng ${order.month}`;
      }

      if (!map.has(key)) {
        map.set(key, {
          total: 0,
          discount: 0,
          count: 0,
        });
      }

      const item = map.get(key);
      item.total += order.totalAmount;
      item.discount += order.discount || 0;
      item.count += 1;
      map.set(key, item);
    });

    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const grouped = groupOrders();

  return (
    <Container>
      <h2 className="mt-4">📊 Thống kê doanh thu</h2>
      <Row className="mb-3">
        <Col>
          <Button variant={filter === "day" ? "primary" : "outline-primary"} onClick={() => setFilter("day")}>
            Theo ngày
          </Button>{" "}
          <Button variant={filter === "week" ? "primary" : "outline-primary"} onClick={() => setFilter("week")}>
            Theo tuần
          </Button>{" "}
          <Button variant={filter === "month" ? "primary" : "outline-primary"} onClick={() => setFilter("month")}>
            Theo tháng
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{filter === "day" ? "Ngày" : filter === "week" ? "Tuần" : "Tháng"}</th>
            <th>Số đơn</th>
            <th>Giảm giá</th>
            <th>Tổng doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {grouped.map(([key, val], index) => (
            <tr key={index}>
              <td>{key}</td>
              <td>{val.count}</td>
              <td>{val.discount.toLocaleString()} VND</td>
              <td>{val.total.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default RevenueStatistics;
