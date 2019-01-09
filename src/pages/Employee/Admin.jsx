import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  Steps,
  Radio,
  Divider,
  message,
  Popconfirm
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Admin.less";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const FormItem = Form.Item;
const { Step } = Steps;
const { TextAdmin } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    admins,
    roles
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.confirmPassword !== fieldsValue.password) {
        message.error("password and confirm doesn't match.");
        return;
      }

      fieldsValue.confirmPassword = undefined;

      form.resetFields();

      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width="600px"
    >
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="E-mail">
        {form.getFieldDecorator("email", {
          rules: [
            {
              required: true,
              message: "email is required",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Username"
      >
        {form.getFieldDecorator("username", {
          rules: [
            {
              required: true,
              message: "username is required",
              min: 5
            }
          ]
        })(<Input placeholder="Please Input" />)}
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
              message: "password is required, at least 5 chars",
              min: 5
            }
          ]
        })(<Input placeholder="Please Input" type="password" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Confirm Password"
      >
        {form.getFieldDecorator("confirmPassword", {
          rules: [
            {
              required: true,
              message: "confirm password is required, at least 5 chars",
              min: 5
            }
          ]
        })(<Input placeholder="Please Input" type="password" />)}
      </FormItem>
      <FormItem
        label="Is Activated"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
      >
        {form.getFieldDecorator("activated", {
          rules: [
            {
              required: true,
              message: "Activated is required"
            }
          ]
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>false</Option>
            <Option value={1}>true</Option>
          </Select>
        )}
      </FormItem>
      {roles && (
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Role">
          {form.getFieldDecorator("roleId", {
            rules: [
              {
                required: true,
                message: "Role is required"
              }
            ]
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

const UpdatePasswordForm = Form.create()(props => {
  const {
    updatePasswordModalVisible,
    form,
    handleUpdatePassword,
    handleUpdatePasswordModalVisible,
    record
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.confirmPassword !== fieldsValue.password) {
        message.error("password and confirm doesn't match.");
        return;
      }

      fieldsValue.confirmPassword = undefined;

      form.resetFields();

      handleUpdatePassword(record.id, fieldsValue.password);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Update Password"
      visible={updatePasswordModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdatePasswordModalVisible()}
      width="600px"
    >
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Password"
      >
        {form.getFieldDecorator("password", {
          rules: [
            {
              required: true,
              message: "password is required, at least 5 chars",
              min: 5
            }
          ]
        })(<Input placeholder="Please Input" type="password" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Confirm Password"
      >
        {form.getFieldDecorator("confirmPassword", {
          rules: [
            {
              required: true,
              message: "confirm password is required, at least 5 chars",
              min: 5
            }
          ]
        })(<Input placeholder="Please Input" type="password" />)}
      </FormItem>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    areas,
    roles,
    record
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleUpdate(record.id, fieldsValue);
      });
    else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Last Name"
      >
        {form.getFieldDecorator("lastName", {
          rules: [
            {
              required: true,
              message: "Last Name is required",
              min: 1
            }
          ],
          initialValue: record.lastName
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="First Name"
      >
        {form.getFieldDecorator("firstName", {
          rules: [
            {
              required: true,
              message: "First Name is required",
              min: 1
            }
          ],
          initialValue: record.firstName
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="E-mail">
        {form.getFieldDecorator("email", {
          rules: [
            {
              required: true,
              message: "email is required",
              min: 1
            }
          ],
          initialValue: record.email
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Username"
      >
        {form.getFieldDecorator("username", {
          rules: [
            {
              required: true,
              message: "username is required",
              min: 1
            }
          ],
          initialValue: record.username
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      {roles && (
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Role">
          {form.getFieldDecorator("roleId", {
            rules: [
              {
                required: true,
                message: "Role is required"
              }
            ],
            initialValue: record.roleId
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
      {areas && (
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="Areas"
        >
          {form.getFieldDecorator("areaIds", {
            rules: [
              {
                required: true,
                message: "area is required"
              }
            ],
            initialValue: record.areaIds
          })(
            <Select
              placeholder="select"
              style={{ width: "100%" }}
              mode="multiple"
            >
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
      <FormItem
        label="Is Activated"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
      >
        {form.getFieldDecorator("activated", {
          rules: [
            {
              required: true,
              message: "Activated is required"
            }
          ],
          initialValue: record.activated ? 1 : 0
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>false</Option>
            <Option value={1}>true</Option>
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ admins, roles, areas, loading }) => ({
  admins: admins.data,
  roles: roles.data,
  areas: areas.data,
  loading: loading.models.admins && loading.models.roles && loading.models.areas
}))
@Form.create()
class Admin extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {},
    updatePasswordModalVisible: false
  };

  columns = [
    {
      title: "Name",
      dataIndex: "lastName",
      render: (text, record) => (
        <span>{`${record.firstName ? record.firstName : ""} ${
          record.lastName ? record.lastName : ""
        }`}</span>
      )
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Is Activated",
      dataIndex: "activated",
      render: (text, record) => (record.activated ? "true" : "false")
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => <span>{this.getRoleNameById(record.roleId)}</span>
    },
    {
      title: "Areas",
      dataIndex: "area",
      render: (text, record) => (
        <Fragment>{this.getNameByAreaIds(record.areaIds)}</Fragment>
      )
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          {authority.includes("update.admin.detail") &&
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>
          }

          <Divider type="vertical" />


          {authority.includes("update.admin.password") &&
            <a
              href="#"
              onClick={() => this.handleUpdatePasswordModalVisible(true, record)}
            >
              Update Password
            </a>
          }


          <Divider type="vertical" />

          {authority.includes("delete.admin") &&
            <Popconfirm
              title="Are you Sure？"
              icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
              onConfirm={() => this.handleDelete(record.id)}
            >
              <a href="#" style={{ color: "red" }}>
                Delete
              </a>
            </Popconfirm>
          }

        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetAdmins();
    this.handleGetRoles();
    this.handleGetAreas();
  }

  getRoleNameById = roleId => {
    if (this.props.roles.length === 0) return "";
    else return this.props.roles.filter(role => role.id === roleId)[0].name;
  };

  handleDelete = adminId => {
    const { dispatch } = this.props;

    dispatch({
      type: "admins/remove",
      id: adminId,
      onSuccess: this.handleGetAdmins
    });
  };

  getNameByAreaIds = areaIds => {
    if (this.props.areas.length === 0) return "";
    else if (this.props.areas.length === areaIds.length) return "all";
    else
      return this.props.areas
        .filter(area => areaIds.includes(area.id))
        .map(area => (
          <span key={area.id}>
            {area.name} <Divider type="vertical" />
          </span>
        ));
  };

  handleGetRoles = () => {
    const { dispatch } = this.props;

    dispatch({
      type: "roles/get",
      payload: {}
    });
  };

  handleGetAdmins = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "admins/get",
      payload: filterCriteria
    });
  };

  handleGetAreas = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "areas/get",
      payload: filterCriteria
    });
  };

  handleStandardTableChange = (filtersArg, sorter) => {
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params }, () => this.handleGetAdmins());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetAdmins()
    );
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = Object.assign({}, filterCriteria, fieldsValue);

      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetAdmins()
      );
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleUpdatePasswordModalVisible = (flag, record) => {
    this.setState({
      updatePasswordModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: "admins/add",
      payload: fields,
      onSuccess: this.handleGetAdmins
    });

    //message.success("Add Success!");
    this.handleModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "admins/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetAdmins
    });

    this.handleUpdateModalVisible();
  };

  handleUpdatePassword = (id, password) => {
    const { dispatch } = this.props;

    dispatch({
      type: "admins/updatePassword",
      id: id,
      newPassword: password
    });

    this.handleUpdatePasswordModalVisible();
  };

  render() {
    const { admins, loading, roles, areas } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord,
      updatePasswordModalVisible
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    const updatePasswordMethods = {
      handleUpdatePasswordModalVisible: this.handleUpdatePasswordModalVisible,
      handleUpdatePassword: this.handleUpdatePassword
    };

    return (
      <PageHeaderWrapper title="Admin List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {authority.includes("add.admin") &&
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  Add
                </Button>
              }

            </div>
            <StandardTable
              scroll={{ x: 1300 }}
              loading={loading}
              data={{ list: admins, pagination: {} }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          admins={admins}
          roles={roles}
          areas={areas}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          admins={admins}
          roles={roles}
          areas={areas}
        />

        <UpdatePasswordForm
          {...updatePasswordMethods}
          updatePasswordModalVisible={updatePasswordModalVisible}
          record={selectedRecord}
          admins={admins}
          roles={roles}
          areas={areas}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Admin;
