import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, Input, Form, List, Button } from 'antd';
import moment from 'moment';
import {
  fetchUserRequestComments,
  getCommentsByUserrequest,
  submitComment,
} from 'modules/userRequestComments';

const { TextArea } = Input;
const FormItem = Form.Item;

class Comments extends React.Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    this.props.fetchUserRequestComments(this.props.userrequestId);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitComment(this.props.userrequestId, values.comment);
      }
    });
  }

  render () {
    const { comments, loading } = this.props;
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          style={{ marginBottom: 12 }}
          validateStatus=""
        >
          {getFieldDecorator('comment', {
            rules: [{ required: true, message: 'Veuillez écrire un message' }],
          })(<TextArea rows={4} placeholder="Entrez votre message..." />)}
        </FormItem>
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={getFieldError('comment') || !isFieldTouched('comment')}
            icon="arrow-right"
          >
            Envoyer
          </Button>
        </div>

        {loading
        ? <Spin style={{ margin: '24px auto', width: '100%' }} />
        : <List
          style={{ marginTop: 24 }}
          dataSource={comments}
          renderItem={comment => (
            <List.Item key={`comment_${comment.content}`}>
              <List.Item.Meta
                title="Administrateur ONF"
                description={comment.content}
                style={{ marginBottom: 16 }}
              />
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', color: 'rgba(0, 0, 0, 0.45)' }}>
                  {moment(comment.date).format('DD/MM/YY')}
                </span>
                <span style={{ display: 'block', color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
                  {moment(comment.date).format('HH[h]mm')}
                </span>
              </div>
            </List.Item>
          )}
        />}
      </Form>
    );
  }
}

Comments.propTypes = {
  userrequestId: PropTypes.string.isRequired,
};

const FormComments = Form.create()(Comments);

const StateToProps = (state, props) => ({
  comments: getCommentsByUserrequest(state, props.userrequestId),
  loading: state.userRequestComments.loading,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ fetchUserRequestComments, submitComment }, dispatch);

export default connect(StateToProps, DispatchToProps)(FormComments);
