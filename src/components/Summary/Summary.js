import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Divider, Card } from 'antd';

const Summary = props => {
  const { data } = props;

  return (
    <div>
      <h2>Demande</h2>
      <Divider />

      <Card
        style={{ marginTop: 16 }}
        title="Project"
      >
        <p><strong>Titre</strong></p>
        <p>{data.properties.project.title}</p>

        <p><strong>Description</strong></p>
        <p>{data.properties.project.description}</p>
      </Card>

      <Card
        style={{ marginTop: 16 }}
        title="Address"
      >
        <p><strong>City</strong></p>
        <p>{data.properties.address.city}</p>

        <p><strong>State</strong></p>
        <p>{data.properties.address.state}</p>
      </Card>
    </div>
  );
};

const DispatchToProps = dispatch => bindActionCreators({}, dispatch);

Summary.propTypes = {
  data: PropTypes.shape({
    feature: PropTypes.number,
    organisation: PropTypes.arrayOf(PropTypes.number),
    owner: PropTypes.number,
    state: PropTypes.number,
    properties: PropTypes.object,
  }).isRequired,
};

export default connect(null, DispatchToProps)(Summary);

