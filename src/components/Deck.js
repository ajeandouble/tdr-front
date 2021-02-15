import React, { useEffect, useState } from 'react';
import Likes from './Likes';
import Matches from './Matches';
import Cards from './Cards';
import keys from '../config/keys';
const { server_url } = keys;


const Deck = () => {
    console.log(Deck.name)
    const [deck, setDeck] = useState([]);
    const [likes, setLikes] = useState([]);
    const [matches, setMatches] = useState([]);

    console.log(deck);
    console.log(matches);

    // get Deck
    useEffect(() => {
      console.log('fetching...')
        fetch(`${server_url}/api/getDeck`, {
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
                throw Error('Can\'t get deck');
              }
              return response.json();
            })
            .then(responseJSON => {
              if (responseJSON.success === false) {
                throw Error(responseJSON.message)
              }
              const { data } = responseJSON;
              const newDeck = data.map(user_infos => { return {profile: user_infos, liked: false } });
              console.log(data, newDeck);
              setDeck(newDeck);
              newDeck.forEach(user => console.log(user.profile.displayName))
            })
            .catch(error => {
              console.log(error);
            });


    }
    , []);
    return (
        <>
          <Cards deck={deck} setDeck={setDeck} />
        </>
    )
}

export default Deck;