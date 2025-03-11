import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // lay api userInfo dang nhap
  const checkLoginStatus = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkLoginStatus();
    };
    fetchData();
  }, []);

  const login = async () => {
    await checkLoginStatus();
  };

  // xu ly dang xuay cookie
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
      } else {
        console.log("AuthContext - Logout failed:", response.status);
      }
    } catch (err) {
      console.error("AuthContext - Logout error:", err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userInfo,
        setUserInfo,
        checkLoginStatus,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
