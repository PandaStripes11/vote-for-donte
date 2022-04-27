import logo from './sticker.png';
import './App.css';

import React from 'react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import Pusher from 'pusher-js';

function App() {
  const [counter, setCounter] = useState(0);

  const voteItem = async (e) => {
    if (true/*!Cookies.get('hasVoted')*/) {
      await fetch('https://vote-for-donte.herokuapp.com/vote', {mode: "no-cors"})
        .catch( e => { console.log(e); });
      Cookies.set('hasVoted', true, {expires: 1});
    } else {
      e.target.textContent = "Gather friends to raise the counter!"
    }
  }

  useEffect(() => {
    const pusher = new Pusher("cbcaeb94965a2f834945", {
      cluster: 'us2',
      useTLS: true
    });
    const channel = pusher.subscribe('counter');
    channel.bind('vote', data => {
      setCounter(data.votes)
    });
  }, []);
  useEffect(() => {
    fetch('https://vote-for-donte.herokuapp.com/curr-vote', {mode: "no-cors"})
      .catch( e => { console.log(e); });
  }, [counter])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Current <code>Voters:</code> {counter}
        </p>
        <button
          className="App-link"
          rel="noopener noreferrer"
          onClick={voteItem}
        >
          Show Your Support
        </button>
      </header>
    </div>
  );
}

export default App;
