import logo from './sticker.png';
import './App.css';

import React from 'react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import Pusher from 'pusher-js';

function App() {
  const [counter, setCounter] = useState();

  const voteItem = async (e) => {
    if (!Cookies.get('hasVoted')) {
      console.log("voted!");
      await fetch('https://vote-for-donte.herokuapp.com/vote')
        .catch( e => { console.log(e); });
      Cookies.set('hasVoted', true, {expires: 1});
    } 
    else {
      e.target.textContent = "Gather friends to raise the counter!"
    }
  }
  const removeCookie = () => {
    Cookies.remove('hasVoted', false, {expires: 1});
  }

  useEffect(() => {
    const pusher = new Pusher("cbcaeb94965a2f834945", {
      cluster: 'us2',
      useTLS: true
    });
    const channel = pusher.subscribe('counter');
    channel.bind('vote', data => {
      setCounter(data.votes)
      console.log(data.votes)
    });
    async function updateVotes() {
      return await fetch('https://vote-for-donte.herokuapp.com/curr-vote')
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error("Networking Error!");
        })
        .catch( e => { console.log(e); });
    }
    let interval = setInterval(() => {
      updateVotes()
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button className='rm-cookie' onClick={removeCookie}>Rm 🍪</button>
        <h1>Counter Fixed!</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Current <code>Voters:</code> {!counter ? "Pending..." : counter}
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
