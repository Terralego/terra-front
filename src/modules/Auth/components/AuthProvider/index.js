import React from 'react';

import { diff } from 'deep-object-diff';
import {
  getToken,
  obtainToken,
  refreshToken,
  clearToken,
  createToken,
} from '../../services/auth';
import context from '../../services/context';
import { getTokenPayload } from '../../../../utils/jwt';

const { Provider } = context;

export class AuthProvider extends React.Component {
  constructor (props) {
    super(props);

    this.state = { authenticated: false, user: null };
    const token = getToken();
    if (!token) return;

    const { user } = this.extractTokenData(token);
    this.state = { authenticated: true, user };
  }

  componentDidMount () {
    this.refreshToken();
  }

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setAuthenticated = authenticated => this.setState({ authenticated });

  authAction = async ({ login, password }) => {
    const token = await obtainToken(login, password);
    if (this.isUnmount) return;
    const { user } = this.extractTokenData(token);
    this.setState({ authenticated: true, user });
  };

  signupAction = async properties => {
    await createToken(properties);
  }

  logoutAction = async (ssoLink = null) => {
    if (ssoLink) {
      try {
        const ssoUrl = new URL(ssoLink, window.location);
        await fetch(ssoUrl);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    clearToken();
    this.setState({ authenticated: false, user: null });
  }

  // "Privates"

  extractTokenData (token) {
    const data = getTokenPayload(token);
    if (data && data.exp) {
      this.delayAutoRefresh(data);
    }
    return data;
  }

  delayAutoRefresh ({ exp }) {
    const expireAt = new Date(exp * 1000);
    const now = new Date(Date.now());
    // Delay is 10 seconds before to be sure to not miss it
    const delay = expireAt - now - 1000 * 60;
    clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => this.refreshToken(), delay);
  }

  async refreshToken () {
    try {
      const token = await refreshToken();
      if (this.isUnmount) return;
      const { user } = this.extractTokenData(token);

      if (user) {
        this.setState(({ user: prevUser }) => {
          if (!Object.keys(
            diff(prevUser, user),
          ).length) {
            return null;
          }
          // Sometimes the api doest not return the same order
          if (!Object.keys(
            diff(prevUser.modules?.sort(), user.modules?.sort()),
          ).length) {
            return null;
          }
          return { authenticated: true, user };
        });
      }
    } catch (e) {
      if (this.isUnmount) return;
      this.setState({ authenticated: false, user: null });
    }
  }


  render () {
    const { children } = this.props;
    const { authenticated, user } = this.state;
    const { authAction, logoutAction, signupAction, setAuthenticated } = this;

    return (
      <Provider
        value={{ authenticated, user, authAction, logoutAction, signupAction, setAuthenticated }}
      >
        {children}
      </Provider>
    );
  }
}

export default AuthProvider;
