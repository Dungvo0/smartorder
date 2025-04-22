import React, { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin"); // Lưu vai trò admin
      alert("Đăng nhập thành công với vai trò admin!");
      window.location.href = "/admin/menu"; // Chuyển hướng đến trang quản lý
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Đăng nhập Admin</h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <button onClick={handleLogin} style={{ width: "100%", padding: "10px" }}>
        Đăng nhập
      </button>
    </div>
  );
};

export default LoginPage;