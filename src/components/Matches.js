import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useParams, Switch, Route, Link } from 'react-router-dom'; 
import keys from '../config/keys';
const { server_url } = keys;

const MatchesList = ({ matches, messages, readMessages, setReadMessages}) => {
  console.log(MatchesList.name)
  console.log('matches=', matches);
  
    function newMessagesLength(user_id) {
      let user_messages = undefined;
      if (messages === undefined || (user_messages = messages.get(user_id)) === undefined)
        return false;
      console.log('messages=', user_messages);
      const received_messages = user_messages.filter(msg => msg.type === 'received');
      console.log(received_messages.length)
      return received_messages.length;
    }

    useEffect(() => {
      console.log('readMessages=', readMessages);
    }, [readMessages]);
    return (
      <>
        <div className="matches-list">
          {matches && matches.map((match) => {

            return (
              <Link className="matches-list__match" to={`/dashboard/matches/${match.user_id}`}>
                <img className="matches-list__img"alt="" src={match.pics && match.pics[0] ? match.pics[0] : "https://professionnels.tarkett.fr/media/img/M/TH_3917011_3707003_3708011_3912011_3914011_800_800.jpg"} />
                {readMessages[match.user_id] ? <div className="matches-list__new-msg" /> : <null />}
                <Link className="matches-list__link" to={`/dashboard/matches/${match.user_id}`}>{match.displayName}{readMessages[match.user_id]  ? <span>({readMessages[match.user_id]})</span> : null}</Link>
              </Link>
            );
          })
        }
        </div>
      </>
    )
  }

export default MatchesList;