import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom'; 
import Deck from './Deck';
import MatchesList from './Matches';
import Profile from './Profile';
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
  // Profile hooks
  const [activeUserProfile, setActiveUserProfile] = useState(undefined)
  const [registered, setRegistered] = useState(undefined);

  // matches
  const [matches, setMatches] = useState(undefined);

  // messaging
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(new Map());
  const [input, setInput] = useState({});

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

    useEffect(() => {
      console.log('fetching matches...')
        fetch(`${server_url}/api/getMatches`, {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
            .then(response => {
              if (response.status !== 201 && response.status !== 401) {
                throw Error('Can\'t get matches');
              }
              return response.json();
            })
            .then(responseJSON => {
              if (responseJSON.success === false) {
                throw Error(responseJSON.message)
              }
              const { data } = responseJSON;
              const newInput = {}
              console.log(data)
              for (const i in data) {
                newInput[data[i].user_id] = '';
              }
              console.log(newInput)
              setInput(newInput);
              setMatches(data);
            })
            .catch(error => {
              console.log(error);
            });
    }
    , []);

    function sendMessage( event, match) {
      event.preventDefault();
  
      const message = input[match.user_id]
      if (!message.length)
        return ;
      const payload ={message: message, destination: match.user_id}
      if (socket) {
        socket.send(JSON.stringify(payload));
        const newMessages = new Map(messages);
        if (!newMessages.get(match.user_id)) {
          newMessages.set(match.user_id, [{type: 'sent', message: message}])
        }
        else {
          const messagesFrom = newMessages.get(match.user_id);
          newMessages.set(match.user_id, [...messagesFrom, {type: 'sent', message: message}]);
        }
        setMessages(messages => newMessages);
      }
    }

    useEffect(() => {
      if (!socket) {
        const newSocket = new WebSocket('ws://localhost:8080'); 
        setSocket(newSocket);

        newSocket.addEventListener('message', function (event) {
          const data = JSON.parse(event.data);
          console.log('Message from server ', data);

          setMessages(messages => {
            const messagesFrom = messages.get(data.from);
            const newMessages = new Map(messages); //
              if (!messagesFrom) newMessages.set(data.from, [{type: 'received', message: data.message}]);
              else  newMessages.set(data.from, [...messagesFrom, {type: 'received', message: data.message}]);
            console.log(newMessages)
            return newMessages
          });
        });
      }

    }, []);
  
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

                <Route path="/dashboard/matches/:id?">
                  <div className="dashboard__left-pan">
                    <Link to="/dashboard/profile">Profile</Link>
                    <Link to="/dashboard/deck">Deck</Link>
                    <MatchesList matches={matches} messages={messages} />
                    {/* <Profile /> */}
                  </div>
                  <div className="dashboard__right-pan">
                    {matches ? 
                      <Profile matches={matches} messages={messages} input={input} setInput={setInput} setMessages={setMessages} sendMessage={sendMessage}/>
                      : <Loading />}
                    </div>
                  <span>/matches/:id?</span>
                </Route>


                <Route exact path={["/dashboard/deck", "/dashboard"]} >
                  <div className="dashboard__left-pan">
                    <Link to="/dashboard/profile">Profile</Link>
                    <MatchesList matches={matches} messages={messages} />
                  </div>
                  <div className="dashboard__right-pan">
                    <Deck />
                  </div>
                  <span>/deck</span>
                </Route>
                

              </React.Fragment>  :
              registered === undefined ? <Loading /> : null}
            {registered === false ? <RegisterActiveUserProfile setRegistered={setRegistered} /> : null}
        </main>       
    </Router>)
}

export default Dashboard;