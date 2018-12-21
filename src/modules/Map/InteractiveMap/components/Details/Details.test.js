import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Details } from './Details';

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
  wrapper.find('button').props().onClick();
  expect(onClose).toHaveBeenCalled();
});

it('should close without onClose and without crashing', () => {
  const wrapper = shallow((
    <Details />
  ));
  wrapper.find('button').props().onClick();
  expect(wrapper.find('button')).toBeDefined();
});
