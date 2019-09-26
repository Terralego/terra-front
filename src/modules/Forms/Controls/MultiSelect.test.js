import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import MultiSelect from './MultiSelect';

jest.mock('@blueprintjs/select', () => ({
  MultiSelect: function BPMultiSelect ({ items }) {
    return (
      <select multiple>
        {items.map(label => (
          <option key={label} value={label}>{label}</option>
        ))}
      </select>
    );
  },
}));

jest.mock('@blueprintjs/core', () => ({
  Button ({ children }) {
    return <div className="Button"> {children} </div>;
  },
  MenuItem: function BPMenuItem ({ children }) {
    return <div className="MenuItem"> {children} </div>;
  },
  FormGroup ({ children }) {
    return <div className="FormGroup"> {children} </div>;
  },
  Intent: {
    NONE: 'none',
  },
  Spinner: () => <p>Spinner</p>,
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Bouh"
      values={['foo', 'bar']}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render loading correctly', () => {
  const tree = renderer.create((
    <MultiSelect label="Pwout" loading values={[]} />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render filtered items', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Bouh"
      values={['foo', 'bar']}
    />
  ));
  tree.getInstance().handleQueryChange('foo');
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render multiple value', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Bouh"
      values={['foo', 'bar']}
      value={['foo', 'bar']}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should handle change', () => {
  const onChange = jest.fn();
  const instance = new MultiSelect({ onChange, value: [] });
  instance.handleChange('foo');
  expect(onChange).toHaveBeenCalledWith(['foo']);
  onChange.mockClear();

  instance.props.value = ['foo'];
  instance.handleChange(instance.props.value[0]);
  expect(onChange).toHaveBeenCalledWith([]);
});

it('should handle query change', () => {
  const instance = new MultiSelect({});
  instance.setState = jest.fn();
  instance.handleQueryChange('foo');
  expect(instance.setState).toHaveBeenCalledWith({ query: 'foo' });
});

it('should handle clear', () => {
  const onChange = jest.fn();
  const instance = new MultiSelect({ onChange });
  instance.handleClear();
  expect(onChange).toHaveBeenCalledWith([]);
});

it('should handle tag remove', () => {
  const onChange = jest.fn();
  const instance = new MultiSelect({ onChange, value: [] });
  instance.props.value = ['foo', 'bar'];
  instance.handleTagRemove('foo');

  expect(onChange).toHaveBeenCalledWith(['bar']);
});

it('should render tag', () => {
  const wrapper = shallow(<MultiSelect values={['foo', 'bar']} />);
  const { tagRenderer } = wrapper.find('BPMultiSelect').props();
  expect(tagRenderer('foo')).toBe('foo');
});

it('should render item', () => {
  const wrapper = shallow(<MultiSelect values={['foo', 'bar']} />);
  {
    const { itemRenderer } = wrapper.find('BPMultiSelect').props();
    expect(itemRenderer('foo', { modifiers: { matchesPredicate: false } })).toBe(null);
    expect(itemRenderer('foo', { modifiers: { matchesPredicate: true } })).not.toBe(null);
    const itemRendered = itemRenderer('foo', { modifiers: { matchesPredicate: true } });
    expect(itemRendered.type.name).toBe('BPMenuItem');
    expect(itemRendered.props.icon).toBe('blank');
  }
  wrapper.setProps({ value: ['foo'] });
  {
    const { itemRenderer } = wrapper.find('BPMultiSelect').props();
    const itemRendered = itemRenderer('foo', { modifiers: { matchesPredicate: true } });
    expect(itemRendered.props.icon).toBe('tick');
  }
});

it('should render default message', () => {
  const wrapper = shallow(<MultiSelect values={['foo', 'bar']} />);
  expect(wrapper.find('BPMultiSelect').props().noResults.props.text).toBe('No results.');
});

it('should prevent submit event in parent', () => {
  const wrapper = shallow(<MultiSelect values={['foo', 'bar']} isSubmissionPrevented={false} />);
  const div = wrapper.find('.control-container');
  expect(div.props().onKeyPress).toBe(null);
});
