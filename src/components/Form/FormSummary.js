import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Button, Modal } from 'antd';
import Summary from 'components/Summary/Summary';
import FormConfig from 'components/Form/Form.config';
import { submitData } from 'modules/userRequest';

const handleAction = () => {
  window.location.pathname = '/gestion-demandes';
};

class FormProperties extends React.Component {
  constructor (props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm () {
    this.props.submitData(this.props.data);
  }

  render () {
    return (
      <div>
        <Summary data={this.props.data.properties} />

        <div style={{ margin: '24px 0', textAlign: 'right' }}>
          <Button
            type="primary"
            icon="arrow-right"
            size="large"
            onClick={this.submitForm}
          >
            {FormConfig.confirmation.submitButton}
          </Button>
        </div>

        <Modal
          visible={this.props.submitted}
          title={FormConfig.confirmation.modal.title}
          closable={false}
          footer={[
            <Button key="submit" type="primary" onClick={handleAction}>
              {FormConfig.confirmation.modal.actions}
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
  data: state.userRequest.data,
  submitted: state.userRequest.submitted,
  error: state.userRequest.error,
});

const DispatchToProps = dispatch => bindActionCreators({ submitData }, dispatch);

export default connect(StateToProps, DispatchToProps)(FormProperties);
