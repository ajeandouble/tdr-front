import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useParams, Switch, Route, Link } from 'react-router-dom'; 
import keys from '../config/keys';
const { server_url } = keys;

const MatchesList = ({ matches, messages }) => {
  console.log(MatchesList.name)
  console.log('matches=', matches);
  
    return (
      <>
        <h3>Matches list: </h3>
        <div className="matches">{matches && matches.map((match) => {

            return <>

              <Link to={`/dashboard/matches/${match.user_id}`}>{match.displayName}{messages.get(match.user_id) ? messages.get(match.user_id).length : null}</Link>
              </>
          })
        }</div>
      </>
    )
  }

export default MatchesList;