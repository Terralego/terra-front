import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import Summary from 'components/Summary/Summary';
import FormConfig from 'components/Form/Form.config';

class FormProperties extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  showModal () {
    this.setState({
      visible: true,
    });
  }

  handleOk () {
    setTimeout(() => {
      this.setState({ visible: false });
    }, 3000);
  }

  handleCancel () {
    this.setState({ visible: false });
  }

  render () {
    return (
      <div>
        <Summary data={this.props.properties} />

        <div style={{ margin: '24px 0', textAlign: 'right' }}>
          <Button
            type="primary"
            icon="arrow-right"
            size="large"
            onClick={this.showModal}
          >
            {FormConfig.confirmation.submitButton}
          </Button>
        </div>

        <Modal
          visible={this.state.visible}
          title={FormConfig.confirmation.modal.title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              {FormConfig.confirmation.modal.actions.cancel}
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              {FormConfig.confirmation.modal.actions.submit}
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
  properties: state.userRequest.data.properties,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(FormProperties);
