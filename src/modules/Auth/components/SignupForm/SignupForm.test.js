import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import SignupForm from './SignupForm';

it('should render correctly', () => {
  const tree = renderer
    .create(<SignupForm />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('should render with errors', () => {
  const wrapper = renderer
    .create(<SignupForm />);
  wrapper.getInstance().setState({ errors: { email: true } });
  const tree = wrapper.toJSON();
  expect(tree).toMatchSnapshot();
});

it('should submit form with success', async done => {
  const signupAction = jest.fn();
  const wrapper = shallow(<SignupForm
    signupAction={signupAction}
  />);

  wrapper.setState({ email: 'foo@bar', password: 'bar', confirmEmail: 'foo@bar', confirmPassword: 'bar' });

  await wrapper.instance().submit({ preventDefault () {} });

  expect(signupAction).toHaveBeenCalledWith({
    email: 'foo@bar',
    password: 'bar',
    confirmEmail: 'foo@bar',
    confirmPassword: 'bar',
  });
  expect(wrapper.state().errors.email).toBe(false);
  expect(wrapper.state().errors.password).toBe(false);
  expect(wrapper.state().errors.confirmEmail).toBe(false);
  expect(wrapper.state().errors.confirmPassword).toBe(false);

  done();
});

it('should submit form with failure', async done => {
  const signupAction = jest.fn(() => {
    const error = new Error();
    error.data = {
      email: ['invalid'],
    };
    throw error;
  });
  const wrapper = shallow(<SignupForm
    signupAction={signupAction}
  />);

  await wrapper.instance().submit({ preventDefault () {} });

  expect(signupAction).toHaveBeenCalledWith({ email: undefined, password: undefined });
  expect(wrapper.state().errors.email).toBe(true);
  expect(wrapper.state().errors.password).toBe(false);

  done();
});

it('should set property', () => {
  const wrapper = shallow(<SignupForm />);
  wrapper.instance().setSignupProperty({ target: { value: 'foo', id: 'email' } });
  wrapper.instance().setSignupProperty({ target: { value: 'foo', id: 'password' } });
  expect(wrapper.state().email).toBe('foo');
  expect(wrapper.state().password).toBe('foo');
});
