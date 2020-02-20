import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import MultiSelect from './MultiSelect';

jest.mock('@blueprintjs/select', () => ({
  MultiSelect: function BPMultiSelect ({ items }) {
    return (
      <select multiple>
        {items.map(({ label, value }) => (
          <option key={label} value={value}>{label}</option>
        ))}
      </select>
    );
  },
}));

jest.mock('@blueprintjs/core', () => ({
  Button ({ children }) {
    return <div className="Button"> {children} </div>;
  },
  Menu: function BPMenu ({ children }) {
    return <div className="Menu"> {children} </div>;
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

it('should render with values', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Bouh"
      values={['foo', 'bar']}
    />
  ));
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

  const tree2 = renderer.create((
    <MultiSelect
      label="Boom"
      values={[{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }]}
      value={['foo', 'bar']}
    />
  ));
  expect(tree2.toJSON()).toMatchSnapshot();
});

it('should handle change', () => {
  const onChange = jest.fn();
  const instance = new MultiSelect({ onChange, value: [], values: ['foo'] });
  instance.handleChange({ value: 'foo' });
  expect(onChange).toHaveBeenCalledWith(['foo']);
  onChange.mockClear();

  instance.props.value = ['foo'];
  instance.handleChange({ value: instance.props.value[0] });
  expect(onChange).toHaveBeenCalledWith([]);
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
  instance.handleTagRemove('foo', 0);

  expect(onChange).toHaveBeenCalledWith(['bar']);
});

it('should render tag', () => {
  const wrapper = shallow(<MultiSelect values={['foo', 'bar']} />);
  const { tagRenderer } = wrapper.find('BPMultiSelect').props();
  expect(tagRenderer({ value: 'foo', label: 'Foo' })).toBe('Foo');
});

it('should render item', () => {
  const wrapper = shallow(<MultiSelect values={[{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }]} />);
  {
    const { itemRenderer } = wrapper.find('BPMultiSelect').props();
    expect(itemRenderer('foo', { modifiers: { matchesPredicate: false } })).toBe(null);
    expect(itemRenderer('foo', { modifiers: { matchesPredicate: true } })).not.toBe(null);
    const itemRendered = itemRenderer({ label: 'Foo', value: 'foo' }, { modifiers: { matchesPredicate: true } });
    expect(itemRendered.type.name).toBe('BPMenuItem');
    expect(itemRendered.props.icon).toBe('blank');
  }
  wrapper.setProps({ value: ['foo'] });
  {
    const { itemRenderer } = wrapper.find('BPMultiSelect').props();
    const itemRendered = itemRenderer({ label: 'Foo', value: 'foo' }, { modifiers: { matchesPredicate: true } });
    expect(itemRendered.props.icon).toBe('tick');
  }
});

it('should render item with highlighted support', () => {
  const wrapper = shallow(<MultiSelect values={[{ label: 'Foo', value: 'foobar' }, { label: 'Bar', value: 'barbaz' }]} />);
  {
    const { itemRenderer } = wrapper.find('BPMultiSelect').props();
    const itemRendered = itemRenderer({ label: 'foobarbaz', value: 'foobarbaz' }, { query: 'bar', modifiers: { matchesPredicate: true } });
    expect(itemRendered.props.text).toEqual(['foo', <strong key="foobarbaz-1">bar</strong>, 'baz']);
  }
  wrapper.setProps({ highlightSearch: false });
  {
    const { itemRenderer } = wrapper.find('BPMultiSelect').props();
    const itemRendered = itemRenderer({ label: 'foobar', value: 'foobar' }, { query: 'foo', modifiers: { matchesPredicate: true } });
    expect(itemRendered.props.text).toBe('foobar');
  }
});

it('should render correctly default message', () => {
  const renderItem = jest.fn();
  const wrapper = shallow(<MultiSelect values={['foo', 'bar']} />);
  expect(shallow(wrapper.find('BPMultiSelect').props().itemListRenderer({
    filteredItems: [],
    query: 'something',
  })).find('BPMenuItem').props().text).toBe('No results.');
  expect(shallow(wrapper.find('BPMultiSelect').props().itemListRenderer({
    filteredItems: Array(251).fill('foo'),
    query: 'fo',
  })).find('BPMenuItem').props().text).toBe('Too many results, please refine your query...');
  expect(shallow(wrapper.find('BPMultiSelect').props().itemListRenderer({
    filteredItems: Array(251).fill('foo'),
    query: '',
  })).find('BPMenuItem').props().text).toBe('Enter a query first');
  wrapper.find('BPMultiSelect').props().itemListRenderer({
    filteredItems: ['foo', 'bar'],
    query: '',
    renderItem,
  });
  expect(renderItem).toHaveBeenCalledTimes(2);
});

it('should prevent submit event in parent', () => {
  const wrapper = shallow(<MultiSelect values={['foo', 'bar']} isSubmissionPrevented={false} />);
  const div = wrapper.find('.control-container');
  expect(div.props().onKeyPress).toBe(null);
});

it('should not filter if minCharacters not matched', () => {
  const values = ['foo', 'bar'];
  const wrapper = shallow(<MultiSelect values={values} minCharacters={2} />);
  expect(wrapper.find('BPMultiSelect').props().itemListPredicate('f', values)).toBe(values);
  expect(wrapper.find('BPMultiSelect').props().itemListPredicate('fo', values)).toEqual(['foo']);
});
