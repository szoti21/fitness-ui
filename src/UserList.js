import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch('/fitness/users')
      .then(response => response.json())
             .then(data => {
               setUsers(data);
               setLoading(false);
             })
  }, []);

  const remove = async (id) => {
    await fetch(`/fitness/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedUsers = [...users].filter(i => i.id !== id);
      setUsers(updatedUsers);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const userList = users.map(user => {
    return <tr key={user.id}>
      <td style={{whiteSpace: 'nowrap'}}>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.emailAddress}</td>
      <td>{user.address}</td>
      <td>{user.phone}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={"/users/" + user.id}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => remove(user.id)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  });

  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <div className="float-end">
          <Button color="success" tag={Link} to="/users/new">Add User</Button>
        </div>
        <h3>MY USERS</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL ADDRESS</th>
            <th>ADDRESS</th>
            <th>PHONE</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {userList}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default UserList;