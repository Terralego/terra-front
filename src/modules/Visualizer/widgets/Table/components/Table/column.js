import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import {
  Cell,
  Column,
  ColumnHeaderCell,
} from '@blueprintjs/table';

export class RenderColumn {
  constructor (props) {
    this.props = props;
  }

  renderMenu = sortColumn => {
    const { index } = this.props;

    const sortAsc = () => sortColumn(index, (a, b) => this.comparator(a, b));
    const sortDesc = () => sortColumn(index, (a, b) => this.comparator(b, a));
    return (
      <Menu>
        <MenuItem icon="sort-alphabetical" onClick={sortAsc} text="Sort Asc" />
        <MenuItem icon="sort-alphabetical-desc" onClick={sortDesc} text="Sort Desc" />
      </Menu>
    );
  }

  comparator = (a, b) => {
    const { format: { type } = {} } = this.props;
    switch (type) {
      case 'number':
        return a - b;
      case 'date':
        return new Date(a) - new Date(b);
      default:
        return a.toString().localeCompare(b);
    }
  }


  getColumn (getCellData, sortColumn) {
    const { value, index, sortable } = this.props;

    const cellRenderer = (rowIndex, columnIndex) => (
      <Cell>{getCellData(rowIndex, columnIndex)}</Cell>
    );

    const columnHeaderCellRenderer = () => (
      <ColumnHeaderCell name={value} menuRenderer={() => this.renderMenu(sortColumn)} />
    );
    return (
      <Column
        cellRenderer={cellRenderer}
        columnHeaderCellRenderer={sortable ? columnHeaderCellRenderer : null}
        key={index}
        name={value}
      />
    );
  }
}

export const getColumns = columns => (
  columns.map((item, index) => new RenderColumn({ ...item, index }))
);

export default getColumns;
