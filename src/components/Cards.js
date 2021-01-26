import React, { useState, useEffect } from 'react';
import keys from '../config/keys';
const { server_url } = keys;

const Cards = (props) => {
    console.log(Cards.name)
    const { deck, setDeck} = props;
  
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
          newDeck[index].liked = true;
          console.log(newDeck);
          setDeck(newDeck);
          console.log(newDeck === deck);
          console.log(responseJSON);
        })
        .catch(error => {
          console.log(error);
        });
    };
  
  
    return (
      <>
      <h3>Deck:</h3>
      {deck && deck[0] ? 
        deck.map((user) =>
        <div class={`card ${user.liked ? 'liked' : ''}`}>
          <span>{JSON.stringify(user)}</span>
          <div>{user.profile.pics[0]}</div>
          <div>{user.profile.displayName}</div>  
          <div>{user.profile.birthDate}</div>
          <div>{user.profile.user_id}</div>
          <button class='card--like' onClick={() => submitLike(user.profile.user_id)}>Like</button>
          <br />---
        </div>)
        :
        <p>No profiles available</p>
      }
      </>
    )
  }

export default Cards;