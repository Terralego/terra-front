import React from 'react';
import { shallow } from 'enzyme';
import slugify from 'slugify';
import MarkdownRenderer from './MarkdownRenderer';
import HistoryLink from '../HistoryLink';


jest.mock('../HistoryLink', () => jest.fn());
jest.mock('slugify', value => jest.fn(value));

it('should display content', () => {
  const props = {
    content: 'Hello World',
  };
  const wrapper = shallow(<MarkdownRenderer {...props} />);
  expect(wrapper.props().source).toBe('Hello World');
});

it('should compile from a template', () => {
  const props = {
    template: 'This {{foo}} is a {{bar}}',
    foo: 'FOO',
    bar: 'BAR',
  };
  const wrapper = shallow(<MarkdownRenderer {...props} />);
  expect(wrapper.props().source).toBe('This FOO is a BAR');
});

it('should compile custom link', () => {
  const props = {
    content: '',
  };
  const wrapper = shallow(<MarkdownRenderer {...props} />);
  shallow(wrapper.props().renderers.link());
  expect(HistoryLink).toHaveBeenCalled();
});


it('should slugify a string', () => {
  shallow(<MarkdownRenderer
    template="this {{foo|slug}}"
    foo="Foo bar 42"
  />);
  expect(slugify).toHaveBeenCalledWith('foo bar 42');
});
