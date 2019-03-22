import React from 'react';
import renderer from 'react-test-renderer';

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
  Button () {
    return null;
  },
  MenuItem: function BPMenuItem () {
    return null;
  },
  FormGroup () {
    return null;
  },
  Intent: {
    NONE: 'none',
  },
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Pwout"
      values={[{ id: 1, label: 'foo' }]}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should select item', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Pwout"
      values={[{ id: 1, label: 'foo' }, { id: 1, label: 'bar' }, { id: 1, label: 'fooooo' }]}
    />
  ));
  tree.getInstance().selectItem({ id: 1, label: 'fo' });
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should deselect item', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Pwout"
      values={[{ id: 1, label: 'foo' }, { id: 1, label: 'bar' }, { id: 1, label: 'fooooo' }]}
    />
  ));
  tree.getInstance().selectItem({ id: 1, label: 'fo' });
  // console.log(tree.getInstance())
  tree.getInstance().deselectItem({ id: 1, label: 'fo' });
  // console.log(tree.getInstance().state.toEqual([]))
  expect(tree.toJSON()).toMatchSnapshot();
});
