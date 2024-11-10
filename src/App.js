import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('fitness/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="App-intro">
              <h2>User List</h2>
              {users.map(user =>
                <tr key={user.id}>
                      <td style={{whiteSpace: 'nowrap'}}>{user.name}</td>
                      <td>{user.address}</td>
                      <td>{user.phone}</td>
                      <td>{user.id}</td>
                </tr>
              )}
            </div>
          </header>
        </div>
  );
}

export default App;
