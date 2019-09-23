import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import {
  Cell,
  Column,
  ColumnHeaderCell,
} from '@blueprintjs/table';

const formatValue = (value, type) => (type === 'number'
  ? new Intl.NumberFormat().format(value)
  : value);

export class RenderColumn {
  constructor (props) {
    this.props = props;
  }

  renderMenu = sortColumn => {
    const {
      index,
      locales: { sortAsc: labelSortAsc, sortDesc: labelSortDesc } = {},
      format_type: formatType,
    } = this.props; // eslint-disable-line react/no-this-in-sfc

    const sortAsc = () => sortColumn(index, 'asc');
    const sortDesc = () => sortColumn(index, 'desc');
    return (
      <Menu>
        <MenuItem icon={formatType === 'number' ? 'sort-numerical' : 'sort-alphabetical'} onClick={sortAsc} text={labelSortAsc} />
        <MenuItem icon={formatType === 'number' ? 'sort-numerical-desc' : 'sort-alphabetical-desc'} onClick={sortDesc} text={labelSortDesc} />
      </Menu>
    );
  }

  getColumn (getCellData, sortColumn, renderCell, sortedIndexMap) {
    const { value, label = value, index, sortable, format_type: formatType } = this.props;

    const cellRenderer = (rowIndex, columnIndex) => {
      const sortedIndex = (sortedIndexMap || [])[rowIndex];
      return (
        <Cell className={formatType ? `tf-table-cell--${formatType}` : ''}>
          {renderCell({
            children: formatValue(getCellData(rowIndex, columnIndex), formatType),
            originalRowIndex: sortedIndex !== undefined ? sortedIndex : rowIndex,
            rowIndex,
            columnIndex,
          })}
        </Cell>
      );
    };

    const columnHeaderCellRenderer = () => (
      <ColumnHeaderCell
        name={label}
        menuRenderer={() => this.renderMenu(sortColumn)} // eslint-disable-line react/no-this-in-sfc
      />
    );
    return (
      <Column
        cellRenderer={cellRenderer}
        columnHeaderCellRenderer={sortable ? columnHeaderCellRenderer : null}
        key={index}
        name={label}
      />
    );
  }
}

export const getColumns = ({ columns, locales }) => (
  columns.map((item, index) => new RenderColumn({ ...item, index, locales }))
);

export default getColumns;
