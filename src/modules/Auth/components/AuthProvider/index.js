import React from 'react';

import {
  getToken,
  obtainToken,
  parseToken,
  refreshToken,
  invalidToken,
  createToken,
} from '../../services/auth';
import { Provider } from '../../services/context';

export class AuthProvider extends React.Component {
  constructor (props) {
    super(props);
    const token = getToken();

    this.state = { authenticated: false, user: null };

    if (!token) return;

    const { user } = this.extractTokenData(token);
    this.state = { authenticated: true, user };
    this.refreshToken();
  }

  authAction = async ({ login, password }) => {
    const token = await obtainToken(login, password);
    const { user } = this.extractTokenData(token);
    this.setState({ authenticated: true, user });
  };

  signupAction = async properties => {
    await createToken(properties);
  }

  logoutAction = async () => {
    invalidToken();
    this.setState({ authenticated: false, user: null });
  }

  // "Privates"

  extractTokenData (token) {
    const data = parseToken(token);
    this.delayAutoRefresh(data);
    return data;
  }

  delayAutoRefresh ({ exp }) {
    const expireAt = new Date(exp * 1000);
    const now = new Date(Date.now());
    // Delay is 10 seconds before to be sure to not miss it
    const delay = expireAt - now - 10000;
    clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => this.refreshToken(), delay);
  }

  async refreshToken () {
    try {
      const token = await refreshToken();
      const { user } = this.extractTokenData(token);
      this.setState({ authenticated: true, user });
    } catch (e) {
      this.setState({ authenticated: false, user: null });
    }
  }

  render () {
    const { children } = this.props;
    const { authenticated, user } = this.state;
    const { authAction, logoutAction, signupAction } = this;

    return (
      <Provider
        value={{ authenticated, user, authAction, logoutAction, signupAction }}
      >
        {children}
      </Provider>
    );
  }
}

export default AuthProvider;
