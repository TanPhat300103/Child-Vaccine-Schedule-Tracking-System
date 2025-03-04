import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  console.log("unser info la ", userInfo);
  const checkLoginStatus = async () => {
    setIsLoading(true); // Bắt đầu kiểm tra
    try {
      const response = await fetch("http://localhost:8080/auth/myprofile", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("AuthContext - User data:", data);
        setIsLoggedIn(true);
        setUserInfo(data);
      } else {
        console.log("AuthContext - Not logged in:", response.status);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } catch (err) {
      console.error("AuthContext - Error:", err);
      setIsLoggedIn(false);
      setUserInfo(null);
    } finally {
      setIsLoading(false); // Kết thúc kiểm tra
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Hàm logout để đồng bộ với Header
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUserInfo(null);
        console.log("AuthContext - Logged out");
      }
    } catch (err) {
      console.error("AuthContext - Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userInfo,
        setUserInfo,
        checkLoginStatus,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
