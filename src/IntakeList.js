import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchWithAuth } from './Utils';
import { parse, format } from 'date-fns';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const IntakeList = () => {

  const [intake, setIntake] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decodedId, setDecodedId] = useState(null);

  useEffect(() => {
    setLoading(true);

    const token = sessionStorage.getItem("authToken");

    setDecodedId((jwtDecode(token)).id);

    fetchWithAuth(`/fitness/users/${(jwtDecode(token)).id}/intake`)
      .then(response => response.json())
             .then(data => {
               setIntake(data);
               setLoading(false);
             })
  }, []);

  const remove = async (date) => {
    console.log(date);
    await fetchWithAuth(`/fitness/users/${decodedId}/intake/${Date.parse(date)}`, {
      method: 'DELETE'
    }).then(() => {
      let updatedIntake = [...intake].filter(i => i.date !== date);
      setIntake(updatedIntake);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const displayDate = (date) => {
    const parsedDate = new Date(date);
    return format(parsedDate, 'yyyy-MM-dd');
  }

  const intakeList = intake.map(intake => {
    return <tr key={intake.date, intake.userId}>
      <td style={{whiteSpace: 'nowrap'}}>{displayDate(intake.date)}</td>
      <td>{intake.food.foodName}</td>
      <td>{intake.quantity}</td>
      <td>{intake.food.kcal/100*intake.quantity}</td>
      <td>{intake.food.protein/100*intake.quantity}</td>
      <td>{intake.food.fat/100*intake.quantity}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={`/fitness/users/${decodedId}/intake/` + Date.parse(intake.date)}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => remove(intake.date)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  });

const data = {
  labels: intake.map((item) => displayDate(item.date)),
  datasets: [
    {
      label: "Kcal",
      data: intake.map((item) => item.food.kcal/100*item.quantity),
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(12,32,42,1)"
    },
    {
      label: "Protein",
      data: intake.map((item) => item.food.protein/100*item.quantity),
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(12,192,12,1)"
    },
    {
      label: "fat",
      data: intake.map((item) => item.food.fat/100*item.quantity),
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(192,32,42,1)"
    }
  ]
};

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hides the legend
    },
  };

  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <div className="float-end">
          <Button color="success" tag={Link} to={`/fitness/users/${decodedId}/intake/new`}>Add Data</Button>
        </div>
        <h3>My Intake</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>Date</th>
            <th>FoodId</th>
            <th>Quantity(gram)</th>
            <th>kcal</th>
            <th>protein</th>
            <th>fat</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {intakeList}
          </tbody>
        </Table>
        <Line data={data}/>
      </Container>
    </div>
  );
};

export default IntakeList;