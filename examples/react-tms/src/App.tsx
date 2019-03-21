import React, { Component } from 'react';
import './App.css';
import Example from './Example';
import { ReactTmsStore } from './store/index';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Example />
      </div>
    );
  }
}

export default  ReactTmsStore.getProvider(App);