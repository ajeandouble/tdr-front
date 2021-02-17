import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'; 
import Deck from './Deck';
import Matches from './Matches'
import keys from '../config/keys';
import Loading from './Loading';
const { server_url } = keys;

const RegisterActiveUserProfile = (props) => {
  const [state, setState] = useState({
    displayName: '',
    birthDate: '',
    gender: 'Male',
    interest: 'Female',
    bio: '',
    pics: [],
  })
  const handleChange = (e) => {
    setState({...state, [e.target.name]: e.target.value});
    switch (e.target.name) {
    }
    console.log(e.target.name, e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = JSON.stringify(state);
    console.log('submitting')
    fetch(`${server_url}/api/setActiveUserProfile`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: formData,
      })
        .then(response => {
          if (response.status !== 201) {
            throw Error('Can\'t save active user profile');
          }
          return response.json();
        })
        .then(responseJSON => {
          console.log(responseJSON);
          props.setRegistered(true);
        })
        .catch(error => {
          console.log(error);
        });

  }
  return (
    <form className="registerProfile">
      <label>
        <input type="text" onChange={handleChange} name="displayName" />
        <input type="date" onChange={handleChange} name="birthDate" />
        <select name="gender" value={state.gender} onChange={handleChange}>
          <option name="gender" value="Male">Male</option>
          <option name="gender" value="Female">Female</option>
        </select>
        <select name="interest" value={state.interests} onChange={handleChange}>
          <option name="interest" value="Male">Male</option>
          <option name="interest" value="Female">Female</option>
        </select>
        <input type="text" onChange={handleChange} name="bio" />
        <button value="submit" onClick={(e) => { e.preventDefault(); handleSubmit(e)}} />
        {state.gender}, born {state.birthDate} interested in {state.interests}
      </label>
    </form>
  )
}

const ShowActiveUserProfille = (props) => {
  return (
    <div className="profileInfo">
      {JSON.stringify(props.activeUserInfo)}
    </div>);
}

const Dashboard = () => {
  const [activeUserProfile, setActiveUserProfile] = useState(undefined)
  const [registered, setRegistered] = useState(undefined);

    useEffect(() => {
      fetch(`${server_url}/api/userInfo`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      })
        .then(response => {
          if (response.status === 200) {
            return response.json()
          }
          else if (response.status === 404) {
            setRegistered(false);
            throw Error('User profile has not been filled.');
          }
        })
        .then(responseJSON => {
          setActiveUserProfile(responseJSON.data);
        })
        .catch(error => {
          console.log(error);
        });
    }, [registered]);

    return (
      <Router>
        <header>
        <div>
            <a className="button--logout dashboard__logout" href={`${server_url}/auth/logout`}>Logout</a>
        </div>
        </header>
        <main className="dashboard__main">
            {activeUserProfile ?
              <React.Fragment>
                <Route path="/dashboard/profile">
                  <div className="dashboard__left-pan">
                    <Link to="/dashboard/deck">Deck</Link>
                  </div>
                  <div className="dashboard__right-pan">
                    <ShowActiveUserProfille activeUserInfo={activeUserProfile} />
                  </div>
                </Route>

                <Route path="/dashboard/matches">
                  <div className="dashboard__left-pan">
                    <Link to="/dashboard/deck">Deck</Link>
                    <Matches />
                    Aaa
                  </div>
                </Route>


                <Route path="/dashboard/deck">
                  <div className="dashboard__left-pan">
                    <Link to="/dashboard/profile">Profile</Link>
                    <Matches />
                  </div>
                  <div className="dashboard__right-pan">
                    <Deck />
                  </div>
                </Route>
                {/* TODO: Redundant? */}
                <Route exact path="/dashboard">
                  <div className="dashboard__left-pan">
                    <Link to="/dashboard/profile">Profile</Link>
                    <Matches />
                  </div>
                  <div className="dashboard__right-pan">
                    <Deck />
                  </div>
                  WHAT
                </Route>

              </React.Fragment>  :
              registered === undefined ? <Loading /> : null}
            {registered === false ? <RegisterActiveUserProfile setRegistered={setRegistered} /> : null}
        </main>       
    </Router>)
}

export default Dashboard;