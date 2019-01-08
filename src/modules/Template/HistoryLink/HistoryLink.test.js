import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import HistoryLink from './HistoryLink';

jest.mock('../HistoryLink', () => jest.fn());

it('should render correctly', () => {
  const tree = renderer.create(<HistoryLink href="/pwouait" />);
  expect(tree).toMatchSnapshot();
});

it('should display content', () => {
  const props = {
    href: '/pwouait',
    history: {
      push: jest.fn(),
    },
  };
  const wrapper = mount(<HistoryLink {...props} />);
  const mockEvent = { pwouait: '' };
  wrapper.find('a').simulate('click', mockEvent);
  wrapper.find('a').getDOMNode().click();
  expect(wrapper.props().history.push).toHaveBeenCalledWith('/pwouait');
});
