import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi/locale";
import { Checkbox, Alert, Icon, Modal, Input} from "antd";
import Login from "@/components/Login";
import styles from "./Login.less";


const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  state = {
    type: "account",
    autoLogin: true,
    phone: null,
    code:null
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(["mobile"], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: "login/getCaptcha",
            payload: values.mobile
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const payload = {
      email: values.userName,
      password: values.password
    };

    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: "login/login",
        payload: {
          ...payload
        },
        onSuccess: phone =>
          this.setState({phone: phone})
          // dispatch({
          //   type: "user/fetchCurrent"
          // })
      });
    }
  };

  handlePhoneVerfication = () => {
    const { code, phone } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "login/phoneVerification",
      payload: {phone: phone, code: code},
      onSuccess: () =>
        dispatch({
          type: "user/fetchCurrent"
        }),
      onFail: () => this.setState({phone: null, code: null})
    });
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  renderMessage = content => (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin, phone, code } = this.state;
    return (
      <div className={styles.main}>
          <Modal
            title="Phone Verification"
            visible={phone}
            onOk={this.handlePhoneVerfication}
            onCancel={() => this.setState({phone: null, code: null})}
          > 
          <p> Verification Code has been sent to {phone} </p>
          <div style={{ textAlign: "center"}}>
            <Input maxLength={4}  style={{ width: "30%"}} onChange={value => 
             this.setState({ code: value.target.value }) 
            }/>  
          </div>
         </Modal> 
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName name="userName" placeholder="your veo email address" />
          <Password
            name="password"
            placeholder="password"
            onPressEnter={() =>
              this.loginForm.validateFields(this.handleSubmit)
            }
          />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: "right" }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
