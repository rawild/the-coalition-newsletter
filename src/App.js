import React, { Component } from 'react';
import logo from './berlin.svg';
import './App.css';
import writer from './js/writer'
import Clipboard from 'clipboard'
class App extends Component {
  componentWillMount() {
    new Clipboard('.btn')
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to The-Coalition Berlin Newsletter Service</h2>
        </div>
        <button onClick={() => writer.writeNewsletter()} >
          <h3>Fetch</h3>
        </button>
        <button className="btn" data-clipboard-target="#app">
          <h3>Copy to clipboard</h3>
        </button>
        <div className="Body">
          <div id="app" /> 
        </div>
      </div>
    );
  }
}

export default App;
