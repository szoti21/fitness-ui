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
    return <tr key={biometric.date, biometric.userId}>
      <td style={{whiteSpace: 'nowrap'}}>{displayDate(biometric.date)}</td>
      <td>{biometric.userId}</td>
      <td>{biometric.height}</td>
      <td>{biometric.weight}</td>
      <td>{biometric.bodyFat}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={`/fitness/users/${decodedId}/biometrics/` + Date.parse(biometric.date)}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => remove(biometric.date)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  });

const data = {
  labels: biometrics.map((item) => displayDate(item.date)),
  datasets: [
    {
      label: "Weight (kg)",
      data: biometrics.map((item) => item.weight),
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
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
          <Button color="success" tag={Link} to={`/fitness/users/${decodedId}/biometrics/new`}>Add Data</Button>
        </div>
        <h3>MY BIOMETRICS</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>DATE</th>
            <th>ID</th>
            <th>HEIGHT</th>
            <th>WEIGHT</th>
            <th>BODY FAT</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {biometricsList}
          </tbody>
        </Table>
        <Line data={data}/>
      </Container>
    </div>
  );
};

export default BiometricsList;