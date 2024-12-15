import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchWithAuth } from './Utils';
import { parse, format } from 'date-fns';
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
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
    return format(parsedDate, 'yyyy-MM-dd hh:mm');
  }

  const intakeList = intake.map(intake => {
    return <tr key={intake.date}>
      <td style={{whiteSpace: 'nowrap'}}>{displayDate(intake.date)}</td>
      <td>{intake.food.foodName}</td>
      <td>{intake.quantity}</td>
      <td>{intake.food.kcal/100*intake.quantity}</td>
      <td>{intake.food.protein/100*intake.quantity}</td>
      <td>{intake.food.fat/100*intake.quantity}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={`/fitness/users/${decodedId}/intake/` + Date.parse(intake.date)}><FontAwesomeIcon icon={faEdit}/></Button>
          <Button size="sm" color="danger" onClick={() => remove(intake.date)}><FontAwesomeIcon icon={faTrash}/></Button>
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
      backgroundColor: "rgba(12,32,42,0.2)",
      borderColor: "rgba(12,32,42,1)"
    },
    {
      label: "Protein",
      data: intake.map((item) => item.food.protein/100*item.quantity),
      fill: true,
      backgroundColor: "rgba(12,192,12,0.2)",
      borderColor: "rgba(12,192,12,1)"
    },
    {
      label: "fat",
      data: intake.map((item) => item.food.fat/100*item.quantity),
      fill: true,
      backgroundColor: "rgba(192,32,42,0.2)",
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

  const styles = {
      header: {
          textAlign: 'center',
      },
      parentContainer: {
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '20px',
          flexWrap: 'wrap',
      },
      dataContainer: {
          flex: 1,
          maxWidth: '800px',
          margin: '2rem 0',
          padding: '1rem',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      diagramContainer: {
          flex: 1,
          maxWidth: '700px',
          margin: '2rem 0',
          padding: '6rem 1rem 1rem 1rem',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
  };

  return (
    <div>
      <AppNavbar/>
      <div style={styles.parentContainer}>
        <div style={styles.dataContainer}>
          <div className="float-end">
            <Button color="success" tag={Link} to={`/fitness/users/${decodedId}/intake/new`}>Add Data</Button>
          </div>
          <h3 style={styles.header}>My Intake</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th>Date</th>
              <th>Food</th>
              <th>Quantity (g)</th>
              <th>kcal</th>
              <th>protein (g)</th>
              <th>fat (g)</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {intakeList}
            </tbody>
          </Table>
        </div>
        <div style={styles.diagramContainer}>
          <Line data={data}/>
        </div>
      </div>
    </div>
  );
};

export default IntakeList;