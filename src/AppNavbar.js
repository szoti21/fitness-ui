import React, { useState, useEffect } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavItem, NavLink, ButtonDropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const AppNavbar = () => {

  const [dropdown, setDropdown] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [decodedId, setDecodedId] = useState(null);

  useEffect(() => {
    // Check sessionStorage for login details
    const token = sessionStorage.getItem("authToken");
    const storedUsername = sessionStorage.getItem("username");

    console.log("user:", storedUsername);
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setDecodedId((jwtDecode(token)).id);
    }
  }, []);

  const handleLogout = () => {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("username");
      setIsLoggedIn(false);
      setUsername("");
      window.location.href = '/';
  };

  const toggle = () => setDropdown(!dropdown);



  return (
    <Navbar color="dark" dark expand="md">

      <Nav className="justify-content-between" style={{width: "70%"}} navbar>
        <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
        <NavbarBrand tag={Link} to={decodedId ? `/fitness/users/${decodedId}/biometrics` : '/'}>My biometrics</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/users/1/biometrics">My Intake</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/users/1/biometrics">Intake Calculator</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/food">Manage Foods</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/users">Manage Users</NavbarBrand>

      </Nav>
      {!isLoggedIn ? (
        <Nav className="justify-content-end" style={{width: "20%"}} navbar>
          <NavItem>
            <NavLink tag={Link} to="/auth/registration">Sign up</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/auth/login">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://google.com">Options</NavLink>
          </NavItem>
        </Nav>
      ) : (

          <Nav className="justify-content-end" style={{ width: '20%' }} navbar>
             <ButtonDropdown isOpen={dropdown} toggle={toggle} id="dropdown-basic-button">
               <DropdownToggle caret>{username}</DropdownToggle>
               <DropdownMenu>
                 <DropdownItem tag={Link} to={ `/fitness/users/${decodedId}` } state={{ fromList: false }}>Profile Settings</DropdownItem>
                 <DropdownItem onClick={handleLogout}>Log out</DropdownItem>
               </DropdownMenu>
             </ButtonDropdown>
          </Nav>
      )}

    </Navbar>
  );
};

export default AppNavbar;