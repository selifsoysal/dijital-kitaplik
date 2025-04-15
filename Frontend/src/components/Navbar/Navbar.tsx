import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useLoggedInInfoContext } from "../Contexts/LoggedInInfoContex";
import Login from "../Modals/Login";
import './Navbar.css';

const Navbar: React.FC = () => {
  const { loggedInInfo, setLoggedInInfo } = useLoggedInInfoContext();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    cookies.remove("loggedInUserId");
    cookies.remove("loggedInUsername");
    cookies.remove("loggedInRole");
    setLoggedInInfo(undefined);
    navigate("/");
    window.location.reload();
  };

  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Dijital Kitaplığım</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {loggedInInfo?.role?.toLowerCase() === "admin" && (
              <li className="nav-item">
                <Link to="/admin-page" className="nav-link text-danger">Admin Paneli</Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/" className="nav-link">Anasayfa</Link>
            </li>
            <li className="nav-item">
              <Link to="/books" className="nav-link">Kitaplar</Link>
            </li>
            <li className="nav-item">
              <Link to="/authors" className="nav-link">Yazarlar</Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className="nav-link">Kategoriler</Link>
            </li>
            {!loggedInInfo ? (
              <li className="nav-item">
                <span
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={handleShowLoginModal}
                >
                  Giriş Yap
                </span>
              </li>
            ) : (
              <Dropdown>
                <Dropdown.Toggle variant="link" className="nav-link" id="dropdown-basic">
                  Profilim ({loggedInInfo.username})
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate("/readinglists")}>Okuma Listem</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Çıkış Yap</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </ul>
        </div>
      </div>
      <Login show={showLoginModal} onHide={handleCloseLoginModal} />
    </nav>
  );
};

export default Navbar;
