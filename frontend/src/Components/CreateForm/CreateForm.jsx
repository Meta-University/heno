import React, { useState } from "react";
import "./CreateForm.css";

function CreateForm(props) {
  return (
    <div id="create-project-form" className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={props.displayForm}>
          &times;
        </span>
        <h1>Create a New Project</h1>
        <form>
          <input type="text" placeholder="Project Name" />
          <textarea placeholder="Project Description"></textarea>
          <input type="date" placeholder="Project Due Date" />
          <button className="create">Create Project</button>
        </form>
      </div>
    </div>
  );
}

export default CreateForm;
