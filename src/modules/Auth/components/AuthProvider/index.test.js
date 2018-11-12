import React from 'react';
import { shallow } from 'enzyme';
import Auth from './';
import { Consumer } from '../../services/context';

const MOCKED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0Mn0sImV4cCI6MTUxNjIzOTAyMn0.mPABaxD6A5yFiIFWjNDFFEhtDsrtDPVsDKHCW6ljCNs';

jest.mock('../../services/auth', () => ({
  getToken: jest.fn(() => global.localStorage.getItem('tf:auth:token')),
  obtainToken: jest.fn(() => MOCKED_TOKEN),
  parseToken: jest.fn(() => ({
    user: { id: 42 },
    exp: 1516239022,
  })),
  invalidToken: jest.fn(),
}));

it('should get props from consumer', () => {
  let expected;
  const wrapper = shallow((
    <Auth>
      <Consumer>
        {authProps => {
          expected = authProps;
          return null;
        }}
      </Consumer>
    </Auth>
  ));
  wrapper.html();
  expect(expected.authAction).toBeDefined();
  expect(typeof expected.authAction).toBe('function');
  expect(expected.signoutAction).toBeDefined();
  expect(typeof expected.signoutAction).toBe('function');
  expect(expected.authentified).toBe(false);
  expect(expected.user).toBe(null);
});

it('should signin', async done => {
  global.localStorage.removeItem('tf:auth:token');
  const wrapper = shallow(<Auth />);
  await wrapper.instance().authAction({ login: 'foo@bar', password: 'bar' });
  expect(wrapper.state().authentified).toBe(true);
  expect(wrapper.state().user).toEqual({ id: 42 });
  done();
});

it('should signout', async done => {
  global.localStorage.setItem('tf:auth:token', MOCKED_TOKEN);
  const wrapper = shallow(<Auth />);
  await wrapper.instance().signoutAction();

  expect(wrapper.state().authentified).toBe(false);
  expect(wrapper.state().user).toBe(null);
  done();
});

it('should have an auto refresh delay', () => {
  global.localStorage.setItem('tf:auth:token', MOCKED_TOKEN);
  const wrapper = shallow(<Auth />);
  expect(wrapper.instance().delayTimeout).toBeDefined();
});
