function CreateProjectButton(props) {
  return (
    <button
      className="create-project-button"
      onClick={() => {
        console.log("hi");
        props.displayForm();
      }}
    >
      New Project
    </button>
  );
}

export default CreateProjectButton;
