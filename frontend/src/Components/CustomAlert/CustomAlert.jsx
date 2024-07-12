import "./CustomAlert.css";
import { useState } from "react";

function CustomAlert({ message, onClose }) {
  const [displayAlert, setDisplayAlert] = useState(false);

  function handleDisplayAlert() {
    setDisplayAlert(!displayAlert);
  }

  return (
    <>
      <div className="custom-alert">
        <div className="custom-alert-content">
          <span className="custom-alert-message">{message}</span>
          <button onClick={onClose} className="custom-alert-close">
            X
          </button>
        </div>
      </div>
    </>
  );
}

export default CustomAlert;
