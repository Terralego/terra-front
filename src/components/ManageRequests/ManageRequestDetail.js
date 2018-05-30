import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Spin, Row, Col, Card, Select } from 'antd';

import Summary from 'components/Summary/Summary';
import { getUserrequest } from 'modules/userrequestList';
import FormConfig from 'components/Form/Form.config';
import Comments from 'components/Comments/Comments';

const { Option } = Select;

const handleChange = () => {
  // console.log(e);
};

class ManageRequestDetail extends React.Component {
  componentDidMount () {
    if (!this.props.data && !this.props.loading) {
      this.props.getUserrequest(this.props.match.params.id);
    }
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.data !== this.props.data) {
      return true;
    }
    return false;
  }

  render () {
    return (
      <Row gutter={24} style={{ paddingBottom: 24 }}>
        <Col span={24} lg={14}>
          {this.props.data ?
            <Summary data={this.props.data.properties} />
          : <Spin style={{ margin: '30px auto', width: '100%' }} />}
        </Col>

        <Col span={24} lg={10}>
          <Card title="Status">
            <Select defaultValue={0} style={{ width: '100%' }} onChange={handleChange}>
              {FormConfig.status.map(status => (
                <Option key={`status_${status.title}`} value={status.id}>{status.title}</Option>
              ))}
            </Select>
          </Card>

          <Card title="Échanges" style={{ marginTop: 24 }}>
            <Comments userrequestId={this.props.match.params.id} />
          </Card>
        </Col>
      </Row>
    );
  }
}

const StateToProps = (state, ownProps) => ({
  // TODO: use Reselect for increase performances
  data: state.userrequestList.items[ownProps.match.params.id],
  loading: state.userrequestList.loading,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ getUserrequest }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(ManageRequestDetail));
