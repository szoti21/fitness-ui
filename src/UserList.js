import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from './Utils';
import { parse, format } from 'date-fns';

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchWithAuth('/fitness/users')
      .then(response => response.json())
             .then(data => {
               setUsers(data);
               setLoading(false);
             })
  }, []);

  const remove = async (id) => {
    await fetchWithAuth(`/fitness/users/${id}`, {
      method: 'DELETE'
    }).then(() => {
      let updatedUsers = [...users].filter(i => i.id !== id);
      setUsers(updatedUsers);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const displayDate = (date) => {
    const parsedDate = new Date(date);
    return format(parsedDate, 'yyyy-MM-dd');
  }

  const userList = users.map(user => {
    return <tr key={user.id}>
      <td style={{whiteSpace: 'nowrap'}}>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.emailAddress}</td>
      <td>{displayDate(user.birthDate)}</td>
      <td>{user.phone}</td>
      <td>{user.role.roleName}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={"/fitness/users/" + user.id}>Edit</Button>
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
          <Button color="success" tag={Link} to="/fitness/users/new">Add User</Button>
        </div>
        <h3>MY USERS</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email Address</th>
            <th>Birth Date</th>
            <th>Phone</th>
            <th>Role</th>
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