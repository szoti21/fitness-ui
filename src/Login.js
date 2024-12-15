  import React, { useState } from 'react';
  import { Link, useNavigate, useParams } from 'react-router-dom';
  import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
  import AppNavbar from './AppNavbar';
  import { jwtDecode } from 'jwt-decode';
  import { fetchWithAuth } from './Utils';

  const Login = () => {
    const initialFormState = {
      emailAddress: '',
      password: ''
    };

    const [login, setLogin] = useState(initialFormState);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target

        setLogin({ ...login, [name]: value })
    }

    const handleSubmit = async (event) => {
      event.preventDefault();


      await fetch(`/auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
      }).then((response) => response.text())
            .then((text) => {
              setToken(text);
            });

      setLogin(initialFormState);
  }

  const setToken = (data) => {
      sessionStorage.setItem("authToken", data);

      const decoded = jwtDecode(data);

      fetchWithAuth(`/fitness/users/${decoded.id}`, {
             method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          sessionStorage.setItem("username", data.name);
          sessionStorage.setItem("role", data.role.roleName);
          navigate('/');
        }, []);
  }

  const styles = {
    header: {
        textAlign: 'center',
    },
    container: {
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '1rem',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    highlight: {
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem',
    }
  };

  return (<div>
      <AppNavbar/>
      <div style={styles.container}>
        <h2 style={styles.header}>Login</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label style={styles.highlight} for="emailAddress">Email</Label>
            <Input type="email" name="emailAddress" id="emailAddress" value={login.emailAddress}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label style={styles.highlight} for="password">Password</Label>
            <Input type="password" name="password" id="password" value={login.password}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup style={styles.buttonContainer}>
            <Button color = "success" type="submit">Login</Button>{' '}
          </FormGroup>
        </Form>
      </div>
    </div>
    )

  };

  export default Login;