import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ColumnsSelector from './ColumnsSelector';

jest.mock('@blueprintjs/core', () => ({
  Button: jest.fn(() => null),
  Checkbox () { return null; },
  Label: jest.fn(() => null),
  Popover ({ children }) { return children; },
  Position: {
    RIGHT_BOTTOM: 'RIGHT_BOTTOM',
  },
  Intent: {
    PRIMARY: 'primary',
  },
}));

const props = {
  columns: [
    {
      value: 'Name',
      sortable: true,
      editable: true,
      display: true,
    },
    {
      value: 'Date',
      sortable: true,
      editable: true,
      format: { type: 'date', value: 'DD/MM/YYYY' },
      display: false,
    },
    {
      value: 'Lorem',
      sortable: true,
      editable: true,
      display: true,
    },
  ],
};

it('should render correctly', () => {
  const tree = renderer.create((
    <ColumnsSelector columns={props.columns} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change item', () => {
  const onChange = jest.fn();
  const wrapper = mount(<ColumnsSelector columns={props.columns} onChange={onChange} />, {});
  wrapper.find('Checkbox').get(1).props.onChange();
  expect(onChange).toHaveBeenCalled();
});

it('should toggle all', () => {
  const onChange = jest.fn();
  const wrapper = mount(<ColumnsSelector columns={props.columns} onChange={onChange} />, {});
  wrapper.find('Checkbox').get(0).props.onChange({ target: { checked: true } });
  expect(onChange).toHaveBeenCalledTimes(1);

  onChange.mockClear();
  wrapper.find('Checkbox').get(0).props.onChange({ target: { checked: false } });
  expect(onChange).toHaveBeenCalledTimes(2);
});
