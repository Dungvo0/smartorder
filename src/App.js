import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import OrderPage from "./pages/OrderPage";
import AdminMenu from "./pages/AdminMenu";
import AdminAdd from "./pages/AdminAdd";
import { Navbar, Nav, Container } from "react-bootstrap";
import TestFirebase from "./pages/TestFirebase";
import TableManagement from "./pages/TableManagement";
import RevenueStatistics from "./pages/RevenueStatistics";  
function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>SmartOrder</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">Đặt món</Nav.Link>
            <Nav.Link as={Link} to="/admin/menu">Quản lý menu</Nav.Link>
            <Nav.Link as={Link} to="/admin/table">Quản lý Bàn</Nav.Link>
            <Nav.Link as={Link} to="/admin/add">Thêm món </Nav.Link>
            <Nav.Link as={Link} to="/admin/revenueStatistics"> Thống kê </Nav.Link>
            

          </Nav>
        </Container>
        <div className="App">
      <TestFirebase />
    </div>
      </Navbar>
      <Routes>
        <Route path="/" element={<OrderPage />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/table" element={<TableManagement />} />
        <Route path="/admin/add" element={<AdminAdd/>} />
        <Route path="/admin/revenueStatistics" element={<RevenueStatistics/>} />
      </Routes>
    </Router>
  );
}

export default App;
