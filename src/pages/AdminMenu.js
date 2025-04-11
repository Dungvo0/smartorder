import React, { useState } from "react";
import { Table, Button, Form, Container } from "react-bootstrap";

const AdminMenu = () => {
  const [menu, setMenu] = useState([
    { id: 1, name: "Phở Bò", price: 50000 },
    { id: 2, name: "Bún Chả", price: 60000 },
  ]);

  const deleteItem = (id) => {
    setMenu(menu.filter((item) => item.id !== id));
  };

  return (
    <Container>
      <h2 className="mt-4">Quản lý menu</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên món</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price} VND</td>
              <td>
                <Button variant="danger" onClick={() => deleteItem(item.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminMenu;
