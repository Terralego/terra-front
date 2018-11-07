import React from 'react';

import { getToken, obtainToken, parseToken, refreshToken, invalidToken } from '../../services/auth';
import { Provider } from '../../services/context';

export class AuthProvider extends React.Component {
  constructor (props) {
    super(props);
    const token = getToken();

    this.state = { authentified: false, user: null };

    if (!token) return;

    const { user } = this.extractTokenData(token);
    this.state = { authentified: true, user };
  }

  authAction = async ({ login, password }) => {
    const token = await obtainToken(login, password);
    const { user } = this.extractTokenData(token);
    this.setState({ authentified: true, user });
  };

  signoutAction = async () => {
    invalidToken();
    this.setState({ authentified: false, user: null });
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
      this.setState({ authentified: true, user });
    } catch (e) {
      this.setState({ authentified: false, user: null });
    }
  }

  render () {
    const { children } = this.props;
    const { authentified, user } = this.state;
    const { authAction, signoutAction } = this;

    return (
      <Provider
        value={{ authentified, user, authAction, signoutAction }}
      >
        {children}
      </Provider>
    );
  }
}

export default AuthProvider;
