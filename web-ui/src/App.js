import React, {Component} from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    blocks: {}
  }

  registerUpdate(msg) {
    console.log(msg)
  }

  componentWillMount() {
    const socket = io('http://localhost:5000');
    socket.on('json', this.registerUpdate);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
