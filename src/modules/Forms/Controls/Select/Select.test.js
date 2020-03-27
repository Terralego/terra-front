import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';
import formatValues from '../formatValues';

import Select from './Select';

jest.mock('@blueprintjs/select', () => ({
  Select: function BPSelect ({ items, initialContent }) {
    if (initialContent) {
      return <span>InitialContent</span>;
    }
    return (
      <select>
        {items.map(({ label, value }) => (
          <option key={`${value}${label}`} value={value}>{label}</option>
        ))}
      </select>
    );
  },
}));
jest.mock('@blueprintjs/core', () => ({
  Button () { return null; },
  Spinner: () => <p>Spinner</p>,
  MenuItem: function BPMenuItem () { return null; },
  Position: {
    BOTTOM_LEFT: 'foo',
  },
}));

jest.mock('uuid/v4', () => () => 'uuid');

it('should render correctly', () => {
  const tree = renderer.create((
    <Select
      label="Pwout"
      onChange={() => null}
      values={['foo']}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render loading correctly', () => {
  const tree = renderer.create((
    <Select label="Pwout" loading values={[]} />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render correctly with values', () => {
  const tree = renderer.create((
    <Select
      label="Pwout"
      onChange={() => null}
      values={['foo', 'bar', 'foofoo', 'fou', 'fooooo']}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render correctly with a lot of values', () => {
  const tree = renderer.create((
    <Select
      label="It's over the max"
      onChange={() => null}
      values={Array(300).fill('foo')}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should handle change', () => {
  const onChange = jest.fn();
  const instance = new Select({ onChange });
  instance.handleChange({ value: 'foo' });
  expect(onChange).toHaveBeenCalledWith('foo');
});

it('should handle change multiple times', () => {
  const values = formatValues(['foo', 'bar']);
  const wrapper = shallow(<Select values={values} value="bar" />);
  expect(wrapper.instance().state.value).toEqual({ label: 'bar', value: 'bar' });
  wrapper.setProps({ ...wrapper.props(), value: 'foo' });
  expect(wrapper.instance().state.value).toEqual({ label: 'foo', value: 'foo' });
  wrapper.setProps({ ...wrapper.props(), value: 'bar' });
  expect(wrapper.instance().state.value).toEqual({ label: 'bar', value: 'bar' });
});

it('should render Item', () => {
  const wrapper = mount(
    <Select
      values={['foo']}
    />,
  );
  const ItemRenderer = ({ item, ...props }) =>
    wrapper.find('BPSelect').props().itemRenderer(
      item,
      {
        ...props,
        modifiers: { ...props.modifiers || {} },
      },
    );

  expect(shallow(
    <ItemRenderer
      item={{
        label: 'Foo',
        value: 'foo',
      }}
    />,
  ).props().className).toBe('control-container__item');
  expect(shallow(
    <ItemRenderer
      item={{
        label: 'empty',
        value: '',
      }}
    />,
  ).props().className).toBe('control-container__item control-container__item--empty');
});

it('should prevent submit event in parent', () => {
  const wrapper = shallow(<Select values={['foo', 'bar']} isSubmissionPrevented={false} />);
  const div = wrapper.find('.control-container');
  expect(div.props().onKeyPress).toBe(null);
});

it('should update values', () => {
  expect(Select.getDerivedStateFromProps({ values: [] })).toEqual({ values: [], value: null });
  expect(Select.getDerivedStateFromProps({ values: ['foo', 'bar'] })).toEqual({
    values: [{
      value: 'foo',
      label: 'foo',
    }, {
      value: 'bar',
      label: 'bar',
    }],
    value: {
      value: 'foo',
      label: 'foo',
    },
  });
});
