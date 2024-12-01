import React, { useEffect, useState } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const storedUsername = sessionStorage.getItem("username");
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div>
      <AppNavbar/>
      {isLoggedIn ? (
        <Container fluid>
          <div>Welcome {username}!</div>
        </Container>
      ) : (
        <Container fluid>
          <div>Please Log in</div>
        </Container>
      )}
    </div>

  );
}

export default Home;
