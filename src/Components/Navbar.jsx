import React, { useContext, useEffect } from "react";
// import { UserContext } from "../store/StatesProvider";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../store/StateProvider";
const Navbar = () => {
  const { user, isLoggedIn, logout } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    let val = isLoggedIn();
    if (!val) {
      navigate("/signup");
    }
  }, [isLoggedIn]);
  return (
    <div className="navbar-container">
      <ul className="navList">
        <li>
          <Link to="/" className="navLinks">
            Home
          </Link>
        </li>
        <li>
          <Link to="/createTask" className="navLinks">
            CreateTask
          </Link>
        </li>
        <li className="navLinks">{user.name}</li>
        <li>
          <Link className="navLinks" to="/login" onClick={() => logout()}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
