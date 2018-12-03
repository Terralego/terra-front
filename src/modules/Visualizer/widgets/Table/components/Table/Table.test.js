import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { Table } from './Table';

jest.mock('@blueprintjs/table', () => ({
  Table: jest.fn(() => <p>Mocked BlueprintTable</p>),
  Column: jest.fn(() => null),
}));

const props = {
  columns: [{ value: 'col1', sortable: true }, { value: 'col2', sortable: true }],
  data: [
    ['col1-row1', 'col1-row2'],
    ['col2-row1', 'col2-row2'],
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
  expect(wrapper.state().sortedIndexMap).toEqual([1, 0]);
  expect(sortDesc).toHaveBeenCalledWith('col1-row2', 'col2-row2');
});
