import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);
const Content = (props) =>{
  const [form] = Form.useForm()
  form.setFieldsValue(props.currentUser)
  return(
    <Form layout="vertical" onSubmit={props.handleSubmit} hideRequiredMark form={form}>
    <FormItem label="Phone Number"
      name='phone'
      rules={
        [
          {
            required: true                    
          },
        ]
      }
    >
        <Input />
      </FormItem>
      {/* <FormItem label="Username"
        name='username'
        rules={
          [
            {
              required: true,
              message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
            },
          ]
        }
      >
        <Input />
      </FormItem>
      <FormItem label="Last Name"
        name='lastName'
        rules={
          [
            {
              required: true,
              message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
            },
          ]
        }
      >
        <Input />
      </FormItem>
      <FormItem label="First Name"
        name='firstName'
        rules={
          [
            {
              required: true,
              message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
            },
          ]
        }
      >
        <Input />
      </FormItem> */}
      <Button type="primary"  onClick={()=>{props.handleUpdateMe(form.getFieldsValue(true))}}>
        <FormattedMessage
          id="app.settings.basic.update"
          defaultMessage="Update Information"
        />
      </Button>
    </Form>
  )
}
const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser } = this.props;

    // Object.keys(form.getFieldsValue()).forEach(key => {
    //   const obj = {};
    //   obj[key] = currentUser[key] || null;
    //   form.setFieldsValue(obj);
    // });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };


  handleUpdateMe = (fieldsValue) => {
    const { dispatch, currentUser} = this.props;
        dispatch({
          type: "user/updateMe",
          payload: fieldsValue,
          onSuccess: () =>  dispatch({
            type: "user/fetchCurrent",
            onSuccess: this.setBaseInfo
          })
        });
        // form.resetFields();

  }

  render() {
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
        
        </div>
        <Content handleSubmit={this.handleSubmit} handleUpdateMe={this.handleUpdateMe} currentUser={this.props.currentUser} />
        {/*<div className={styles.right}>*/}
          {/*<AvatarView avatar={this.getAvatarURL()} />*/}
        {/*</div>*/}
      </div>
    );
  }
}
const mapStateToProps = ({user}) => {
  return {
    currentUser: user.currentUser,
  }
}
export default connect(mapStateToProps)(BaseView) 