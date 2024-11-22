import React, { useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar color="dark" dark expand="md">

      <Nav className="justify-content-between" style={{width: "70%"}} navbar>
        <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/users/1/biometrics">My biometrics</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/users/1/biometrics">My Intake</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/users/1/biometrics">Intake Calculator</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/food">Manage Foods</NavbarBrand>
        <NavbarBrand tag={Link} to="/fitness/users">Manage Users</NavbarBrand>

      </Nav>
      <NavbarToggler onClick={() => { setIsOpen(!isOpen) }}/>


      <Collapse isOpen={isOpen} navbar>
        <Nav className="justify-content-end" style={{width: "100%"}} navbar>
          <NavItem>
            <NavLink href="https://google.com">Sign up</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://google.com">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://google.com">Options</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default AppNavbar;