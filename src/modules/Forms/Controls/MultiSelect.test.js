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
      label="Bouh"
      values={['foo']}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});
