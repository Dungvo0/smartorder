import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import OrderPage from "./pages/OrderPage";
import AdminMenu from "./pages/AdminMenu";
import AdminAdd from "./pages/AdminAdd";
import TableManagement from "./pages/TableManagement";
import RevenueStatistics from "./pages/RevenueStatistics";
import LoginPage from "./pages/LoginPage";
import { Navbar, Nav, Container } from "react-bootstrap";

// Hàm lấy vai trò người dùng
const getUserRole = () => {
  return localStorage.getItem("role") || "customer"; // Mặc định là "customer"
};

// Bảo vệ các trang quản lý
const ProtectedRoute = ({ children, role }) => {
  const userRole = getUserRole();
  if (userRole !== role) {
    return <Navigate to="/login" replace />; // Chuyển hướng đến trang đăng nhập nếu không phải admin
  }
  return children;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem("role"); // Xóa vai trò
    alert("Đăng xuất thành công!");
    window.location.href = "/"; // Chuyển hướng về trang đặt món
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>SmartOrder</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">Đặt món</Nav.Link>
            {getUserRole() === "admin" && (
              <>
                <Nav.Link as={Link} to="/admin/menu">Quản lý menu</Nav.Link>
                <Nav.Link as={Link} to="/admin/table">Quản lý bàn</Nav.Link>
                <Nav.Link as={Link} to="/admin/add">Thêm món</Nav.Link>
                <Nav.Link as={Link} to="/admin/revenueStatistics">Thống kê</Nav.Link>
                <Nav.Link onClick={handleLogout}>Đăng xuất</Nav.Link>
              </>
            )}
            {getUserRole() !== "admin" && (
              <Nav.Link as={Link} to="/login">Đăng nhập Admin</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        {/* Trang khách hàng */}
        <Route path="/" element={<OrderPage />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Các trang quản lý chỉ dành cho admin */}
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute role="admin">
              <AdminMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/table"
          element={
            <ProtectedRoute role="admin">
              <TableManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <ProtectedRoute role="admin">
              <AdminAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/revenueStatistics"
          element={
            <ProtectedRoute role="admin">
              <RevenueStatistics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
