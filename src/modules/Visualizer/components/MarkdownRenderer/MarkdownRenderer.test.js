import React from 'react';
import { shallow } from 'enzyme';
import MarkdownRenderer from './MarkdownRenderer';

it('should replace props', () => {
  const props = {
    content: 'This {{foo}} is a {{bar}}',
    foo: 'FOO',
    bar: 'BAR',
  };
  const wrapper = shallow(<MarkdownRenderer {...props} />);
  expect(wrapper.props().source).toBe('This FOO is a BAR');
});
