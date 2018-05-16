import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Divider, Card, Button } from 'antd';
import { updateRequestValue } from 'modules/userRequest';

const Summary = props => {
  const { data } = props;

  const gotToStep = step => {
    props.updateRequestValue('step', step);
  };

  return (
    <div>
      <h2>Demande</h2>
      <Divider />

      <Card style={{ marginTop: 16 }} title="Titre" extra={<Button icon="edit" onClick={() => gotToStep(0)}>Modifier</Button>}>
        <p><strong>Titre</strong></p>
        <p>{data.title}</p>

        <p><strong>Description</strong></p>
        <p>{data.description}</p>
      </Card>
    </div>
  );
};

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRequestValue,
    },
    dispatch,
  );

export default connect(null, DispatchToProps)(Summary);

