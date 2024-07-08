import "./CustomAlert.css";

function CustomAlert({ message, onClose }) {
  return (
    <div className="custom-alert">
      <div className="custom-alert-content">
        <span className="custom-alert-message">{message}</span>
        <button className="custom-alert-close">X</button>
      </div>
    </div>
  );
}

export default CustomAlert;
