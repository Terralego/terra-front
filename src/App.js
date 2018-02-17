import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import './App.css';

const Home  = () => <div>Home content</div>;
const About = () => <div>About content</div>;

class App extends Component {
  componentDidMount () {
    // componentDidMount
  }

  render () {
    return (
      <div className="App">
        <header>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </header>
        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
        </main>
      </div>
    );
  }
}

export default App;
