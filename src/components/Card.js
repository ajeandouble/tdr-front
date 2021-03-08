import React, { useState, useEffect, useRef } from "react";
import keys from "../config/keys";
import getAge from "get-age";
const { server_url } = keys;

const Card = ({ user, deck, setDeck }) => {
  console.log(Card.name);
  const articleRef = useRef();

  const submitLike = (user_id) => {
    fetch(`${server_url}/api/sendLike`, {
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
          throw Error("Can't save like");
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
      })
      .catch((error) => {
        console.log(error);
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
  }
  function startDrag({ clientX }) {
    const translation = clientX - dragCoordinates.x;

    if (Math.abs(translation) > 300)  return stopDrag(translation);

    articleRef.current.style.left = translation + 'px';
    console.log(dragCoordinates.x, 'yo accessed twice closure or wtf', clientX)
    console.log((clientX - dragCoordinates.x) + 'px');
  }
  function stopDrag(translation) {
    if (translation >= 0) {
      submitPass(user.profile.user_id);
    }
    else {
      submitLike(user.profile.user_id);
    }
    articleRef.current.style.left = '0px';
    articleRef.current.removeEventListener('mousemove', startDrag);
    articleRef.current.removeEventListener('mouseup', stopDrag);
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
              className="user-profile__like"
              onClick={() => submitLike(user.profile.user_id)}
            >
              💙
            </button>
            <button
              className="user-profile__pass"
              onClick={() => submitPass(user.profile.user_id)}
            >
              ❌
            </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Card;
