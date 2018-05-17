import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import Summary from 'components/Summary/Summary';
import { getUserRequestList } from 'modules/userRequestList';

const ManageRequestDetail = props => {
  if (props.data) {
    return <Summary data={props.data.properties} />;
  }
  return <Spin />;
};

const StateToProps = (state, ownProps) => ({
  // TODO: use Reselect for increase performances
  data: state.userRequestList.items[ownProps.match.params.id],
});

const DispatchToProps = dispatch =>
  bindActionCreators({ getUserRequestList }, dispatch);

export default connect(StateToProps, DispatchToProps)(ManageRequestDetail);
