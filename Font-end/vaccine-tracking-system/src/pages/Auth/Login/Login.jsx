// // login.jsx
// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaLock } from 'react-icons/fa';
// import { loginCustomer } from './api';
// import { UserContext } from './UserContext'; // Nếu bạn dùng React Context để lưu thông tin người dùng
// import './Login.css'; // CSS cho giao diện đăng nhập

/*************  ✨ Codeium Command 🌟  *************/
/**
 * Login component:
 * - Renders a form with Customer ID and password inputs.
// function Login() {
//   const [customerId, setCustomerId] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Sử dụng context để lưu thông tin người dùng
//   const { setUser } = useContext(UserContext);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const customer = await loginCustomer(customerId, password);
//       // Lưu thông tin người dùng (có thể lưu vào context, redux hoặc localStorage)
//       setUser(customer); // Nếu dùng Context, cập nhật thông tin trong UserContext
//       // Ví dụ: localStorage.setItem("customer", JSON.stringify(customer));
//       navigate("/home"); // Điều hướng tới trang chính sau khi đăng nhập thành công
//     } catch (err) {
//       setError(err.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h1 className="login-title">Login</h1>
//       <form className="login-form" onSubmit={handleLogin}>
//         <div className="input-group">
//           <FaUser className="icon" />
//           <input
//             type="text"
//             placeholder="Enter Customer ID"
//             value={customerId}
//             onChange={(e) => setCustomerId(e.target.value)}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <FaLock className="icon" />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit" className="login-button">LOGIN</button>
//       </form>
//       <div className="social-login">
//         <p>Or Sign Up Using</p>
//         <div className="social-icons">
//           <a href="#"><i className="fab fa-facebook-f"></i></a>
//           <a href="#"><i className="fab fa-twitter"></i></a>
//           <a href="#"><i className="fab fa-google"></i></a>
//         </div>
//       </div>
//       <div className="signup-link">
//         <p>Or Sign Up Using</p>
//         <a href="#">SIGN UP</a>
//       </div>
//     </div>
//   );
// }
/******  acfb4814-b36a-4ef7-acc9-96a7f9c6626e  *******/

// export default Login;
