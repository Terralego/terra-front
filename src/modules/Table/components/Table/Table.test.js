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
    ['row1-z', 'row2-b', '10', '04-12-2018'],
    ['row1-a', 'row2-y', '3', '10-10-2015'],
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
  expect(instance.getCellData(1, 0)).toBe('row1-a');
});

describe('should sort column', () => {
  // const sortDesc = jest.fn((a, b) => b.toString().localeCompare(a));
  const wrapper = shallow(<Table {...props} />);
  const instance = wrapper.instance();
  it('ASC and DESC', () => {
    instance.sortColumn(0, 'asc');
    expect(wrapper.state().sortedIndexMap).toEqual([1, 0]);
    instance.sortColumn(1, 'desc');
    expect(wrapper.state().sortedIndexMap).toEqual([1, 0]);
  });
  it('Type string', () => {
    instance.sortColumn(1, 'asc');
    expect(wrapper.state().sortedIndexMap).toEqual([0, 1]);
  });

  it('Type number', () => {
    instance.sortColumn(2, 'asc', 'number');
    expect(wrapper.state().sortedIndexMap).toEqual([1, 0]);
  });

  it('Type date', () => {
    instance.sortColumn(3, 'asc', 'date');
    expect(wrapper.state().sortedIndexMap).toEqual([1, 0]);
  });
});

it('should format cell', () => {
  const wrapper = shallow(<Table {...props} />);
  const instance = wrapper.instance();
  expect(instance.formatCell('col1-row1', 0)).toBe('col1-row1');
  expect(instance.formatCell('04-12-2018', 3)).toBe('mocked date');
  expect(global.Date.prototype.toLocaleDateString).toHaveBeenCalled();
});