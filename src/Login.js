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
      console.log("token: ", data);
      sessionStorage.setItem("authToken", data);

      const decoded = jwtDecode(data);

      fetchWithAuth(`/fitness/users/${decoded.id}`, {
             method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.name);
          sessionStorage.setItem("username", data.name);
          navigate('/');
        }, []);
  }

  return (<div>
      <AppNavbar/>
      <Container>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="emailAddress">Email</Label>
            <Input type="email" name="emailAddress" id="emailAddress" value={login.emailAddress}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" value={login.password}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Login</Button>{' '}
          </FormGroup>
        </Form>
      </Container>
    </div>
    )

  };

  export default Login;