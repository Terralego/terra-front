import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Divider, Button } from 'antd';
import { Form } from 'react-redux-form';
import FormConfig from 'components/Form/Form.config';

class FormApp extends React.Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  shouldComponentUpdate () {
    return false;
  }

  handleSubmit () {
    this.props.history.push('/request-preview');
  }

  render () {
    return (
      <Form
        model="userrequest"
        onSubmit={userrequest => this.handleSubmit(userrequest)}
      >
        {FormConfig.steps.map(step => (
          <div key={`step_${step.title}`}>
            <h2>{step.title}</h2>
            <Divider />
            <step.component {...this.props} />
          </div>
        ))}

        <Button type="primary" htmlType="submit">Preview your request</Button>
      </Form>
    );
  }
}

const StateToProps = state => ({
  ...state.userrequest,
  form: state.forms.userrequest,
});

const DispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(StateToProps, DispatchToProps)(FormApp);
