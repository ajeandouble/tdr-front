import React, { useEffect, useState } from 'react';
import Likes from './Likes';
import Matches from './Matches';
import Card from './Card';
import keys from '../config/keys';
const { server_url } = keys;
import getAge from "get-age";

function Loading() {
  return (
   <div className="user-profile"  >
      <article className="user-profile__article">
        <div className="loading-card">
          <svg className="loading-card__animation" version="1.1" id="L5" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 100 100" enable-background="new 0 0 0 0" xmlSpace="preserve">
            <circle fill="orange" stroke="none" cx="6" cy="50" r="6">
                <animateTransform 
                  attributeName="transform" 
                  dur="1s" 
                  type="translate" 
                  values="0 15 ; 0 -15; 0 15" 
                  repeatCount="indefinite" 
                  begin="0.1"/>
            </circle>
            <circle fill="orange" stroke="none" cx="30" cy="50" r="6">
                <animateTransform 
                  attributeName="transform" 
                  dur="1s" 
                  type="translate" 
                  values="0 10 ; 0 -10; 0 10" 
                  repeatCount="indefinite" 
                  begin="0.2"/>
            </circle>
            <circle fill="orange" stroke="none" cx="54" cy="50" r="6">
                <animateTransform 
                  attributeName="transform" 
                  dur="1s" 
                  type="translate" 
                  values="0 5 ; 0 -5; 0 5" 
                  repeatCount="indefinite" 
                  begin="0.3"/>
            </circle>
          </svg>
        </div>
      </article>
    </div>
  );
}

function NoProfilesLeft({ msg }) {
  return (
    <div className="user-profile"  >
      <article className="user-profile__article no-profiles">
        No profiles left
      </article>
    </div>
  );
}
function Deck({ deck, setDeck}) {
    console.log(Deck.name)
    const [likes, setLikes] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

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
              if (response.status !== 201 && response.status !== 204) {
                throw Error('Can\'t get deck');
              }
              return response.json();
            })
            .then(responseJSON => {
              if (responseJSON.success === false) {
                throw Error(JSON.stringify(responseJSON.message));
              }
              console.log(responseJSON.message);
              const { data } = responseJSON;
              const newDeck = data.map(user_infos => { return {profile: user_infos, liked: false } });
              console.log(data, newDeck);
              setDeck(newDeck);
              setLoading(false);
            })
            .catch(error => {
              console.log(error);
            });


    }
    , []);
    return (
        <>
          {deck[0] ?
          <>
            <Card user={deck[0]} deck={deck} setDeck={setDeck} />
            {deck[1] ?
                <div className="user-profile"  >
                  <article className="user-profile__article zIndex1"
                    style={{ backgroundImage: `url(${deck[1].profile.pics[0]})` }}
                  >
                    <h4 className="user-profile__display-name">{deck[1].profile.displayName}</h4>
                    <h4 className="user-profile__age">{getAge(deck[1].profile.birthDate)}</h4>
                    <p className="user-profile__bio">{deck[1].profile.bio}</p>
                    <br />
                  </article>
                </div>
              : <div className="user-profile" >
                  <article className="user-profile__article zIndex1">
                  </article>
                </div>
            }
          </>
            : <>{false? <Loading /> : <NoProfilesLeft />}</>
          }
        </>
    )
}

export default Deck;