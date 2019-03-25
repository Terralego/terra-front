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
      values={['foo']}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should select item', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Pwout"
      values={['foo', 'bar', 'fooooo']}
    />
  ));
  tree.getInstance().selectItem({ id: 1, label: 'fo', value: 'fo' });
  expect(tree.getInstance().state.selectedItems.length).toEqual(1);
});

it('should deselect item', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Pwout"
      values={['foo', 'bar', 'fooooo']}
    />
  ));
  tree.getInstance().selectItem({ id: 1, label: 'fo', value: 'fo' });
  expect(tree.getInstance().state.selectedItems.length).toEqual(1);
  tree.getInstance().deselectItem({ id: 1, label: 'fo', value: 'fo' });
  expect(tree.getInstance().state.selectedItems).toEqual([]);
});

it('should handle selected/deselect item', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Pwout"
      values={['foo', 'bar', 'fooooo']}
    />
  ));
  const fo = { id: 1, label: 'fo', value: 'fo' };
  const fooooo = { id: 2, label: 'fooooo', value: 'fooooo' };
  tree.getInstance().handleChange(fo);
  tree.getInstance().handleChange(fooooo);
  expect(tree.getInstance().state.selectedItems.length).toEqual(2);
  tree.getInstance().handleChange(fo);
  expect(tree.getInstance().state.selectedItems).toEqual([fooooo]);
});

it('should clear all selected items', () => {
  const tree = renderer.create((
    <MultiSelect
      label="Pwout"
      values={['foo', 'bar', 'fooooo']}
    />
  ));
  const fo = { id: 1, label: 'fo', value: 'fo' };
  const fooooo = { id: 2, label: 'fooooo', value: 'fooooo' };
  tree.getInstance().handleChange(fo);
  tree.getInstance().handleChange(fooooo);
  expect(tree.getInstance().state.selectedItems.length).toEqual(2);
  tree.getInstance().handleClear();
  expect(tree.getInstance().state.selectedItems).toEqual([]);
});
