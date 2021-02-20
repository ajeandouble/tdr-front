import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useParams, Switch, Route, Link } from 'react-router-dom'; 
import keys from '../config/keys';
const { server_url } = keys;

const MatchesList = ({ matches, messages }) => {
  console.log(MatchesList.name)
  console.log('matches=', matches);
  
    return (
      <>
        <div className="matches-list">
          {matches && matches.map((match) => {

            return (
              <Link className="matches-list__match" to={`/dashboard/matches/${match.user_id}`}>
                <img className="matches-list__img"alt="" src="https://professionnels.tarkett.fr/media/img/M/TH_3917011_3707003_3708011_3912011_3914011_800_800.jpg" />
                {messages.get(match.user_id) && messages.get(match.user_id).length ? <div className="matches-list__new-msg" /> : <null />}
                <Link className="matches-list__link" to={`/dashboard/matches/${match.user_id}`}>{match.displayName}{messages.get(match.user_id) ? <span>({messages.get(match.user_id).length})</span> : null}</Link>
              </Link>
            );
          })
        }
        </div>
      </>
    )
  }

export default MatchesList;