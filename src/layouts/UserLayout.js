import React, { Fragment } from "react";
import { formatMessage } from "umi/locale";
import { connect } from "dva";
import Link from "umi/link";
import { Icon,Form, Input, Button, Checkbox,message } from "antd";
import GlobalFooter from "@/components/GlobalFooter";
import SelectLang from "@/components/SelectLang";
import styles from "./UserLayout.less";
import logo from "../assets/veo_black.png";

const links = [
  {
    key: "help",
    title: formatMessage({ id: "layout.user.link.help" }),
    href: ""
  },
  {
    key: "privacy",
    title: formatMessage({ id: "layout.user.link.privacy" }),
    href: ""
  },
  {
    key: "terms",
    title: formatMessage({ id: "layout.user.link.terms" }),
    href: ""
  }
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> brought to you by VeoRide 2018
  </Fragment>
);

class UserLayout extends React.PureComponent {
  state = {
    type: "account",
    autoLogin: true,
    phone: null,
    code:null,
    PhoneVerficationEnabled:false,
  };
  render() {
    const { children } = this.props;
    console.log(this.codeCursor);
    // this.codeCursor.focus({
    //   cursor: '',
    // })
    const onFinish = (values) => {
      const { dispatch } = this.props;
      if(!values.code){
        const payload = {
          email: values.email,
          password: values.password
        };
          dispatch({
            type: "login/login",
            payload: {
              ...payload
            },
            onSuccess: (phone) =>{
              this.setState({phone: phone})
              this.setState({PhoneVerficationEnabled: true})
              message.success('Phone Verification sent to'+phone);
            }
          })
      }else{
        dispatch({
          type: "login/phoneVerification",
          payload: {phone: this.state.phone, code: values.code},
          onSuccess: () =>
            dispatch({
              type: "user/fetchCurrent"
            }),
          onFail: () => this.setState({phone: null, code: null,PhoneVerficationEnabled:false})
        });
      }
    };
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
               
              </Link>
            </div>
            <div className={styles.desc}>Management System</div>
          </div>
          {/* {children} */}
          
          <Form
      name="basic"
      labelCol={{
        span: 10,
      }}
      wrapperCol={{
        span: 4,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="user name"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder='your email address'/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder='your password'/>
      </Form.Item>
      {
        this.state.PhoneVerficationEnabled&&
        <Form.Item
        label="Phone Verification"
        name="code"
        rules={[
          {
            required: true,
            message: 'Please input your Phone Verification!',
          },
        ]}
      >
        <Input placeholder='Please input your Phone Verification!' ref={c=>this.codeCursor=c}/>
      </Form.Item>
      }
      {/* <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

      <Form.Item
        wrapperCol={{
          offset: 10,
          span: 1,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>


        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default connect()(UserLayout) 