import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Store error information for logging purposes
    this.setState({ errorInfo });
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#ffdddd",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "#d9534f", fontWeight: "bold" }}>
            Something went wrong. Please try again later.
          </h2>
          <p>
            We apologize for the inconvenience. Please refresh the page or
            contact support.
          </p>
          <details style={{ marginTop: "10px" }}>
            <summary>Click for more details</summary>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
