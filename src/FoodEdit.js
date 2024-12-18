import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { fetchWithAuth } from './Utils';

const FoodEdit = () => {
  const initialFormState = {
    foodName: '',
    kcal: '',
    protein: '',
    fat: '',
    carbohydrates: ''
  };
  const [food, setFood] = useState(initialFormState);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id !== 'new') {
      fetchWithAuth(`/fitness/food/${id}`)
        .then(response => response.json())
        .then(data => setFood(data));
    }
  }, [id, setFood]);

  const handleChange = (event) => {
    const { name, value } = event.target

    setFood({ ...food, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (id == 'new'){
      await fetchWithAuth(`/fitness/food`, {
        method: 'POST',
        body: JSON.stringify(food)
      });
      setFood(initialFormState);
      navigate('/fitness/food');
    } else {
      await fetchWithAuth(`/fitness/food/${id}`, {
        method: 'PUT',
        body: JSON.stringify(food),
      });
      setFood(initialFormState);
      navigate('/fitness/food');
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

  const title = <h2 style={styles.header}>{food.id ? 'Edit Food' : 'Add Food'}</h2>;

  return (<div>
      <AppNavbar/>
      <div style={styles.container}>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="foodName">Name</Label>
            <Input type="text" name="foodName" id="foodName" value={food.foodName}
                   onChange={handleChange} autoComplete="name"/>
          </FormGroup>
          <FormGroup>
            <Label for="kcal">kcal</Label>
            <Input type="number" name="kcal" id="kcal" value={food.kcal || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="protein">Protein (g)</Label>
            <Input type="number" name="protein" id="protein" value={food.protein || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="fat">Fat (g)</Label>
            <Input type="number" name="fat" id="fat" value={food.fat || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="carbohydrates">Carbohydrates (g)</Label>
            <Input type="number" name="carbohydrates" id="carbohydrates" value={food.carbohydrates || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/fitness/food">Cancel</Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  )

};

export default FoodEdit;