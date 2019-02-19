import React from 'react';
import PropTypes from 'prop-types';

import TableComponent from './components/Table';
import Header from './components/Header';

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
      PropTypes.func,
    ]),
    locales: PropTypes.shape({
      sortAsc: PropTypes.string,
      sortDesc: PropTypes.string,
    }),
  };

  static defaultProps = {
    title: '',
    locales: {},
  }

  state = {
    columns: [],
    dataFiltered: [],
    columnsFiltered: [],
  }

  componentDidMount () {
    const { data } = this.props;
    this.resetData(data);
  }

  componentDidUpdate ({ data: prevData }) {
    const { data } = this.props;
    if (data !== prevData) {
      this.resetData(data);
    }
  }

  onHeaderChange = ({ event: { target: { checked } }, index }) => {
    const { data } = this.props;
    this.setState(({ columns: prevColumns }) => {
      const columns = prevColumns.map((col, i) => (
        (i !== index)
          ? col
          : {
            ...col,
            display: checked,
          }
      ));
      this.propsFiltered(columns, data);
      return {
        columns,
      };
    });
  }

  propsFiltered = (columns, data = []) => {
    const { dataFiltered, columnsFiltered } = columns.reduce((acc, col, index) => (
      (col.display !== false)
        ? acc
        : {
          ...acc,
          columnsFiltered: [
            ...acc.columnsFiltered.filter((_, i) => (i + acc.count) !== index),
          ],
          dataFiltered: [
            ...acc.dataFiltered.map(item => item.filter((_, i) => (i + acc.count) !== index)),
          ],
          count: acc.count + 1,
        }
    ), { dataFiltered: data, columnsFiltered: columns, count: 0 });

    this.setState({ dataFiltered, columnsFiltered });
  }

  initColumns = data => {
    const { columns: allColumns } = this.props;
    const columns = allColumns.map(col =>
      ((typeof col === 'string')
        ? { value: col, sortable: true, display: true }
        : { display: true, ...col }));
    this.setState({ columns });
    this.propsFiltered(columns, data);
  }

  resetData (data) {
    this.initColumns(data);
  }

  render () {
    const { columns, dataFiltered, columnsFiltered } = this.state;
    const { title, locales: customLocales } = this.props;
    const locales = { ...DEFAULT_LOCALES, ...customLocales };

    return (
      <div className="table">
        <Header title={title} columns={columns} onChange={this.onHeaderChange} />
        <TableComponent
          columns={columnsFiltered}
          data={dataFiltered}
          locales={locales}
        />
      </div>
    );
  }
}

export default Table;
