import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './UserList';
import UserEdit from './UserEdit';
import BiometricsList from './BiometricsList'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path='fitness/users' exact={true} element={<UserList/>}/>
        <Route path='/users/:id' element={<UserEdit/>}/>
        <Route path='fitness/users/1/biometrics' exact={true} element={<BiometricsList/>}/>

      </Routes>
    </Router>
  )
}

export default App;