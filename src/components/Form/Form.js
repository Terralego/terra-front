import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Steps } from 'antd';

import { updateRequestValue } from 'modules/userRequest';
import steps from 'components/Form/Form-steps';

const { Step } = Steps;

const FormApp = props => {
  const { currentStep } = props;

  const handleClick = step => {
    if (step < currentStep) {
      props.updateRequestValue('formStep', step);
    }
  };

  const stepStyle = step => ({
    cursor: step < currentStep ? 'pointer' : 'default',
  });

  return (
    <Row gutter={24}>
      <Col span={24}>
        <div>
          <Steps className="steps" size="small" current={currentStep} style={{ margin: '10px 0 36px' }}>
            {steps.map(step => (
              <Step key={`step_${step.index}`} title={step.title} onClick={() => handleClick(step.index)} style={stepStyle(step.index)} />
            ))}
          </Steps>
        </div>
      </Col>
      <Col span={24}>
        <div>
          { steps[currentStep].component }
        </div>
      </Col>
    </Row>
  );
};

const StateToProps = state => ({
  currentStep: state.userRequest.formStep,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRequestValue,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(FormApp);
