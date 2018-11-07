import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { LoginForm } from './';

it('should render correctly', () => {
  const tree = renderer
    .create(<LoginForm />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('should submit form with success', async done => {
  const authAction = jest.fn();
  const wrapper = shallow(<LoginForm
    authAction={authAction}
  />);

  wrapper.setState({ login: 'foo@bar', password: 'bar' });

  await wrapper.instance().submit({ preventDefault () {} });

  expect(authAction).toHaveBeenCalledWith({ login: 'foo@bar', password: 'bar' });
  expect(wrapper.state().errorLogin).toBe(false);
  expect(wrapper.state().errorPassword).toBe(false);

  done();
});

it('should submit form with failure', async done => {
  const authAction = jest.fn(() => {
    const error = new Error();
    error.data = {
      email: ['invalid'],
    };
    throw error;
  });
  const wrapper = shallow(<LoginForm
    authAction={authAction}
  />);

  await wrapper.instance().submit({ preventDefault () {} });

  expect(authAction).toHaveBeenCalledWith({ login: undefined, password: undefined });
  expect(wrapper.state().errorLogin).toBe(true);
  expect(wrapper.state().errorPassword).toBe(false);

  done();
});
