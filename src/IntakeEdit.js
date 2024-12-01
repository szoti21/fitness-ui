import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { jwtDecode } from 'jwt-decode';
import { fetchWithAuth } from './Utils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const IntakeEdit = () => {
  const initialFormState = {
    date: '',
    userId: '',
    food: {id: ''},
    quantity: ''
  };
  const [intake, setIntake] = useState(initialFormState);
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();
  const { date } = useParams();
  const [decodedId, setDecodedId] = useState(null);
  const [dateFormat, setDateFormat] = useState(new Date());

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setDecodedId((jwtDecode(token)).id);

    if (date !== 'new') {
      fetchWithAuth(`/fitness/users/${(jwtDecode(token)).id}/intake/${date}`)
        .then(response => response.json())
        .then(data => setIntake(data));
        console.log("fodidhelo: ", intake.food.id);
    }
    fetchWithAuth(`/fitness/food`)
            .then(response => response.json())
            .then(data => setFoods(data));
  }, [date, setIntake]);

  const handleChange = (event) => {
    const { name, value } = event.target
    setIntake({ ...intake, [name]: value })

  }

  const handleFoodChange = (e) => {
    setIntake({...intake, food:{id:e.target.value}});
  }

  const handleDateChange = (e) => {
    setIntake({...intake, date:e});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (date == 'new'){
      await fetchWithAuth(`/fitness/users/${decodedId}/intake`, {
        method: 'POST',
        body: JSON.stringify(intake)
      });
      setIntake(initialFormState);
      navigate('/fitness/users');
    } else {
      await fetchWithAuth(`/fitness/users/${decodedId}/intake/${date}`, {
        method: 'PUT',
        body: JSON.stringify(intake),
      });
      setIntake(initialFormState);
      navigate('/fitness/users');
    }
  }

  const title = <h2>{intake.date ? 'Edit Intake' : 'Add Intake'}</h2>;


  return (<div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="date">Date</Label>
            <div/>
            <DatePicker selected={intake.date} onChange={handleDateChange} />
          </FormGroup>
          <FormGroup>
            <Label for="userId">UserId</Label>
            <Input type="text" name="userId" id="userId" value={intake.userId || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="food-dropdown">Food</Label>
            <div/>
            <select id="food-dropdown" value={intake.food.id} onChange={handleFoodChange}>
              <option value="" disabled>Select Food</option>
              {foods.map((food) => {
                  return <option key={food.id} value={food.id}>{food.foodName}</option>;
              })}
            </select>
          </FormGroup>
          <FormGroup>
            <Label for="quantity">quantity</Label>
            <Input type="text" name="quantity" id="quantity" value={intake.quantity || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to={`/fitness/users/${decodedId}/intake`}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  )

};

export default IntakeEdit;