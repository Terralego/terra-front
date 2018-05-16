import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Summary from 'components/Summary/Summary';

const FormProperties = props => <Summary data={props.properties} />;

const StateToProps = state => ({
  properties: state.userRequest.data.properties,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(FormProperties);
