import getAge from 'get-age';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function Chat({ matches, messages, input, setInput, setMessages, sendMessage}) {
    console.log(Chat.name)
    const { id } = useParams()
    const match = matches ? matches.find(m => m.user_id == id) : undefined;
    console.log(matches ? matches.find(m => {console.log(m); return true }) : 'not yet')
    console.log('matches=', matches)
    console.log('id=', id, 'match=', match);

    const profilePic = match.pics && match.pics.__proto__ === Array.prototype
      && match.pics[0] ? match.pics[0] : null;
    const { displayName, birthDate, bio } = match;

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
            <div className="chat-profile">
                <img className="chat-profile__img" src={profilePic} />
                <h4 className="chat-profile__display-name">{displayName}</h4>
                <h4 className="chat-profile__age">{getAge(birthDate)}</h4>
                <hr />
                <p className="chat-profile__bio">{bio}</p>
            </div>
            <div className="chat-box">

            <div className="chat-box__messages">
                {messages.get(match.user_id) ?
                messages.get(match.user_id).map(value => 
                    <div className={`message ${value.type}`}>{value.message}</div>
                )
                : <></>}
            </div>
                <input className="chat-box__input" value={input[match.user_id]} onChange={(event) => handleInput(event, match.user_id) }></input>
                <button className="chat-box__submit button--submit" onClick={(event) => sendMessage(event, match)}>Send</button>
            </div>
        </>
        }

        </React.Fragment>
    )
}

  