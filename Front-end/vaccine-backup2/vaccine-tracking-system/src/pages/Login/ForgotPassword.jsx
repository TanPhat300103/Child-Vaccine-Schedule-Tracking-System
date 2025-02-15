import { useState } from "react";
import { auth, sendPasswordResetEmail } from "../../config/firebase.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Link đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Quên mật khẩu</h2>
      <input
        type="email"
        placeholder="Nhập email"
        className="border p-2 rounded w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleForgotPassword}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Gửi email đặt lại mật khẩu
      </button>
    </div>
  );
}
