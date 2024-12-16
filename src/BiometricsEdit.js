import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { jwtDecode } from 'jwt-decode';
import { fetchWithAuth } from './Utils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BiometricsEdit = () => {
  const initialFormState = {
    date: '',
    userId: 0,
    height: '',
    weight: '',
    bodyFat: ''
  };
  const [biometrics, setBiometrics] = useState(initialFormState);
  const navigate = useNavigate();
  const { date } = useParams();
  const [decodedId, setDecodedId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setDecodedId((jwtDecode(token)).id);

    if (date !== 'new') {
      fetchWithAuth(`/fitness/users/${(jwtDecode(token)).id}/biometrics/${date}`)
        .then(response => response.json())
        .then(data => setBiometrics(data));
    }
  }, [date, setBiometrics]);

  const handleChange = (event) => {
    const { name, value } = event.target
    setBiometrics({ ...biometrics, [name]: value })
  }

  const handleDateChange = (e) => {
    setBiometrics({...biometrics, date:e});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (date == 'new'){
      await fetchWithAuth(`/fitness/users/${decodedId}/biometrics`, {
        method: 'POST',
        body: JSON.stringify(biometrics)
      });
      setBiometrics(initialFormState);
      navigate(`/fitness/users/${decodedId}/biometrics`);
    } else {
      await fetchWithAuth(`/fitness/users/${decodedId}/biometrics/${date}`, {
        method: 'PUT',
        body: JSON.stringify(biometrics),
      });
      setBiometrics(initialFormState);
      navigate(`/fitness/users/${decodedId}/biometrics`);
    }
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
      }
  };

  const title = <h2 style={styles.header}>{biometrics.userId ? 'Edit Biometrics' : 'Add Biometrics'}</h2>;

  return (<div>
      <AppNavbar/>
      <div style={styles.container}>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="date">Date</Label>
            <div/>
            <DatePicker selected={biometrics.date} onChange={handleDateChange} dateFormat="yyyy-MM-dd"/>
          </FormGroup>
          <FormGroup>
            <Label for="height">height (cm)</Label>
            <Input type="text" name="height" id="height" value={biometrics.height || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="weight">weight (kg)</Label>
            <Input type="text" name="weight" id="weight" value={biometrics.weight || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="bodyFat">bodyFat (%)</Label>
            <Input type="text" name="bodyFat" id="bodyFat" value={biometrics.bodyFat || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to={`/fitness/users/${decodedId}/biometrics`}>Cancel</Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  )

};

export default BiometricsEdit;