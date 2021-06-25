import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {UpdatePasswordForm} from "../../Employee/Admin";
import { List,Form,Modal,Input } from 'antd';
import { connect } from "dva";
import FormItem from "antd/lib/form/FormItem";

// import { getTimeDistance } from '@/utils/utils';

const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};
class SecurityView extends Component {
  state = {
    updatePasswordModalVisible: false,
  };

  handleUpdatePasswordModalVisible = (flag) => {
    this.setState({
      updatePasswordModalVisible: !!flag
    });
  };

  handleUpdatePassword = (id, password) => {
    const { dispatch } = this.props;

    dispatch({
      type: "user/updatePassword",
      newPassword: password,
      onSuccess: () =>  dispatch({
        type: 'login/logout',
      })
    });

    this.handleUpdatePasswordModalVisible();
  };

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a onClick={() => this.handleUpdatePasswordModalVisible(true)}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    }
  ];

  render() {
    const {updatePasswordModalVisible} = this.state;

    const updatePasswordMethods = {
      handleUpdatePasswordModalVisible: this.handleUpdatePasswordModalVisible,
      handleUpdatePassword: this.handleUpdatePassword
    };
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />

        <UpdatePasswordForm
          {...updatePasswordMethods}
          updatePasswordModalVisible={updatePasswordModalVisible}
        />
      </Fragment>
    );
  }
}
const mapStateToProps = ({user}) => {
  return {
    currentUser: user.currentUser,
  }
}
export default connect(mapStateToProps)(SecurityView) 