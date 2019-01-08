import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Details } from './Details';

jest.mock('@blueprintjs/core', () => ({
  Button () {
    return <p>Button</p>;
  },
}));

it('should render correctly with content', () => {
  const tree = renderer.create((
    <Details
      visible
      template={
`# Hello world
 This is {{foo}}`
      }
      foo="FOO"
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly without content', () => {
  const tree = renderer.create((
    <Details
      template={
`# Hello world
 This is {{foo}}`
      }
      foo="FOO"
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should close', () => {
  const onClose = jest.fn();
  const wrapper = shallow((
    <Details
      onClose={onClose}
    />
  ));
  wrapper.find('Button').props().onClick();
  expect(onClose).toHaveBeenCalled();
});

it('should do nothing', () => {
  const onClose = jest.fn();
  const wrapper = shallow((
    <Details />
  ));
  wrapper.find('Button').props().onClick();
  expect(onClose).not.toHaveBeenCalled();
});
