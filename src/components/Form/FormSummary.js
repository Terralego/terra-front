import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Button, Modal, Alert } from 'antd';
import Summary from 'components/Summary/Summary';
import FormConfig from 'components/Form/Form.config';
import { submitData } from 'modules/userrequest';


class FormProperties extends React.Component {
  constructor (props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction () {
    this.props.history.push('/manage-request');
  }

  submitForm () {
    this.props.submitData(this.props.data);
  }

  render () {
    const { data, submitted, sent, error } = this.props;
    return (
      <div>
        <Summary data={data.properties} features={data.geojson.features} editabled />

        {error && <Alert
          style={{ marginTop: 16 }}
          message={error}
          description={FormConfig.confirmation.errorText}
          type="error"
          showIcon
        />}
        <div style={{ margin: '24px 0', textAlign: 'right' }}>
          <Button
            type="primary"
            icon="arrow-right"
            size="large"
            onClick={this.submitForm}
            loading={submitted && !sent && !error}
          >
            {FormConfig.confirmation.submitButton}
          </Button>
        </div>

        <Modal
          visible={submitted && sent}
          title={FormConfig.confirmation.modal.title}
          closable={false}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleAction}>
              {FormConfig.confirmation.modal.action}
            </Button>,
          ]}
        >
          {FormConfig.confirmation.modal.text}
        </Modal>
      </div>
    );
  }
}

const StateToProps = state => ({
  data: state.userrequest.data,
  submitted: state.userrequest.submitted,
  error: state.userrequest.error,
  sent: state.userrequest.sent,
});

const DispatchToProps = dispatch => bindActionCreators({ submitData }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(FormProperties));
