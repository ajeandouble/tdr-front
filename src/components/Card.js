import React, { useState, useEffect } from 'react';
import keys from '../config/keys';
import getAge from 'get-age';
const { server_url } = keys;

const Card = ({user, deck, setDeck }) => {
    console.log(Card.name)
  
    const submitLike = (user_id) => {
      fetch(`${server_url}/api/sendLike`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({user_id: user_id})
      })
        .then(response => {
          if (response.status !== 201 && response.status !== 401) {
            throw Error('Can\'t save like');
          }
          return response.json();
        })
        .then(responseJSON => {
          if (responseJSON.success === false) {
            console.log(responseJSON);
            throw new Error(responseJSON.message);
          }
          console.log(deck);
          const newDeck = [...deck];
          const index = newDeck.findIndex((user) => user.profile.user_id === user_id);
          newDeck.splice(index, 1);
          console.log(newDeck);
          setDeck(newDeck);
          console.log(responseJSON);
        })
        .catch(error => {
          console.log(error);
        });
    };
  
  let profilePic = user.profile.pics && user.profile.pics.__proto__ === Array.prototype
    && user.profile.pics[0] ? user.profile.pics[0] : null;
   const { displayName, birthDate, bio } = user.profile;
  
    return (
    <React.Fragment>
      <div className="user-profile">
        <article className="user-profile__article">
          <img className="user-profile__img" src={profilePic}  />
          <h4 className="user-profile__display-name">{displayName}</h4>
          <h4 className="user-profile__age">{getAge(birthDate)}</h4>
          <hr />
          <p className="user-profile__bio">{bio}</p>
          <br /> {/* TODO: Replace by setting <p> as display: block? */}
          <button class='card--like' onClick={() => submitLike(user.profile.user_id)}>Like</button>
        </article>
      </div>
    </React.Fragment>
    );
  }

export default Card;