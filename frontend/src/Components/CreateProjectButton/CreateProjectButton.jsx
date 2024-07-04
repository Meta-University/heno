function CreateProjectButton(props) {
  return (
    <div
      className="add-button"
      onClick={() => {
        props.displayForm();
      }}
    >
      <i className="fa-solid fa-plus"></i>
    </div>
  );
}

export default CreateProjectButton;
