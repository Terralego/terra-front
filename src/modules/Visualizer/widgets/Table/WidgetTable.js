import React from 'react';
import PropTypes from 'prop-types';

import Table from './components/Table';

export class WidgetTable extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string]))
      .isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  };

  state = {
    columns: [],
    data: this.props.data,
  }

  componentDidMount () {
    this.initColumns();
  }

  initColumns = () => {
    const columns = this.props.columns.map(col =>
      ((typeof col !== 'string')
        ? { display: true, ...col }
        : { label: col, sortable: true, display: true }));
    this.setState({ columns });
  }

  render () {
    const { columns, data } = this.state;
    return (
      <div className="widget-table">
        <Table columns={columns} data={data} />
      </div>
    );
  }
}

export default WidgetTable;
