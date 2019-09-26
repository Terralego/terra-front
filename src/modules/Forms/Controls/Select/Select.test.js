import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

import Select from './Select';

jest.mock('@blueprintjs/select', () => ({
  Select: function BPSelect ({ items }) {
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

it('should render correctly with query', () => {
  const tree = renderer.create((
    <Select
      label="Pwout"
      onChange={() => null}
      values={['foo', 'bar', 'foofoo', 'fou', 'fooooo']}
    />
  ));
  tree.getInstance().handleQueryChange('fo');
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should handle change', () => {
  const onChange = jest.fn();
  const instance = new Select({ onChange });
  instance.handleChange({ value: 'foo' });
  expect(onChange).toHaveBeenCalledWith('foo');
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

it('should handle query change', () => {
  const instance = new Select();
  instance.setState = jest.fn();
  instance.handleQueryChange('foo');
  expect(instance.setState).toHaveBeenCalledWith({ query: 'foo' });
});

it('should prevent submit event in parent', () => {
  const wrapper = shallow(<Select values={['foo', 'bar']} isSubmissionPrevented={false} />);
  const div = wrapper.find('.control-container');
  expect(div.props().onKeyPress).toBe(null);
});

it('should update values', () => {
  expect(Select.getDerivedStateFromProps({ })).toBe(null);
  expect(Select.getDerivedStateFromProps({ values: ['foo', 'bar'] })).toEqual({
    values: [{
      value: 'foo',
      label: 'foo',
    }, {
      value: 'bar',
      label: 'bar',
    }],
  });
});
