import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from 'antd';
import moment from 'moment';

import { getUserRequestList } from 'modules/userRequestList';

class ManageRequest extends React.Component {
  componentDidMount () {
    this.props.getUserRequestList();
  }

  render () {
    return (
      <div>
        <h1>Demandes de validation</h1>

        {this.props.items.map(userrequest => (
          <Card key={`userrequest_${userrequest.id}`} style={{ marginTop: 16 }} title={userrequest.properties.title}>
            {userrequest.properties.eventDateType === 'day' &&
            <p>Le {moment(userrequest.properties.eventStartDate).format('DD/MM/YYYY')}</p>}
            {userrequest.properties.eventDateType === 'period' &&
            <p>
              Du {moment(userrequest.properties.eventStartDate).format('DD/MM/YYYY')} au {moment(userrequest.properties.eventEndDate).format('DD/MM/YYYY')}
            </p>}
            <p>{userrequest.properties.description}</p>
          </Card>
        ))
        }
      </div>
    );
  }
}

const StateToProps = state => ({
  items: state.userRequestList.items,
  loading: state.userRequestList.loading,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserRequestList,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(ManageRequest);
