import React, { useState } from "react";
import "./RetryReorganisationModal.css";

function RetryReorganisationModal({ showModal, onClose, onSubmit }) {
  const [feedback, setFeedback] = useState("");

  if (!showModal) {
    return null;
  }

  function handleSubmit() {
    onSubmit(feedback);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div id="feedback-form" className="modal-content">
        <h2>Retry Schedule Reorganization</h2>
        <p>Please provide your feedback to improve the schedule:</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here"
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default RetryReorganisationModal;
