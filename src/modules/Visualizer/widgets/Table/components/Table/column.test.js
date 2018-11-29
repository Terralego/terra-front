import React from 'react';
import { shallow } from 'enzyme';

import getColumns, { RenderColumn } from './column';

jest.mock('@blueprintjs/table', () => {
  function Cell () { return null; }
  function Column () { return null; }
  function ColumnHeaderCell () { return null; }
  return {
    Cell,
    Column,
    ColumnHeaderCell,
  };
});

jest.mock('@blueprintjs/core', () => {
  function Menu () { return null; }
  function MenuItem () { return null; }
  return {
    Menu,
    MenuItem,
  };
});

it('should render correctly', () => {
  const tree = new RenderColumn(({ label: 'Label1', sortable: true, display: true, index: 1 }));
  expect(tree).toMatchSnapshot();
});

it('should renderMenu', () => {
  const instance = new RenderColumn({ index: 1 }, {});
  const sortColumn = jest.fn();
  const RenderMenu = () => instance.renderMenu(sortColumn);
  const wrapper = shallow(<RenderMenu sortColumn={sortColumn} />);
  expect(wrapper.find('MenuItem').length).toBe(2);
  const onClickSortAsc =  wrapper.find('MenuItem').get(0).props.onClick;
  const onClickSortDesc =  wrapper.find('MenuItem').get(1).props.onClick;
  onClickSortAsc();
  onClickSortDesc();
  expect(sortColumn).toHaveBeenCalled();
});

it('should get column', () => {
  const instance = new RenderColumn({ label: 'Label1', sortable: true, display: true, index: 1 }, {});
  const sortColumn = jest.fn();
  const getCellData = jest.fn(() => 2);
  const GetColumn = () => instance.getColumn(getCellData, sortColumn);
  const wrapper = shallow(<GetColumn sortColumn={sortColumn} />);
  const column = wrapper.find('Column');
  expect(column.length).toBe(1);
  expect(column.props().name).toEqual('Label1');
  expect(column.props().cellRenderer().type.name).toBe('Cell');
  expect(column.props().columnHeaderCellRenderer().type.name).toBe('ColumnHeaderCell');
});

it('should get columns', () => {
  const columns = [
    { label: 'Label1', sortable: true, display: true },
    { label: 'Label2', sortable: true, display: true },
  ];
  expect(getColumns(columns)).toEqual([
    {
      props: {
        label: 'Label1',
        sortable: true,
        display: true,
        index: 0,
      },
    },
    {
      props: {
        label: 'Label2',
        sortable: true,
        display: true,
        index: 1,
      },
    },
  ]);
});

