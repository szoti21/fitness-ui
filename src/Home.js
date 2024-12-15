import React, { useEffect, useState } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container, ButtonGroup, } from 'reactstrap';
import { jwtDecode } from 'jwt-decode';
import { fetchWithAuth } from './Utils';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [decodedId, setDecodedId] = useState(null);
  const [biometrics, setBiometrics] = useState([]);


  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const storedUsername = sessionStorage.getItem("username");
    const date = new Date();

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setDecodedId((jwtDecode(token)).id);
    }
  }, []);

  const styles = {
        header: {
            background: '#4CAF50',
            color: 'white',
            padding: '1rem 0',
            textAlign: 'center',
        },
        container: {
            maxWidth: '800px',
            margin: '2rem auto',
            padding: '1rem',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        highlight: {
            fontWeight: 'bold',
            color: '#333',
        },
        buttons: {
            display: 'flex',
            gap: '10px'
        },
        link: {
            color: '#4CAF50',
            textDecoration: 'underline',
        }
    };

  return (
    <div>
      <AppNavbar/>
      {isLoggedIn ? (
        <div style={styles.container}>
          <h2>Welcome Back, {username}!</h2>
          <p>Keep up the great work!</p>
          <p>Check out your detailed progress in the: <a href="/fitness/users/${decodedId}/biometrics" style={styles.link}>Biometrics Tab</a></p>
          <p>Don’t forget to check your: <a href="/fitness/users/${decodedId}/intake" style={styles.link}>Intake Records</a></p>
        </div>
      ) : (
        <div>
          <header style={styles.header}>
              <h1>Welcome to FitnessTracker</h1>
          </header>
          <div style={styles.container}>
              <h2>Take Control of Your Health</h2>
              <p>FitTrack is your ultimate companion for tracking your fitness journey. With our app, you can:</p>
              <ul>
                  <li>Monitor your calorie intake</li>
                  <li>Track changes in biometrics like body fat percentage and weight</li>
                  <li>Set and achieve your fitness goals</li>
              </ul>
              <p>Sign up today and start your journey toward a healthier you!</p>
              <div style ={styles.buttons}>
                <Button color="success" tag={Link} to="/auth/registration">Get Started</Button>
                <Button color = "success" tag={Link} to='/auth/login'>Log In</Button>
              </div>
          </div>
        </div>
      )}
    </div>

  );


}

export default Home;
