import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { jwtDecode } from 'jwt-decode';
import { fetchWithAuth } from './Utils';
import DatePicker, { registerLocale }  from "react-datepicker";
import hu from "date-fns/locale/hu";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from 'date-fns';
registerLocale("hu", hu);

const IntakeEdit = () => {
  const initialFormState = {
    date: '',
    userId: 0,
    food: {id: ''},
    quantity: ''
  };
  const [intake, setIntake] = useState(initialFormState);
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();
  const { date } = useParams();
  const [decodedId, setDecodedId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setDecodedId((jwtDecode(token)).id);

    if (date !== 'new') {
      fetchWithAuth(`/fitness/users/${(jwtDecode(token)).id}/intake/${date}`)
        .then(response => response.json())
        .then(data => setIntake(data));
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
      navigate(`/fitness/users/${decodedId}/intake`);
    } else {
      await fetchWithAuth(`/fitness/users/${decodedId}/intake/${date}`, {
        method: 'PUT',
        body: JSON.stringify(intake),
      });
      setIntake(initialFormState);
      navigate(`/fitness/users/${decodedId}/intake`);
    }
  }

  const parseDate = (date) => {
    const formattedString = format(date, "yyyy-MM-dd HH:mm", { awareOfUnicodeTokens: true })
    const parsedDate = parse(formattedString, 'yyyy-MM-dd HH:mm', new Date());
    return parsedDate;
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

  const title = <h2 style={styles.header}>{intake.userId ? 'Edit Intake' : 'Add Intake'}</h2>;

  return (<div>
      <AppNavbar/>
      <div style={styles.container}>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="date">Date</Label>
            <div/>
            <DatePicker selected={ intake.date ? parseDate(intake.date) : intake.date} onChange={handleDateChange} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" locale="hu" />
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
            <Label for="quantity">quantity (g)</Label>
            <Input type="text" name="quantity" id="quantity" value={intake.quantity || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to={`/fitness/users/${decodedId}/intake`}>Cancel</Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  )

};

export default IntakeEdit;