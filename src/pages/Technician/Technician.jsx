import React, { PureComponent } from "react";
import { connect } from "dva";
import moment from "moment";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { Button, Form, Modal, Card, Input } from "antd";

const FormItem = Form.Item;

const PhoneRegisterForm = Form.create()(props => {
  const { modalVisible, form, handleSubmit, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();

      handleSubmit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="Register Technician By Phone"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width="600px"
    >
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="First Name"
      >
        {form.getFieldDecorator("firstName", {
          rules: [
            {
              required: true,
              message: "First Name can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="First Name" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Last Name"
      >
        {form.getFieldDecorator("lastName", {
          rules: [
            {
              required: true,
              message: "Last Name can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="Last Name" />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Email">
        {form.getFieldDecorator("email", {
          rules: [
            {
              required: true,
              message: "Email can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="Email" />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Phone">
        {form.getFieldDecorator("phoneNumber", {
          rules: [
            {
              required: true,
              message: "Phone can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="Phone Number" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Password"
      >
        {form.getFieldDecorator("password", {
          rules: [
            {
              required: true,
              message: "Password can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="Password" type="password" />)}
      </FormItem>
    </Modal>
  );
});

@connect()
@Form.create()
class Technician extends PureComponent {
  state = {
    registerPhoneModalVisible: false
  };

  handlePhoneRegisterModalVisible = flag => {
    this.setState({
      registerPhoneModalVisible: !!flag
    });
  };

  handlePhoneRegister = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: "technicians/add",
      payload: fields,
      onSuccess: () => {}
    });

    this.handlePhoneRegisterModalVisible();
  };

  render() {
    const { registerPhoneModalVisible } = this.state;

    const phoneRegisterMethods = {
      handleModalVisible: this.handlePhoneRegisterModalVisible,
      handleSubmit: this.handlePhoneRegister
    };

    return (
      <PageHeaderWrapper title="Technician List">
        <Card bordered={false}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handlePhoneRegisterModalVisible(true)}
            style={{ marginLeft: "0.5em" }}
          >
            Add Technician
          </Button>
          <PhoneRegisterForm
            {...phoneRegisterMethods}
            modalVisible={registerPhoneModalVisible}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Technician;
