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
  const tree = new RenderColumn({
    value: 'Label1', sortable: true, display: true, index: 1,
  });
  expect(tree).toMatchSnapshot();
});

it('should render cell with type in className', () => {
  const instance = new RenderColumn({
    value: 'Label1', sortable: true, display: true, format_type: 'number', index: 2,
  });
  const getCellData = () => 'foo';
  const sortColumn = a => a;
  const renderCell = children => children;
  const column = instance.getColumn(getCellData, sortColumn, renderCell);
  const cell = column.props.cellRenderer(1, 1);
  expect(cell.props.className).toMatch('tf-table-cell--number');
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
  const instance = new RenderColumn({ value: 'Label1', sortable: true, display: true, index: 1 }, {});
  const sortColumn = jest.fn();
  const getCellData = jest.fn(() => 2);
  const renderCell = children => children;
  const GetColumn = () => instance.getColumn(getCellData, sortColumn, renderCell);
  const wrapper = shallow(<GetColumn sortColumn={sortColumn} />);
  const column = wrapper.find('Column');
  expect(column.length).toBe(1);
  expect(column.props().name).toEqual('Label1');
  expect(column.props().cellRenderer().type.name).toBe('Cell');
  expect(column.props().columnHeaderCellRenderer().type.name).toBe('ColumnHeaderCell');
});

it('should get columns', () => {
  const columns = [
    { value: 'Label1', sortable: true, display: true },
    { value: 'Label2', sortable: true, display: true },
  ];
  expect(getColumns({ columns }).length).toBe(2);
  expect(getColumns({ columns })[0]).toHaveProperty('props', {
    display: true,
    index: 0,
    value: 'Label1',
    sortable: true,
  });
  expect(getColumns({ columns })[0]).toHaveProperty('renderMenu');
});

it('should render menu in column header', () => {
  const instance = new RenderColumn({
    value: 'foo',
    index: 0,
    sortable: true,
  });
  const sortColumn = 1;
  const renderCell = children => children;
  instance.renderMenu = jest.fn();
  const ColumnRenderer = () => instance.getColumn(null, sortColumn, renderCell);
  const wrapper = shallow(<ColumnRenderer />);
  expect(wrapper.find('Column').length).toBe(1);
  const { columnHeaderCellRenderer: ColumnHeaderCellRenderer } = wrapper.find('Column').get(0).props;
  const columnHeaderWrapper = shallow(<ColumnHeaderCellRenderer />);
  columnHeaderWrapper.props().menuRenderer();
  expect(instance.renderMenu).toHaveBeenCalledWith(sortColumn);
});

it('should render cell with sorted index', () => {
  const instance = new RenderColumn({
    value: 'foo',
    index: 0,
    sortable: true,
  });
  const sortColumn = 1;
  const getCellData = jest.fn(() => 'foo');
  const renderCell = jest.fn();

  const ColumnRenderer = () => instance.getColumn(getCellData, sortColumn, renderCell, [3, 2, 1]);
  const wrapper = shallow(<ColumnRenderer />);
  const { cellRenderer } = wrapper.find('Column').get(0).props;
  cellRenderer(0, 0);
  expect(renderCell).toHaveBeenCalledWith({
    children: 'foo',
    originalRowIndex: 3,
    rowIndex: 0,
    columnIndex: 0,
  });
});

it('should display sort-numerical icon', () => {
  const instance = new RenderColumn({
    value: 'Label1', sortable: true, display: true, format_type: 'number', index: 2,
  });
  const sortColumn = jest.fn();
  const RenderMenu = () => instance.renderMenu(sortColumn);
  const wrapper = shallow(<RenderMenu sortColumn={sortColumn} />);
  expect(wrapper.find('MenuItem').get(0).props.icon).toMatch('sort-numerical');
});
