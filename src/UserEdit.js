import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { fetchWithAuth } from './Utils';
import DatePicker from "react-datepicker";
import { jwtDecode } from 'jwt-decode';

const UserEdit = () => {
  const initialFormState = {
    name: '',
    emailAddress: '',
    birthDate: '',
    phone: '',
    role: {roleId: ''}
  };
  const [user, setUser] = useState(initialFormState);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [fromList, setFromList] = useState(false);
  const [decodedId, setDecodedId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();


  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setRole(sessionStorage.getItem("role"));

    setDecodedId((jwtDecode(token)).id);
    if (id !== 'new') {
      fetchWithAuth(`/fitness/users/${id}`)
        .then(response => response.json())
        .then(data => setUser(data));
    }

    fetchWithAuth(`/fitness/roles`)
        .then(response => response.json())
        .then(data => setRoles(data));
  }, [id, setUser]);

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })

  }

   const handleRoleChange = (e) => {
      setUser({...user, role:{roleId:e.target.value}});
   }

   const handleDateChange = (e) => {
      setUser({...user, birthDate:e});
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
      if (decodedId == user.id){
        sessionStorage.setItem("username", user.name);
      }
      if (location.state.fromList){
        navigate('/fitness/users');
      } else {
        navigate('/');
      }
    }
  }

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

  const title = <h2 style={styles.header}>{user.id ? 'Edit User' : 'Add User'}</h2>;

  return (<div>
      <AppNavbar/>
      <div style={styles.container}>
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
            <div/>
            <DatePicker selected={user.birthDate} onChange={handleDateChange} />
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input type="tel" name="phone" id="phone" value={user.phone || ''}
                   onChange={handleChange} autoComplete="address-level1"/>
          </FormGroup>
          {
          role == "admin" ? (

           <FormGroup>
            <Label for="role-dropdown">Role</Label>
              <div/>
              <select id="role-dropdown" value={user.role.roleId} onChange={handleRoleChange}>
                <option value="" disabled>Select role</option>
                {roles.map((role) => {
                    return <option key={role.roleId} value={role.roleId}>{role.roleName}</option>;
                })}
              </select>
            </FormGroup>

          ) : ( null )


          }
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to={location.state.fromList ? "/fitness/users" : "/"}>Cancel</Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  )

};

export default UserEdit;