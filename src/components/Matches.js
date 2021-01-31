import React, { useEffect, useState } from 'react';
import keys from '../config/keys';
const { server_url } = keys;

const Matches = ({matches, setMatches, deck }) => {
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      if (!socket) {
        const newSocket = new WebSocket('ws://localhost:8080'); 
        setSocket(newSocket);
      }
      }, []);

    useEffect(() => {
      console.log('fetching...')
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
              console.log(data)
              setMatches(data);
            })
            .catch(error => {
              console.log(error);
            });
    }
    , [deck]);

    function sendMessage( event, match) {
      event.preventDefault();
      if (socket) {
        socket.send(`Send blablabla to ${match.user_id}`);
      }
    }

    return (
      <>
        <h3>Matches: </h3>
        <div className="matches">{matches.map((match) => {
      
            return <>
              <button onClick={(event) => sendMessage(event, match)}>Test</button>
              {JSON.stringify(match)}
              </>
          })
        }</div>
      </>
    )
  }

export default Matches;