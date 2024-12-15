import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from './Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

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
          <Button size="sm" color="primary" tag={Link} to={"/fitness/food/" + food.id}><FontAwesomeIcon icon={faEdit}/></Button>
          <Button size="sm" color="danger" onClick={() => remove(food.id)}><FontAwesomeIcon icon={faTrash}/></Button>
        </ButtonGroup>
      </td>
    </tr>
  });

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

  return (
    <div>
      <AppNavbar/>
      <div style={styles.container}>
        <div className="float-end">
          <Button color="success" tag={Link} to="/fitness/food/new">Add Food</Button>
        </div>
        <h3 style={styles.header}>Foods</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>Name</th>
            <th>Kcal</th>
            <th>Protein (g)</th>
            <th>Fat (g)</th>
            <th>Carbohydrates (g)</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {foodList}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default FoodList;