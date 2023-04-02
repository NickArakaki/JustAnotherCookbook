import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    setShowMenu(false)
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button className='profile_menu_button' onClick={openMenu}>
        <i className="site_icon fa-solid fa-bars" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user && (
          <>
            <div className="user_drop_down_div">
              <Link onClick={closeMenu} to={`/users/${user.id}`}>My Recipes</Link>
            </div>
            <div className="user_drop_down_div">
              <Link onClick={closeMenu} to={`/my-favorites`}>Favorite Recipes</Link>
            </div>
            <div className="user_drop_down_div">
              <button className="user_drop_down_button" onClick={handleLogout}>Log Out</button>
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
