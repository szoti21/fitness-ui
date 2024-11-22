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
        <div>Welcome xyz! or Redirect to login?</div>
      </Container>
      <Container fluid>
        <div>Your progress this month: ... check it out in more detail, check your recommended diet</div>
      </Container>
    </div>

  );
}

export default Home;
