import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom'; 
import Deck from './Deck';
import MatchesList from './Matches';
import Chat from './Chat';
import keys from '../config/keys';
import Loading from './Loading';
import getAge from 'get-age';
const { websocket_url, server_url } = keys;

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
    <div className="register-active-user__container">
      <form className="register">
        <label>
          <label className="register__display-name__label">Name:</label>
          <input className="register__display-name__input" type="text" onChange={handleChange} name="displayName" className="register__display-name__input" />
          <input className="register__date" type="date" onChange={handleChange} name="birthDate" />
          <select className="register__gender__select" name="gender" value={state.gender} onChange={handleChange}>
            <option name="gender" value="Male">Male</option>
            <option name="gender" value="Female">Female</option>
          </select>
          <label className="register__interest">Interrests:</label>
          <select className="register__interest__select" name="interest" value={state.interests} onChange={handleChange}>
            <option name="interest" value="Male">Male</option>
            <option name="interest" value="Female">Female</option>
          </select>
          <label className="register__bio__label">Bio:</label>
          <input className="register__bio__input" type="text" onChange={handleChange} name="bio" />
          <button className="register__button button--submit" value="submit" onClick={(e) => { e.preventDefault(); handleSubmit(e)}}>
            Submit
          </button>
        </label>
      </form>
    </div>
  )
}

function ActiveUserProfile({ activeUserInfo }) {
  let profilePic = activeUserInfo.pics && activeUserInfo.pics.__proto__ === Array.prototype
    && activeUserInfo.pics[0] ? activeUserInfo.pics[0] : null;

  const { displayName, birthDate, bio } = activeUserInfo;

  return (
    <React.Fragment>
      <div>
        <a className="button--logout dashboard__logout" href={`${server_url}/auth/logout`}>Logout</a>
      </div>
      <div className="user-profile">
        <article className="user-profile__article">
          <img className="user-profile__img" src={profilePic}  />
          <h4 className="user-profile__display-name">{displayName}</h4>
          <h4 className="user-profile__age">{getAge(birthDate)}</h4>
          <hr />
          <p className="user-profile__bio">{bio}</p>
        </article>
      </div>
    </React.Fragment>
    );
}

const Dashboard = () => {
  // Deck hooks
  const [deck, setDeck] = useState([]);
  // Profile hooks
  const [activeUserProfile, setActiveUserProfile] = useState(undefined)
  const [registered, setRegistered] = useState(undefined);

  // matches
  const [matches, setMatches] = useState(undefined);

  // messaging
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(new Map());
  const [input, setInput] = useState({});
  const [readMessages, setReadMessages] = useState({});

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
              console.log(responseJSON.message);
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
    , [deck]);

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
        const newSocket = new WebSocket(`${websocket_url}`); 
        setSocket(newSocket);

        newSocket.addEventListener('message', function (event) {
          const data = JSON.parse(event.data);
          console.log('Message from server ', data);

          setMessages(messages => {
            const messagesFrom = messages.get(data.from);
            const newMessages = new Map(messages); //
              if (!messagesFrom) newMessages.set(data.from, [{type: 'received', message: data.message}]);
              else  newMessages.set(data.from, [...messagesFrom, {type: 'received', message: data.message}]);
            
            return newMessages
          });

          setReadMessages(readMessages => {
            const user_id = data.from;
            const newReadMessages = Object.assign({}, readMessages);
            console.log('newReadMessages=', newReadMessages, user_id);
            if (!newReadMessages[user_id]) {
              newReadMessages[user_id] = 1;
            }
            else {
              newReadMessages[user_id]++;
              console.log('i++')
            }
            return newReadMessages;
          });
        });
      }

    }, []);
  
    return (
      <Router>
        <header>
        </header>
        <main className="dashboard__main">
            {activeUserProfile ?
              <React.Fragment>
                <Route path="/dashboard/profile">
                  <div className="dashboard__left-pan">
                    <div className="dashboard__left-pan__top">
                      <Link className="dashboard__left-pan__top__link" to="/dashboard/deck">Deck</Link>
                    </div>
                  </div>
                  <div className="dashboard__right-pan">
                    <ActiveUserProfile activeUserInfo={activeUserProfile} />
                  </div>
                </Route>

                <Route path="/dashboard/matches/:id?">
                  <div className="dashboard__left-pan">
                    <div className="dashboard__left-pan__top">
                      <Link className="dashboard__left-pan__top__link" to="/dashboard/profile">Profile</Link>
                      <Link className="dashboard__left-pan__top__link" to="/dashboard/deck">Deck</Link>
                    </div>
                  <MatchesList matches={matches} messages={messages} readMessages={readMessages} setReadMessages={setReadMessages} />
                  </div>
                  <div className="dashboard__right-pan">
                    {matches ? 
                      <Chat
                        matches={matches}
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        setMessages={setMessages}
                        sendMessage={sendMessage}
                        readMessages={readMessages}
                        setReadMessages={setReadMessages}
                      />
                      : <Loading />}
                    </div>
                </Route>


                <Route exact path={["/dashboard/deck", "/dashboard"]} >
                  <div className="dashboard__left-pan">
                    <div className="dashboard__left-pan__top">
                      <Link className="dashboard__left-pan__top__link" to="/dashboard/profile">Profile</Link>
                    </div>
                    <MatchesList matches={matches} messages={messages} readMessages={readMessages} setReadMessages={setReadMessages} />
                  </div>
                  <div className="dashboard__right-pan">
                    <Deck deck={deck} setDeck={setDeck} />
                  </div>
                </Route>
              </React.Fragment>  :
              registered === undefined ? <Loading /> : null}
            {registered === false ? <RegisterActiveUserProfile setRegistered={setRegistered} /> : null}
        </main>       
    </Router>)
}

export default Dashboard;