import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Steps } from 'antd';

import { updateRequestValue } from 'modules/userrequest';
import FormConfig from 'components/Form/Form.config';

const { Step } = Steps;

const FormApp = props => {
  const { formStep } = props;

  const handleClick = step => {
    if (step < formStep) {
      props.updateRequestValue('formStep', step);
    }
  };

  const stepStyle = step => ({
    cursor: step < formStep ? 'pointer' : 'default',
  });

  const Component = FormConfig.steps[formStep].component;

  return (
    <Row gutter={24}>
      <Col span={24}>
        <div>
          <Steps className="steps" size="small" current={formStep} style={{ margin: '10px 0 36px' }}>
            {FormConfig.steps.map(step => (
              <Step key={`step_${step.index}`} title={step.title} onClick={() => handleClick(step.index)} style={stepStyle(step.index)} />
            ))}
          </Steps>
        </div>
      </Col>
      <Col span={24}>
        <Component {...props} editabled />
      </Col>
    </Row>
  );
};

const StateToProps = state => ({
  ...state.userrequest,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRequestValue,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(FormApp);
