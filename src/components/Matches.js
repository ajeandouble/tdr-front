import React, { useEffect, useState } from 'react';
import keys from '../config/keys';
const { server_url } = keys;

const Matches = ({matches, setMatches, deck }) => {
  console.log(Matches.name)
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState(new Map());
    const [input, setInput] = useState({});

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

    function handleInput(event, user_id) {
      const newInput = Object.assign({}, input);
      newInput[user_id] = event.target.value;
      setInput(newInput)
      console.log(event.target.value, user_id);
    }
    return (
      <>
        <h3>Matches: </h3>
        <div className="matches">{matches.map((match) => {

            return <>
              <div className="message-box">
                {messages.get(match.user_id) ?
                  messages.get(match.user_id).map(value => 
                    <div className={`message ${value.type}`}>{value.message}</div>
                  )
                : <></>}
                <input value={input[match.user_id]} onChange={(event) => handleInput(event, match.user_id) }></input>
                {/* {JSON.stringify(messages.get(match.user_id))} */}
              </div>
              <button onClick={(event) => sendMessage(event, match)}>Test</button>
              {JSON.stringify(match)}
              </>
          })
        }</div>
      </>
    )
  }

export default Matches;