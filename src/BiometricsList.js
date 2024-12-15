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

const BiometricsList = () => {

  const [biometrics, setBiometrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decodedId, setDecodedId] = useState(null);

  useEffect(() => {
    setLoading(true);

    const token = sessionStorage.getItem("authToken");

    setDecodedId((jwtDecode(token)).id);

    fetchWithAuth(`/fitness/users/${(jwtDecode(token)).id}/biometrics`)
      .then(response => response.json())
             .then(data => {
               setBiometrics(data);
               setLoading(false);
             })
  }, []);

  const remove = async (date) => {
    await fetchWithAuth(`/fitness/users/${decodedId}/biometrics/${Date.parse(date)}`, {
      method: 'DELETE'
    }).then(() => {
      let updatedBiometrics = [...biometrics].filter(i => i.date !== date);
      setBiometrics(updatedBiometrics);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const displayDate = (date) => {
    const parsedDate = new Date(date);
    return format(parsedDate, 'yyyy-MM-dd');
  }

  const biometricsList = biometrics.map(biometric => {
    return <tr key={biometric.date}>
      <td style={{whiteSpace: 'nowrap'}}>{displayDate(biometric.date)}</td>
      <td>{biometric.height}</td>
      <td>{biometric.weight}</td>
      <td>{biometric.bodyFat}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={`/fitness/users/${decodedId}/biometrics/` + Date.parse(biometric.date)}><FontAwesomeIcon icon={faEdit}/></Button>
          <Button size="sm" color="danger" onClick={() => remove(biometric.date)}><FontAwesomeIcon icon={faTrash}/></Button>
        </ButtonGroup>
      </td>
    </tr>
  });

const weightData = {
  labels: biometrics.map((item) => displayDate(item.date)),
  datasets: [
    {
      label: "Weight (kg)",
      data: biometrics.map((item) => item.weight),
      fill: true,
      backgroundColor: "rgba(192,23,23,0.6)",
      borderColor: "rgba(192,23,23,1)"
    }
  ]
};

const bodyFatData = {
  labels: biometrics.map((item) => displayDate(item.date)),
  datasets: [
    {
      label: "Body Fat (%)",
      data: biometrics.map((item) => item.bodyFat),
      fill: true,
      backgroundColor: "rgba(192,192,23,0.6)",
      borderColor: "rgba(192,192,23,1)"
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
            <Button color="success" tag={Link} to={`/fitness/users/${decodedId}/biometrics/new`}>Add Data</Button>
          </div>
          <h3 style={styles.header}>My Biometrics</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th>Date</th>
              <th>Height (cm)</th>
              <th>Weight (kg)</th>
              <th>Body Fat (%)</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {biometricsList}
            </tbody>
          </Table>
        </div>

        <div style={styles.diagramContainer}>
          <Line data={weightData}/>
          <Line data={bodyFatData}/>
        </div>
      </div>
    </div>
  );
};

export default BiometricsList;