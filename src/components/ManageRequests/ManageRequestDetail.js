import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Spin, Row, Col, Card } from 'antd';

import Summary from 'components/Summary/Summary';
import { getUserrequest } from 'modules/userrequestList';
import RequestStatus from 'components/RequestStatus/RequestStatus';
import Comments from 'components/Comments/Comments';

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
            <Summary data={this.props.data} />
          : <Spin style={{ margin: '30px auto', width: '100%' }} />}
        </Col>

        <Col span={24} lg={10}>
          {this.props.data && <RequestStatus status={this.props.data.state} />}
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
