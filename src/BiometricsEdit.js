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
    userId: '',
    height: '',
    weight: '',
    bodyFat: ''
  };
  const [biometrics, setBiometrics] = useState(initialFormState);
  const navigate = useNavigate();
  const { date } = useParams();
  const [decodedId, setDecodedId] = useState(null);
  const [dateFormat, setDateFormat] = useState(new Date());

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

  const title = <h2>{biometrics.date ? 'Edit Biometrics' : 'Add Biometrics'}</h2>;


  return (<div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="date">Date</Label>
            <div/>
            <DatePicker selected={biometrics.date} onChange={handleDateChange} />
          </FormGroup>
          <FormGroup>
            <Label for="userId">UserId</Label>
            <Input type="text" name="userId" id="userId" value={biometrics.userId || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="height">height</Label>
            <Input type="text" name="height" id="height" value={biometrics.height || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="weight">weight</Label>
            <Input type="text" name="weight" id="weight" value={biometrics.weight || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="bodyFat">bodyFat</Label>
            <Input type="text" name="bodyFat" id="bodyFat" value={biometrics.bodyFat || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to={`/fitness/users/${decodedId}/biometrics`}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  )

};

export default BiometricsEdit;