import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

const BiometricsList = () => {

  const [biometrics, setBiometrics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch('/fitness/users/1/biometrics')
      .then(response => response.json())
             .then(data => {
               setBiometrics(data);
               setLoading(false);
             })
  }, []);

  const remove = async (id) => {
    await fetch(`/fitness/users/1/biometrics`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedBiometrics = [...biometrics].filter(i => i.id !== id);
      setBiometrics(updatedBiometrics);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const biometricsList = biometrics.map(biometric => {
    return <tr key={biometric.date, biometric.userId}>
      <td style={{whiteSpace: 'nowrap'}}>{biometric.date}</td>
      <td>{biometric.userId}</td>
      <td>{biometric.height}</td>
      <td>{biometric.weight}</td>
      <td>{biometric.bodyFat}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={"/biometrics/" + biometrics.date}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => remove(biometrics.id)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  });

  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <div className="float-end">
          <Button color="success" tag={Link} to="/biometrics/new">Add Data</Button>
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
      </Container>
    </div>
  );
};

export default BiometricsList;