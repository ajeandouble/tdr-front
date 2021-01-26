import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Login from  './components/Login';
import Dashboard from './components/Dashboard';
import keys from './config/keys'
const { server_url } = keys

function App() {
  console.log(App.name, server_url);
  console.log(process.env);
  const [authentication, setAuthentication] = useState(undefined);

  useEffect(() => {
    if (authentication !== undefined) return ;
    fetch(`${server_url}/auth/login/success`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200)
          return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        if (responseJson.success) {
          setAuthentication({ authenticated: true, response: responseJson })
        }
        console.log(responseJson);  
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  console.log(document.cookie)
  return (
    <div className="App">
      {authentication === undefined ?
        <Login />: <Dashboard />
      }
    </div>
  );
}

export default App;
