import React from 'react';
import PropTypes from 'prop-types';
import {
  Table as BluePrintTable,
  TableLoadingOption,
} from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

import { getColumns } from './column';
import { getRows } from '../../tableUtils';
import './styles.scss';

export const LOADING_ROWS_LEN = 100;
export const LOADING_COLS = Array.from({ length: 10 }, () => ({
  label: '',
}));
export const LOADING_DATA =
  Array.from({ length: LOADING_ROWS_LEN }, () =>
    Array.from({ length: LOADING_COLS.length }, () => ''));
const LOADING_OPTIONS = [
  TableLoadingOption.CELLS,
  TableLoadingOption.COLUMN_HEADERS,
  TableLoadingOption.ROW_HEADERS,
];
export class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string.isRequired,
      display: PropTypes.bool,
      sortable: PropTypes.bool,
      editable: PropTypes.bool,
      format: PropTypes.shape({ type: PropTypes.string }),
    }).isRequired).isRequired,
    data: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    ).isRequired,
    onSelection: PropTypes.func,
    initialSort: PropTypes.shape({
      columnIndex: PropTypes.number.isRequired,
      asc: PropTypes.bool,
    }),
    renderCell: PropTypes.func,
    onSort: PropTypes.func,
  };

  static defaultProps = {
    onSelection () {},
    initialSort: {
      columnIndex: 0,
      asc: true,
    },
    renderCell: ({ children }) => children,
    onSort () {},
  };

  state = {
    sortedIndexMap: null,
    lastSort: [],
  };

  componentDidUpdate ({ data: prevData }) {
    const { data } = this.props;
    const { lastSort } = this.state;
    if (data !== prevData) {
      this.sortColumn(...lastSort);
    }
  }

  get columns () {
    const { columns, loading } = this.props;
    return loading ? LOADING_COLS : columns;
  }

  get data () {
    const { data, loading } = this.props;
    return loading ? LOADING_DATA : data;
  }

  get defaultColumnIndex () {
    const { initialSort: { columnIndex } } = this.props;
    return columnIndex;
  }

  get defaultOrder () {
    const { initialSort: { asc } } = this.props;
    return asc ? 'asc' : 'desc';
  }

  getCellData = (rowIndex, columnIndex) => {
    const { data } = this;
    const { sortedIndexMap: initialSortedIndexMap } = this.state;
    const sortedIndexMap = initialSortedIndexMap || data.map((_, k) => k);

    if (sortedIndexMap.length === data.length) {
      const cell = data[sortedIndexMap[rowIndex]][columnIndex];
      return this.formatCell(cell, columnIndex);
    }

    const cell = data[rowIndex][columnIndex];
    return this.formatCell(cell, columnIndex);
  };

  formatCell = (cell, columnIndex) => {
    const { columns } = this;
    const { format: { type } = {} } = columns[columnIndex];
    switch (type) {
      case 'date':
        return new Date(cell).toLocaleDateString();
      case 'number':
        return Number(cell);
      case 'integer':
        return Number.parseInt(cell, 10);
      default:
        return cell;
    }
  }

  sortColumn = (columnIndex = this.defaultColumnIndex, order = this.defaultOrder) => {
    const { data, columns, onSort } = this.props;
    onSort({ columnIndex, order });

    if (!columns.length) {
      return;
    }
    const { format: { type } = {} } = columns[columnIndex];
    const sortedIndexMap = data.map((_, i) => i);
    sortedIndexMap.sort((a, b) => {
      const orderA = order === 'asc' ? a : b;
      const orderB = order === 'asc' ? b : a;
      return this.compare(data[orderA][columnIndex], data[orderB][columnIndex], type);
    });
    this.setState({
      lastSort: [columnIndex, order],
      sortedIndexMap,
    });
  };

  compare = (a, b, type) => {
    switch (type) {
      case 'number':
      case 'integer':
        return a - b;
      case 'date':
        return new Date(a) - new Date(b);
      default:
        return `${a}`.localeCompare(b);
    }
  }

  onSelection = selection => {
    const { data, onSelection } = this.props;
    const { sortedIndexMap } = this.state;
    const rows = getRows(selection, data);
    const realRows = sortedIndexMap
      ? rows.map(row => sortedIndexMap[row])
      : rows;
    onSelection(realRows);
  };

  render () {
    const { locales, loading, renderCell } = this.props;
    const { sortedIndexMap } = this.state;
    const { columns, data, onSelection } = this;
    const cols = getColumns({ columns, locales })
      .map(col => col.getColumn(this.getCellData, this.sortColumn, renderCell, sortedIndexMap));
    return (
      <BluePrintTable
        className="component-table"
        numRows={data.length}
        loadingOptions={loading
          ? LOADING_OPTIONS
          : undefined}
        onSelection={onSelection}
      >
        {cols}
      </BluePrintTable>
    );
  }
}

export default Table;
