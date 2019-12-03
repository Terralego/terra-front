import React from 'react';
import PropTypes from 'prop-types';

import TableComponent from './components/Table';
import HeaderComponent from './components/Header';

import './styles.scss';

const DEFAULT_LOCALES = {
  sortAsc: 'Order asc',
  sortDesc: 'Order desc',
  displayAllColumns: 'Display all columns',
  hideAllColumns: 'Hide all columns',
};

export class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string]))
      .isRequired,
    data: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    ).isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    Header: PropTypes.func,
    locales: PropTypes.shape({
      sortAsc: PropTypes.string,
      sortDesc: PropTypes.string,
    }),
    loading: PropTypes.bool,
    initialSort: PropTypes.shape({
      columnIndex: PropTypes.number.isRequired,
      asc: PropTypes.bool,
    }),
    onSort: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    locales: {},
    Header: HeaderComponent,
    loading: false,
    initialSort: {
      columnIndex: 0,
      asc: true,
    },
    onSort () {},
  };

  state = {
    columns: [],
  }

  componentDidMount () {
    const { columns } = this.props;
    this.resetColumns(columns);
  }

  componentDidUpdate ({ columns: prevColumns }) {
    const { columns } = this.props;
    if (columns !== prevColumns) {
      this.resetColumns(columns);
    }
  }

  get filteredColumns () {
    const { columns } = this.state;

    return columns.filter(({ display }) => display);
  }

  get filteredData () {
    const { data } = this.props;
    const { columns } = this.state;

    return data.map(line => line.reduce((cells, cell, k) => (
      (columns[k] || {}).display
        ? [...cells, cell]
        : cells
    ), []));
  }

  onHeaderChange = ({ event: { target: { checked } }, index }) => {
    this.setState(({ columns: prevColumns }) => {
      const columns = prevColumns.map((col, i) => (
        (i !== index)
          ? col
          : {
            ...col,
            display: checked,
          }
      ));
      return {
        columns,
      };
    });
  }

  resetColumns = columns => {
    const safeColumns = columns.map(col => (
      typeof col === 'string'
        ? { value: col, sortable: true, display: true }
        : { display: true, ...col }));
    this.setState({ columns: safeColumns });
  }

  render () {
    const { columns } = this.state;
    const {
      Header,
      title,
      locales: customLocales,
      loading,
      initialSort,
      columnWidths,
      ...rest
    } = this.props;
    const locales = { ...DEFAULT_LOCALES, ...customLocales };
    const { filteredColumns, filteredData } = this;

    const columnWidthsProp = columnWidths && columnWidths.length === filteredColumns.length
      ? { columnWidths }
      : {};

    return (
      <div className="table">
        <Header title={title} columns={columns} onChange={this.onHeaderChange} locales={locales} />
        <TableComponent
          {...rest}
          {...columnWidthsProp}
          columns={filteredColumns}
          data={filteredData}
          locales={locales}
          loading={loading}
          initialSort={initialSort}
        />
      </div>
    );
  }
}

export default Table;
