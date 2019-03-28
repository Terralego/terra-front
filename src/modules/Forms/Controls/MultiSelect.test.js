import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import MultiSelect from './MultiSelect';

jest.mock('@blueprintjs/select', () => ({
  MultiSelect: function BPMultiSelect ({ items }) {
    return (
      <select multiple>
        {items.map(({ label, value }) => (
          <option key={`${value}${label}`} value={value}>{label}</option>
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
  const wrapper = shallow(<MultiSelect />);
  const { tagRenderer } = wrapper.find('BPMultiSelect').props();
  expect(tagRenderer('foo')).toBe('foo');
});

it('should render item', () => {
  const wrapper = shallow(<MultiSelect />);
  const modifiers = { matchesPredicate: true };
  const ItemRenderer = ({ item, ...props }) =>
    wrapper.find('BPMultiSelect').props().itemRenderer(
      item,
      {
        ...props,
        modifiers: { ...props.modifiers || {} },
      },
    );

  console.log(expect(shallow(
    <ItemRenderer
      item={['foo']}
      {...modifiers}
    />,
  ).props()));
});
