import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Divider, Card, Button } from 'antd';
import { updateRequestValue } from 'modules/userRequest';

const Summary = props => {
  const { properties } = props;

  const gotToStep = step => {
    props.updateRequestValue('step', step);
  };

  return (
    <div>
      <h2>Demande</h2>
      <Divider />

      <Card style={{ marginTop: 16 }} title="Nom" extra={<Button icon="edit" onClick={() => gotToStep(0)}>Modifier</Button>}>
        <p><strong>Nom</strong></p>
        <p>{properties.name}</p>

        <p><strong>Prénom</strong></p>
        <p>{properties.firstName}</p>
      </Card>
    </div>
  );
};

const StateToProps = state => ({
  properties: state.userRequest.properties,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRequestValue,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(Summary);

