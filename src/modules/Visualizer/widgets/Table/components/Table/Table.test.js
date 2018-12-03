import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { Table } from './Table';

jest.mock('@blueprintjs/table', () => ({
  Table: jest.fn(() => <p>Mocked BlueprintTable</p>),
  Column: jest.fn(() => null),
}));

global.Date.prototype.toLocaleDateString = jest.fn(() => 'mocked date');

const props = {
  columns: [
    { value: 'col1', sortable: true },
    { value: 'col2', sortable: false },
    { value: 'col3', sortable: true, format: { type: 'number' } },
    { value: 'col4', sortable: true, format: { type: 'date' } }],
  data: [
    ['col1-row1', 'col1-row2'],
    ['col2-row1', 'col2-row2'],
    ['3', '10'],
    ['04-12-2018', '10-10-2015'],
  ],
};

it('should render correctly', () => {
  const tree = renderer.create((
    <Table {...props} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should get cell data', () => {
  const instance = new Table(props);
  expect(instance.getCellData(1, 0)).toBe('col2-row1');
});

it('should get sort column', () => {
  const sortDesc = jest.fn((a, b) => b.toString().localeCompare(a));
  const wrapper = shallow(<Table {...props} />);
  const instance = wrapper.instance();
  instance.sortColumn(1, sortDesc);
  expect(wrapper.state().sortedIndexMap).toEqual([1, 0, 3, 2]);
  expect(sortDesc).toHaveBeenCalledWith('col1-row2', 'col2-row2');
});

it('should format cell', () => {
  const wrapper = shallow(<Table {...props} />);
  const instance = wrapper.instance();
  expect(instance.formatCell('col1-row1', 0)).toBe('col1-row1');
  expect(instance.formatCell('04-12-2018', 3)).toBe('mocked date');
  expect(global.Date.prototype.toLocaleDateString).toHaveBeenCalled();
});
