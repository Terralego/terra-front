import React from 'react';
import { shallow } from 'enzyme';
import AuthProvider from '.';
import context from '../../services/context';
import Auth from '../../services/auth';

const { Consumer } = context;

const MOCKED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0Mn0sImV4cCI6MTUxNjIzOTAyMn0.mPABaxD6A5yFiIFWjNDFFEhtDsrtDPVsDKHCW6ljCNs';

jest.mock('../../services/auth', () => ({
  getToken: jest.fn(() => global.localStorage.getItem('tf:auth:token')),
  obtainToken: jest.fn(() => MOCKED_TOKEN),
  clearToken: jest.fn(),
}));

it('should get props from consumer', () => {
  let expected;
  const wrapper = shallow((
    <AuthProvider>
      <Consumer>
        {authProps => {
          expected = authProps;
          return null;
        }}
      </Consumer>
    </AuthProvider>
  ));
  wrapper.html();
  expect(expected.authAction).toBeDefined();
  expect(typeof expected.authAction).toBe('function');
  expect(expected.logoutAction).toBeDefined();
  expect(typeof expected.logoutAction).toBe('function');
  expect(expected.authenticated).toBe(false);
  expect(expected.user).toBe(null);
});

it('should sign in', async done => {
  global.localStorage.removeItem('tf:auth:token');
  const wrapper = shallow(<AuthProvider />);
  await wrapper.instance().authAction({ login: 'foo@bar', password: 'bar' });
  expect(wrapper.state().authenticated).toBe(true);
  expect(wrapper.state().user).toEqual({ id: 42 });
  done();
});

it('should logout', async done => {
  global.localStorage.setItem('tf:auth:token', MOCKED_TOKEN);
  const wrapper = shallow(<AuthProvider />);
  await wrapper.instance().logoutAction();

  expect(wrapper.state().authenticated).toBe(false);
  expect(wrapper.state().user).toBe(null);
  done();
});

it('should have an auto refresh delay', () => {
  global.localStorage.setItem('tf:auth:token', MOCKED_TOKEN);
  const wrapper = shallow(<AuthProvider />);
  expect(wrapper.instance().delayTimeout).toBeDefined();
});

it('should refresh token with success', async done => {
  Auth.refreshToken = jest.fn(); // eslint-disable-line
  const wrapper = shallow((
    <AuthProvider />
  ));
  await wrapper.instance().refreshToken();
  expect(Auth.refreshToken).toHaveBeenCalled(); // eslint-disable-line
  expect(wrapper.state().authenticated).toBe(true);
  done();
});

it('should refresh token with failure', async done => {
  Auth.refreshToken = jest.fn(() => { // eslint-disable-line
    throw new Error();
  });
  const wrapper = shallow((
    <AuthProvider />
  ));
  await wrapper.instance().refreshToken();
  expect(Auth.refreshToken).toHaveBeenCalled(); // eslint-disable-line
  expect(wrapper.state().authenticated).toBe(false);
  done();
});

it('should auto refresh', async done => {
  const wrapper = shallow((
    <AuthProvider />
  ));
  const instance = wrapper.instance();
  instance.refreshToken = jest.fn();
  // avoid negative value, to be sure callback is triggered
  instance.delayAutoRefresh({ exp: (Date.now() / 1000) });
  expect(instance.delayTimeout).toBeDefined();
  await new Promise(resolve => setTimeout(resolve, 1));
  expect(instance.refreshToken).toHaveBeenCalled();
  done();
});
