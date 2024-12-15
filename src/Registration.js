  import React, { useEffect, useState } from 'react';
  import { Link, useNavigate, useParams } from 'react-router-dom';
  import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
  import AppNavbar from './AppNavbar';
  import { jwtDecode } from 'jwt-decode';
  import { fetchWithAuth } from './Utils';
  import DatePicker from "react-datepicker";

  const Registration = () => {
    const initialFormState = {
      name: '',
      emailAddress: '',
      password: '',
      birthDate: '',
      phone: '',
    };

    const [registration, setRegistration] = useState(initialFormState);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target

        setRegistration({ ...registration, [name]: value })
    }

    const handleDateChange = (e) => {
      setRegistration({...registration, birthDate:e});
    }

    const handleSubmit = async (event) => {
      event.preventDefault();


      await fetch(`/auth/registration`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registration)
      }).then((response) => response.text())
            .then((text) => {
              setToken(text);
            });

      setRegistration(initialFormState);
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
        <h2 style={styles.header}>Registration</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label style={styles.highlight} for="name">Name</Label>
            <Input type="text" name="name" id="name" value={registration.name}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label style={styles.highlight} for="emailAddress">Email</Label>
            <Input type="email" name="emailAddress" id="emailAddress" value={registration.emailAddress}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label style={styles.highlight} for="password">Password</Label>
            <Input type="password" name="password" id="password" value={registration.password}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label style={styles.highlight} for="birthDate">Birth Date</Label>
            <div/>
            <DatePicker selected={registration.birthDate} onChange={handleDateChange} />
          </FormGroup>
          <FormGroup>
            <Label style={styles.highlight} for="phone">Phone</Label>
            <Input type="tel" name="phone" id="phone" value={registration.phone}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup style={styles.buttonContainer}>
            <Button color = "success" type="submit">Register</Button>{' '}
          </FormGroup>
        </Form>
      </div>
    </div>
    )

  };

  export default Registration;