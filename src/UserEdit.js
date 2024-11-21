import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

const UserEdit = () => {
  const initialFormState = {
    name: '',
    emailAddress: '',
    address: '',
    phone: '',
    roleId: ''
  };
  const [user, setUser] = useState(initialFormState);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id !== 'new') {
      fetch(`/fitness/users/${id}`)
        .then(response => response.json())
        .then(data => setUser(data));
    }
  }, [id, setUser]);

  const handleChange = (event) => {
    const { name, value } = event.target

    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (id == 'new'){
      await fetch(`/fitness/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      setUser(initialFormState);
      navigate('/fitness/users');
    } else {
      await fetch(`/fitness/users/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      setUser(initialFormState);
      navigate('/fitness/users');
    }
  }

  const title = <h2>{user.id ? 'Edit User' : 'Add User'}</h2>;

  return (<div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={user.name || ''}
                   onChange={handleChange} autoComplete="name"/>
          </FormGroup>
          <FormGroup>
            <Label for="emailAddress">Email Address</Label>
            <Input type="text" name="emailAddress" id="emailAddress" value={user.emailAddress || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="address">Address</Label>
            <Input type="text" name="address" id="address" value={user.address || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input type="text" name="phone" id="phone" value={user.phone || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="roleId">whatev</Label>
            <Input type="text" name="roleId" id="roleId" value={user.roleId || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/fitness/users">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  )

};

export default UserEdit;