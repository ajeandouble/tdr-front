import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Login from  './components/Login';
import Dashboard from './components/Dashboard';
import keys from './config/keys'
import { PrivateRoute } from './config/auth'

const { server_url } = keys

function Home() {
  return (
    <>
      Home:
      <Link to="/login">Login</Link>
    </>
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
      </Router>
    </div>
  );
}

export default App;
