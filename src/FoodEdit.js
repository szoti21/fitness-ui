import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

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
      fetch(`/fitness/food/${id}`)
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
      await fetch(`/fitness/food`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(food)
      });
      setFood(initialFormState);
      navigate('/fitness/food');
    } else {
      await fetch(`/fitness/food/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(food),
      });
      setFood(initialFormState);
      navigate('/fitness/food');
    }
  }

  const title = <h2>{food.id ? 'Edit Food' : 'Add Food'}</h2>;

  return (<div>
      <AppNavbar/>
      <Container>
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
            <Label for="protein">Protein</Label>
            <Input type="number" name="protein" id="protein" value={food.protein || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="fat">Fat</Label>
            <Input type="number" name="fat" id="fat" value={food.fat || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="carbohydrates">Carbohydrates</Label>
            <Input type="number" name="carbohydrates" id="carbohydrates" value={food.carbohydrates || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/fitness/food">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  )

};

export default FoodEdit;