import React from 'react';
import { useParams } from 'react-router-dom';

export default function Profile({ matches, messages, input, setInput, setMessages, sendMessage}) {
    console.log(Profile.name)
    const { id } = useParams()
    const match = matches ? matches.find(m => m.user_id == id) : undefined;
    console.log(matches ? matches.find(m => {console.log(m); return true }) : 'not yet')
    console.log('matches=', matches)
    console.log('id=', id, 'match=', match);

    function handleInput(event, user_id) {
      const newInput = Object.assign({}, input);
      newInput[user_id] = event.target.value;
      setInput(newInput)
      console.log(event.target.value, user_id);
    }
  
    return (

        <React.Fragment>
        { match === undefined ? <span>Match doesn't exist</span> :
        <>
            <span>ID={id}</span>
                <div className="messages__profile">

                </div>
            <div className="message-box">
                {messages.get(match.user_id) ?
                messages.get(match.user_id).map(value => 
                    <div className={`message ${value.type}`}>{value.message}</div>
                )
                : <></>}
                <input value={input[match.user_id]} onChange={(event) => handleInput(event, match.user_id) }></input>
                {JSON.stringify(messages.get(match.user_id))}
            </div>
            <button onClick={(event) => sendMessage(event, match)}>Test</button>
            {JSON.stringify(match)}
        </>
        }

        </React.Fragment>
    )
}

  