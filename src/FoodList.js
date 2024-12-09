import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from './Utils';

const FoodList = () => {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

 fetchWithAuth('/fitness/food', {
       method: 'GET'
      })
      .then(response => response.json())
             .then(data => {
               setFoods(data);
               setLoading(false);
             }).catch((error) => {
                       console.error("Error fetching token:", error);
                     });
  }, []);

  const remove = async (id) => {
    const token = sessionStorage.getItem("authToken");
    await fetchWithAuth(`/fitness/food/${id}`, {
      method: 'DELETE'
    }).then(() => {
      let updatedFoods = [...foods].filter(i => i.id !== id);
      setFoods(updatedFoods);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const foodList = foods.map(food => {
    return <tr key={food.id}>
      <td style={{whiteSpace: 'nowrap'}}>{food.foodName}</td>
      <td>{food.kcal}</td>
      <td>{food.protein}</td>
      <td>{food.fat}</td>
      <td>{food.carbohydrates}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={"/fitness/food/" + food.id}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => remove(food.id)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  });

  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <div className="float-end">
          <Button color="success" tag={Link} to="/fitness/food/new">Add Food</Button>
        </div>
        <h3>Foods</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>Name</th>
            <th>Kcal</th>
            <th>Protein</th>
            <th>Fat</th>
            <th>Carbohydrates</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {foodList}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default FoodList;