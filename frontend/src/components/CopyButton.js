import React, { useState } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons"; // Sửa thành faCopy
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../style/CopyButton.css";

const CopyButton = ({ textToCopy }) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="copy-container">
      <button className="copy-button" onClick={handleCopy}>
        <FontAwesomeIcon icon={faCopy} className="copy-icon" />{" "}
        {/* Sử dụng faCopy */}
      </button>
      {showCopied && <span className="copied-message">Đã copy</span>}
    </div>
  );
};

export default CopyButton;
