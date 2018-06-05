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
    this.editForm = this.editForm.bind(this);
  }

  handleAction () {
    this.props.history.push('/manage-request');
  }

  submitForm () {
    this.props.submitData(this.props.data);
  }

  editForm () {
    this.props.history.push('/request');
  }

  render () {
    const { data, form } = this.props;
    return (
      <div>
        <Summary data={data} />

        {!form.valid && <Alert
          style={{ marginTop: 16 }}
          message={form.error}
          description={FormConfig.confirmation.errorText}
          type="error"
          showIcon
        />}
        <div style={{ margin: '24px 0', textAlign: 'right' }}>
          <Button
            size="large"
            onClick={this.editForm}
            style={{ marginRight: 8 }}
          >
            {FormConfig.confirmation.editButton}
          </Button>
          <Button
            type="primary"
            icon="arrow-right"
            size="large"
            onClick={this.submitForm}
            loading={form.pending}
          >
            {FormConfig.confirmation.submitButton}
          </Button>
        </div>

        <Modal
          visible={form.submitted}
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
  data: state.userrequest,
  form: state.forms.userrequest.$form,
});

const DispatchToProps = dispatch => bindActionCreators({ submitData }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(FormProperties));
