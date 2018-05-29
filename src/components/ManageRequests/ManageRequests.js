import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { List, Spin } from 'antd';
import moment from 'moment';

import { getUserRequestList } from 'modules/userRequestList';

class ManageRequests extends React.Component {
  componentDidMount () {
    this.props.getUserRequestList();
  }

  render () {
    // TODO : find a better solution
    // Here all requests are always loaded, even on detail page
    if (this.props.location.pathname.indexOf('detail') !== -1) {
      return null;
    }

    return (
      <div>
        <h1>Demandes de validation</h1>
        <List
          dataSource={this.props.items}
          renderItem={item => (
            <List.Item key={`userrequest_${item.id}`}>
              <List.Item.Meta
                title={<Link to={`/manage-request/detail/${item.id}`}>{item.properties.title}</Link>}
                description={item.properties.description}
              />
              <div>
                {item.properties.eventDateType === 'day' &&
                <p>Le {moment(item.properties.eventStartDate).format('DD/MM/YYYY')}</p>}
                {item.properties.eventDateType === 'period' &&
                <p>
                  Du {moment(item.properties.eventStartDate).format('DD/MM/YYYY')} au {moment(item.properties.eventEndDate).format('DD/MM/YYYY')}
                </p>}
              </div>
            </List.Item>
          )}
        />
        {this.props.loading && (
          <div className="demo-loading-container">
            <Spin />
          </div>
        )}
      </div>
    );
  }
}

const StateToProps = state => ({
  // TODO: use Reselect for increase performances
  items: Object.keys(state.userRequestList.items).map(key => state.userRequestList.items[key]),
  loading: state.userRequestList.loading,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserRequestList,
    },
    dispatch,
  );

export default withRouter(connect(StateToProps, DispatchToProps)(ManageRequests));
