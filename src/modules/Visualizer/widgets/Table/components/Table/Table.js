import React from 'react';
import PropTypes from 'prop-types';
import {
  Table as BluePrintTable,
} from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

import { getColumns } from './column';
import './styles.scss';

export class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      editable: PropTypes.bool,
      format: PropTypes.shape({ type: PropTypes.string, value: PropTypes.string }),
    }).isRequired).isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  };

  state = {
    sortedIndexMap: null,
  };

  getCellData = (rowIndex, columnIndex) => {
    const { data } = this.props;
    const sortedIndexMap = this.state.sortedIndexMap || data.map((_, k) => k);
    const cell = data[sortedIndexMap[rowIndex]][columnIndex];
    return this.formatCell(cell, columnIndex);
  };

  formatCell = (cell, columnIndex) => {
    const { columns } = this.props;
    const { format: { type } = {} } = columns[columnIndex];
    switch (type) {
      case 'date':
        return new Date(cell).toLocaleDateString();
      default:
        return cell;
    }
  }

  sortColumn = (columnIndex, comparator) => {
    const { data } = this.props;
    const sortedIndexMap = data.map((_, i) => i);
    sortedIndexMap.sort((a, b) => comparator(data[a][columnIndex], data[b][columnIndex]));
    this.setState({ sortedIndexMap });
  };

  render () {
    const { data, columns } = this.props;
    const cols = getColumns(columns)
      .map(col => col.getColumn(this.getCellData, this.sortColumn));

    return (
      <BluePrintTable
        className="component-table"
        numRows={data.length}
      >
        {cols}
      </BluePrintTable>
    );
  }
}

export default Table;
