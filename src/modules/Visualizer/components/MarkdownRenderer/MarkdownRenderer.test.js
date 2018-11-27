import React from 'react';
import { shallow } from 'enzyme';
import MarkdownRenderer from './MarkdownRenderer';

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
