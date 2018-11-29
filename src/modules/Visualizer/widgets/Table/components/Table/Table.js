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
    columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string]))
      .isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  };

  state = {
    sortedIndexMap: [],
  };

  getCellData = (rowIndex, columnIndex) => {
    const { data } = this.props;
    const { sortedIndexMap } = this.state;
    return data[sortedIndexMap[rowIndex] || rowIndex][columnIndex];
  };

  sortColumn = (columnIndex, comparator) => {
    const { data } = this.props;
    const sortedIndexMap = data.map((_, i) => i);
    sortedIndexMap.sort((a, b) => comparator(data[a][columnIndex], data[b][columnIndex]));
    this.setState({ sortedIndexMap });
  };

  render () {
    const { data, columns } = this.props;
    const cols = getColumns(columns, data)
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
