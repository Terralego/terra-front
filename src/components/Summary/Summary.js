import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Divider, Card, Button } from 'antd';
import { updateRequestValue } from 'modules/userRequest';

const Summary = props => {
  const { data, editabled } = props;

  const gotToStep = step => {
    props.updateRequestValue('formStep', step);
  };

  return (
    <div>
      <h2>Demande</h2>
      <Divider />

      <Card
        style={{ marginTop: 16 }}
        title="Titre"
        extra={editabled && <Button icon="edit" onClick={() => gotToStep(0)}>Modifier</Button>}
      >
        <p><strong>Titre</strong></p>
        <p>{data.title}</p>

        <p><strong>Description</strong></p>
        <p>{data.description}</p>
      </Card>
    </div>
  );
};

const DispatchToProps = dispatch =>
  bindActionCreators({ updateRequestValue }, dispatch);

Summary.propTypes = {
  editabled: PropTypes.bool,
  data: PropTypes.shape({
    feature: PropTypes.number,
    organisation: PropTypes.arrayOf(PropTypes.number),
    owner: PropTypes.number,
    state: PropTypes.number,
    properties: PropTypes.object,
  }).isRequired,
};

Summary.defaultProps = {
  editabled: false,
};

export default connect(null, DispatchToProps)(Summary);

