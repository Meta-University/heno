import './Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>HENO</h1>
      </div>
      <div className="navbar-links">
        <a href="#">Home</a>
        <a href="#">Projects</a>
        <a href="#">Tasks</a>
        <a href="#">Contact</a>
        <a href="#">About</a>
      </div>
      <div className='user-profile'>
        <i class="fa-solid fa-user"></i>
      </div>

    </div>
  )
}

export default Navbar;
