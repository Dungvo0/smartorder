// Import các module cần thiết từ Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAEoU7cx1Mw_SsYd4Zl3YYgow2C7lBbfIw",
  authDomain: "smartorder-b56f4.firebaseapp.com",
  projectId: "smartorder-b56f4",
  storageBucket: "smartorder-b56f4.appspot.com", // bạn không cần dùng Storage ở đây
  messagingSenderId: "131944066179",
  appId: "1:131944066179:web:fd503a346226d25930ffb6",
  measurementId: "G-KW4T9XV6BL"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

export { db };
