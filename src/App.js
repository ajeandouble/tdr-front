import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Login from  './components/Login';
import Dashboard from './components/Dashboard';
import keys from './config/keys'
import { PrivateRoute } from './config/auth'

const { server_url } = keys

function NotFound() {
  return (
    <div className="notFound">
      <p className="notFound__p">Not found</p>
    </div>
  )
}

function Home() {
  return (
    <div className="home">
      <h1 className="home__title">Node/ReactJS Dating App</h1>
      <Link to="/login"><button className="home__login__button">Login</button></Link>
    </div>
  )
}

function App() {
  console.log(App.name, server_url);
  console.log(process.env);

  useEffect(async () => {
      console.log(App.name, 'useEffect')
  }, []);

  console.log(document.cookie)
  return (
    <div className="App">
      <Router>
        <Route exact={true} path="/"><Home /></Route>
        <Route path="/login"><Login /></Route>
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route path="/404"><NotFound /></Route>
      </Router>
    </div>
  );
}

export default App;
