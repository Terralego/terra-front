import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';

import './App.css';

const Home  = () => <div>Home content</div>;
const About = () => <div>About content</div>;

class Main extends Component {
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

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Main />
    </ConnectedRouter>
  </Provider>
);

export default App;
