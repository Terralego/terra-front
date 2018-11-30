import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import LoginForm from './LoginForm';

it('should render correctly', () => {
  const tree = renderer
    .create(<LoginForm />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('should render with errors', () => {
  const wrapper = renderer
    .create(<LoginForm />);
  wrapper.getInstance().setState({ errorLogin: true, errorPassword: true });
  const tree = wrapper.toJSON();
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

it('should submit form with failure and invalid error', async done => {
  const authAction = jest.fn(() => {
    const error = new Error();
    throw error;
  });
  const wrapper = shallow(<LoginForm
    authAction={authAction}
  />);

  await wrapper.instance().submit({ preventDefault () {} });

  expect(wrapper.state().errorLogin).toBe(false);
  expect(wrapper.state().errorPassword).toBe(false);

  done();
});

it('should set login', () => {
  const wrapper = shallow(<LoginForm />);
  wrapper.instance().setLogin({ target: { value: 'foo' } });
  expect(wrapper.state().login).toBe('foo');
});

it('should set password', () => {
  const wrapper = shallow(<LoginForm />);
  wrapper.instance().setPassword({ target: { value: 'password' } });
  expect(wrapper.state().password).toBe('password');
});
