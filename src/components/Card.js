import React, { useState, useEffect, useRef } from "react";
import keys from "../config/keys";
import getAge from "get-age";
import axiosInstance from "../config/axios";

const { server_url } = keys;

function Card({ user, deck, setDeck }) {
  const [itsAMatch, setItsAMatch] = useState(false);
  console.log(Card.name);
  const articleRef = useRef();


  const submitLike = (user_id) => {
    axiosInstance.post('/api/sendLike', {user_id: user_id })  
      .then(res => {
        console.log('sendLike res=', res)
        if (res.status !== 201 || !res.data) throw new Error("Cant' save like")
        const { success, message } = res.data;
        if (!success)  throw new Error(message)
        if (message === 'Match') setItsAMatch(true);
        console.log(deck);
        const newDeck = [...deck];
        const index = newDeck.findIndex((user) => user.profile.user_id === user_id);
        newDeck.splice(index, 1);
        console.log(newDeck);
        setDeck(newDeck);
        articleRef.current.style.left = '0px';
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function submitPass(user_id) {
    fetch(`${server_url}/api/sendPass`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ user_id: user_id }),
    })
    .then((response) => {
      if (response.status !== 201 && response.status !== 401) {
        throw Error("Can't save pass");
      }
      return response.json();
    })
    .then((responseJSON) => {
      if (responseJSON.success === false) {
        console.log(responseJSON);
        throw new Error(responseJSON.message);
      }
      console.log(deck);
      const newDeck = [...deck];
      const index = newDeck.findIndex(
        (user) => user.profile.user_id === user_id
      );
      newDeck.splice(index, 1);
      console.log(newDeck);
      setDeck(newDeck);
      console.log(responseJSON);
      articleRef.current.style.left = '0px';
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const dragCoordinates = { x: undefined, y: undefined }
  function initDrag({ clientX, clientY }) {
    dragCoordinates.x = clientX;
    dragCoordinates.y = clientY;
    console.log(dragCoordinates.x, 'x')
    articleRef.current.addEventListener('mousemove', startDrag);
    articleRef.current.addEventListener('mouseup', stopDrag);
    articleRef.current.addEventListener('mouseout', stopDrag)
  }
  function startDrag({ clientX }) {
    const translation = clientX - dragCoordinates.x;

    if (Math.abs(translation) > 300)  return stopDrag(translation);

    articleRef.current.style.left = translation + 'px';
    // articleRef.current.style.transform = `rotate(${Math.floor(translation / 5)}deg)`;
    console.log(dragCoordinates.x, 'yo accessed twice closure or wtf', clientX)
    console.log((clientX - dragCoordinates.x) + 'px');
  }
  function stopDrag(translation) {
    if (translation < -300) {
      submitPass(user.profile.user_id);
    }
    else if (translation > 300) {
      submitLike(user.profile.user_id);
    }
    articleRef.current.style.left = '0px';
    articleRef.current.removeEventListener('mousemove', startDrag);
    articleRef.current.removeEventListener('mouseup', stopDrag);
    articleRef.current.removeEventListener('mouseout', stopDrag);
    dragCoordinates.x, dragCoordinates.y = 0, 0;

  }
  let profilePic =
    user.profile.pics &&
    user.profile.pics.__proto__ === Array.prototype &&
    user.profile.pics[0]
      ? user.profile.pics[0]
      : null;
  const { displayName, birthDate, bio } = user.profile;

  return (
    <React.Fragment>
      { itsAMatch ? <div className="its-a-match"><span>It's a match.</span><div className="cross" onClick={() => setItsAMatch(false)}>X</div></div> : <></> }
      <div className="user-profile zIndex5000">
        <article
          ref={articleRef}
          className="user-profile__article "
          style={{ backgroundImage: `url(${profilePic})` }}
          onMouseDown={initDrag}
        >
          <h4 className="user-profile__display-name">{displayName}</h4>
          <h4 className="user-profile__age">{getAge(birthDate)}</h4>
          <p className="user-profile__bio">{bio}</p>
          <br />
        </article>
        <div className="user-profile__buttons">
          <button
              className="user-profile__pass"
              onClick={() => submitPass(user.profile.user_id)}
            >
              ❌
            </button>
            <button
              className="user-profile__like"
              onClick={() => submitLike(user.profile.user_id)}
            >
              💙
            </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Card;
