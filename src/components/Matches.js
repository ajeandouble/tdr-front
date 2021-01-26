import React, { useEffect, useState } from 'react';
import keys from '../config/keys';
const { server_url } = keys;

const Matches = ({matches, setMatches, deck }) => {

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
              console.log(data)
              setMatches(data);
            })
            .catch(error => {
              console.log(error);
            });
      console.log('deck updated')
    }
    , [deck]);
  
    return (
      <>
        <h3>Matches: </h3>
        <div className="matches">{JSON.stringify(matches)}</div>
      </>
    )
  }

export default Matches;