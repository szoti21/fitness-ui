import React from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const Home = () => {
  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <Button color="link"><Link to="/fitness/users">Manage Users</Link></Button>
      </Container>
      <Container fluid>
              <Button color="link"><Link to="/fitness/users/1/biometrics">Manage My Biometrics</Link></Button>
      </Container>
    </div>

  );
}

export default Home;
