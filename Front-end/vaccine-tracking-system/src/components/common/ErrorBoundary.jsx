// src/components/ErrorBoundary.js
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state khi có lỗi
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ghi lại lỗi
    this.setState({ error, errorInfo });
    console.log("Lỗi đã xảy ra:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Hiển thị giao diện lỗi thay thế
      return (
        <div>
          <h1>Đã có lỗi xảy ra. Vui lòng thử lại sau!</h1>
        </div>
      );
    }

    return this.props.children; // Nếu không có lỗi, render component con
  }
}

export default ErrorBoundary;
