import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
      <div className="home">
        <h1 className="home__title"><span>Node/ReactJS Dating App</span></h1>
        <Link to="/login"><a className="button--default" id="home__login__button">Login</a></Link>
      </div>
    )
  }