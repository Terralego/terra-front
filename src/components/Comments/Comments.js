import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, Card, Input } from 'antd';
import moment from 'moment';
import { fetchUserRequestComments, getCommentsByUserrequest } from 'modules/userRequestComments';

const { TextArea } = Input;

class Comments extends React.Component {
  componentDidMount () {
    this.props.fetchUserRequestComments(this.props.userrequestId);
  }

  render () {
    const { comments, loading } = this.props;

    return (
      <div>
        <TextArea rows={4} placeholder="Entrez votre message..." />
        {loading
        ? <Spin style={{ margin: '24px auto', width: '100%' }} />
        : comments.map(comment => (
          <Card key={`comment_${comment.content}`} style={{ marginTop: 24 }}>
            {comment.content}
            <Card.Meta
              style={{ textAlign: 'right' }}
              description={moment(comment.date).format('DD/MM/YYYY à hh:mm')}
            />
          </Card>
        ))}
      </div>
    );
  }
}

const StateToProps = (state, props) => ({
  // TODO: use Reselect for increase performances
  comments: getCommentsByUserrequest(state, props.userrequestId),
  loading: state.userRequestComments.loading,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ fetchUserRequestComments }, dispatch);

export default connect(StateToProps, DispatchToProps)(Comments);
