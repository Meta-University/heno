import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>Heno</h1>
      </div>
      <div className="navbar-links">
        <a href="/home">
          <p>Home</p>
        </a>
        <a href="/projects">
          <p>Projects</p>
        </a>
        <a href="/tasks">
          <p>Tasks</p>
        </a>
        <a href="#">
          <p>Contact</p>
        </a>
        <a href="#">
          <p>About</p>
        </a>
      </div>
      <div className="user-profile">
        <i class="fa-solid fa-user"></i>
      </div>
    </div>
  );
}

export default Navbar;
