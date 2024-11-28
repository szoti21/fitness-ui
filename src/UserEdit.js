import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { fetchWithAuth } from './Utils';

const UserEdit = () => {
  const initialFormState = {
    name: '',
    emailAddress: '',
    birthDate: '',
    phone: '',
    roleId: ''
  };
  const [user, setUser] = useState(initialFormState);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id !== 'new') {
      fetchWithAuth(`/fitness/users/${id}`)
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
      await fetchWithAuth(`/fitness/users`, {
        method: 'POST',
        body: JSON.stringify(user)
      });
      setUser(initialFormState);
      navigate('/fitness/users');
    } else {
      await fetchWithAuth(`/fitness/users/${id}`, {
        method: 'PUT',
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
            <Input type="email" name="emailAddress" id="emailAddress" value={user.emailAddress || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="birthDate">Birth Date</Label>
            <Input type="date" name="birthDate" id="birthDate" value={user.birthDate || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input type="tel" name="phone" id="phone" value={user.phone || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="roleId">Role</Label>
            <Input type="number" name="roleId" id="roleId" value={user.roleId || ''}
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