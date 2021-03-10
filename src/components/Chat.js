import getAge from "get-age";
import React from "react";
import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";

export default function Chat({
  matches,
  messages,
  input,
  setInput,
  setMessages,
  sendMessage,
  readMessages,
  setReadMessages,
}) {
  const messagesBox = useRef();
  console.log(Chat.name);
  const { id } = useParams();
  const match = matches ? matches.find((m) => m.user_id == id) : undefined;
  console.log(
    matches
      ? matches.find((m) => {
          console.log(m);
          return true;
        })
      : "not yet"
  );
  console.log("matches=", matches);
  console.log("id=", id, "match=", match);

  const profilePic =
    match.pics && match.pics.__proto__ === Array.prototype && match.pics[0]
      ? match.pics[0]
      : null;
  const { displayName, birthDate, bio } = match;

  function handleInput(event, user_id) {
    const newInput = Object.assign({}, input);
    newInput[user_id] = event.target.value;
    setInput(newInput);
    console.log(event.target.value, user_id);
  }

  function clearInput(event, user_id) {
    const newInput = Object.assign({}, input);
    newInput[user_id] = '';
    setInput(newInput);
    console.log(event.target.value, user_id);
  }

  useEffect(() => {
    if (readMessages[match.user_id]) {
      setReadMessages(readMessages => {
        const newReadMessages = Object.assign({}, readMessages);
        newReadMessages[match.user_id] = 0;

        console.log(match.user_id, 'new message or switch id', readMessages, newReadMessages);

        return newReadMessages;
      });
    }
  }, [readMessages, id]);


  return (
    <React.Fragment>
      {match === undefined ? (
        <span>Match doesn&apost exist</span>
      ) : (
        <>
          <div className="chat__left">
            <div className="chat-box__messages" ref={messagesBox}>
            {messages.get(match.user_id) ? (
                messages.get(match.user_id).map((value) => (
                  <div className={`message ${value.type}`}>
                    <span className={`message ${value.type}__span`}>
                      {value.message}
                    </span>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
            <div className="chat__left__bottom">
              <textarea
                autoFocus
                className="chat-box__input"
                value={input[match.user_id]}
                placeholder={'What\'s on your mind...'}
                onChange={(event) => handleInput(event, match.user_id)}
                onKeyDown={(event) => { if(event.keyCode === 13) { sendMessage(event, match); clearInput(event, match.user_id); }}}
              ></textarea>
              <button
                className="chat-box__submit button--submit"
                onClick={(event) => { sendMessage(event, match); clearInput(event, match.user_id); }}
              >
                Send
              </button>
            </div>
          </div>

          <div className="chat__right">
            <img className="chat-profile__img" src={profilePic} />
            <h4 className="chat-profile__display-name">{displayName}</h4>
            <h4 className="chat-profile__age">{getAge(birthDate)}</h4>
            <p className="chat-profile__bio">{bio}</p>
          </div>
        </>
      )}
    </React.Fragment>
  );
}
