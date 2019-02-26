import React from 'react';
import PropTypes from 'prop-types';

import TableComponent from './components/Table';
import HeaderComponent from './components/Header';

import './styles.scss';

const DEFAULT_LOCALES = {
  sortAsc: 'Order asc',
  sortDesc: 'Order desc',
};

export class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string]))
      .isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
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
  };

  static defaultProps = {
    title: '',
    locales: {},
    Header: HeaderComponent,
    loading: false,
  }

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
    const { Header, title, locales: customLocales, loading } = this.props;
    const locales = { ...DEFAULT_LOCALES, ...customLocales };
    const { filteredColumns, filteredData } = this;

    return (
      <div className="table">
        <Header title={title} columns={columns} onChange={this.onHeaderChange} />
        <TableComponent
          columns={filteredColumns}
          data={filteredData}
          locales={locales}
          loading={loading}
        />
      </div>
    );
  }
}

export default Table;
