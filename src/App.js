import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './UserList';
import UserEdit from './UserEdit';
import BiometricsList from './BiometricsList'
import FoodList from './FoodList'
import FoodEdit from './FoodEdit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path='fitness/users' exact={true} element={<UserList/>}/>
        <Route path='fitness/users/:id' element={<UserEdit/>}/>
        <Route path='fitness/users/1/biometrics' exact={true} element={<BiometricsList/>}/>
        <Route path='fitness/food' exact={true} element={<FoodList/>}/>
        <Route path='fitness/food/:id' element={<FoodEdit/>}/>

      </Routes>
    </Router>
  )
}

export default App;