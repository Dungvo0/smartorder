// src/pages/TestFirebase.js
import React, { useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const TestFirebase = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Menu"));
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
        alert("✅ Firebase đã kết nối thành công!");
      } catch (error) {
        console.error("❌ Lỗi kết nối Firebase:", error);
        alert("❌ Lỗi kết nối Firebase, xem console để biết chi tiết.");
      }
    };

    fetchData();
  }, []);

  return <h3>Đang kiểm tra kết nối Firebase...</h3>;
};

export default TestFirebase;
