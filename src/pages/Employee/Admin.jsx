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
  Tag,
  Divider,
  message,
  Popconfirm
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Admin.less";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const superAdminId = 1;
const { Search } = Input;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextAdmin } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const isVeoRideEmail = (rule, value, callback) => {
  const splitEmail = value.split("@");
  if (splitEmail.length === 2 && splitEmail[1] === "veoride.com") {
    callback();
    return;
  }
  callback("Credit Must be Number!");
};

const EmailRegisterForm = Form.create()(props => {
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
      title="Register by Email"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="VeoRide Email"
      >
        {form.getFieldDecorator("email", {
          rules: [
            {
              required: true,
              message: "email cant be empty.",
              min: 5
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="VeoRide Phone"
      >
        {form.getFieldDecorator("phone", {
          rules: [
            {
              required: true,
              message: "phone cant be empty.",
              min: 5
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="VeoRide Name"
      >
        {form.getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "name cant be empty.",
              min: 2
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
    </Modal>
  );
});

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

      if (fieldsValue.areaIds.includes("all")) {
        fieldsValue.areaIds = areas.map(area => area.id);
      }

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
              {roles.map(role => {
                if (role.id === superAdminId) return;
                else
                  return (
                    <Option key={role.id} value={role.id}>
                      {" "}
                      {role.name}{" "}
                    </Option>
                  );
              })}
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

export const UpdatePasswordForm = Form.create()(props => {
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

      handleUpdatePassword(record ? record.id : null, fieldsValue.password);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Update Password"
      visible={updatePasswordModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdatePasswordModalVisible()}
      width="700px"
    >
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="New Password"
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
        label="Confirm New Password"
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
  console.log(record);
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        if (fieldsValue.areaIds.includes("all")) {
          fieldsValue.areaIds = areas.map(area => area.id);
        }

        handleUpdate(record.id, fieldsValue);
      });
    else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="update admins"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
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
        label="name"
      >
        {form.getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "username is required",
              whitespace: false,
              min: 1
            }
          ],
          initialValue: record.name
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="phone"
      >
        {form.getFieldDecorator("phone", {
          rules: [
            {
              required: true,
              message: "phone is required",
              min: 1
            }
          ],
          validateTrigger: 'onBlur',
          initialValue: record.phone
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      {roles && (
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Role">
          {form.getFieldDecorator("role.id", {
            rules: [
              {
                required: true,
                message: "Role is required"
              }
            ],
            initialValue: record.role ? record.role.id : null
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {roles.map(role => {
                // if (role.id === superAdminId) return;
                // else
                // console.log(role);
                  return (
                    <Option key={role.id} value={role.id}>
                      {" "}
                      {role.name}{" "}
                    </Option>
                  );
              })}
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
            initialValue:record.areaIds ? record.areaIds : [],
            normalize: values =>
              values.includes("all")
                ? values.filter(value => value === "all")
                : values
          })(
            <Select
              placeholder="select"
              style={{ width: "100%" }}
              mode="multiple"
            >
              <Option key={"all"} value={"all"}>
                All
              </Option>
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
        {form.getFieldDecorator("isActivated", {
          rules: [
            {
              required: true,
              message: "Activated is required"
            }
          ],
          initialValue: record.isActivated ? 1 : 0
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
  loading: loading.models.admins && loading.models.roles
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
    updatePasswordModalVisible: false,
    registerEmailModalVisible: false,
    areas: [],
    filteredAdmins: []
  };

  columns = [
    {
      title: "Name",
      dataIndex: "name",
      // render: (text, record) => (
      //   <span>{`${record.firstName ? record.firstName : ""} ${
      //     record.lastName ? record.lastName : ""
      //   }`}</span>
      // )
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "phone",
      dataIndex: "phone"
    },
    {
      title: "Is Activated",
      dataIndex: "activated",
      render: (text, record) => 
        (
        <Tag color= {record.isActivated ? "green" : "volcano"}>
        {record.isActivated ? "√" : "X"}
      </Tag>
      )
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => (
        record.role ? record.role.name : ''
      )
    },
    // {
    //   title: "Areas",
    //   dataIndex: "area",
    //   render: (text, record) => (
    //     <Fragment>{this.getNameByAreaIds(record.areaIds)}</Fragment>
    //   )
    // },
    {
      title: "Operation",
      render: (text, record) =>
        record.roleId === superAdminId ? (
          <span />
        ) : (
          <Fragment>
            {authority.includes("update.admin.detail") && (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                Update
              </a>
            )}

            <Divider type="vertical" />

            {authority.includes("update.admin.password") && (
              <a
                href="#"
                onClick={() =>
                  this.handleUpdatePasswordModalVisible(true, record)
                }
              >
                Update Password
              </a>
            )}

            {/* <Divider type="vertical" />

            {authority.includes("update.admin.detail") && (
              <Popconfirm
                title="Are you Sure？"
                icon={
                  <Icon type="question-circle-o" style={{ color: record.activated ?  "red" : "green" }} />
                }
                onConfirm={() => this.handleUpdate(record.id, Object.assign({}, record, {activated: !record.activated }) )}
              >
                <a href="#" style={{ color:  record.activated ? "red" : "green" }}>
                   {record.activated ?  "Deactivate" : "Activate"}
                </a>
              </Popconfirm>
            )} */}
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
    if (this.props.roles.length === 0 || !roleId) return "";
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
    const {areas} = this.state;



    if (areas.length === 0) return "";
    else if (areas.length === areaIds.length) return "all";
    else
      return areas
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
  saveState = response => {
    this.setState({ filteredAdmins: response});
  };
  handleGetAdmins = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "admins/get",
      // payload: filterCriteria,
      payload:{
        pagination: {
          page: 0,
          pageSize: 10,
        }
      },
      onSuccess: this.handleSearch
    });
  };

  handleGetAreas = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;


    dispatch({
      type: "areas/getAll",
      payload: filterCriteria,
      onSuccess: areas => this.setState({areas: areas})
    });
  };

  handleStandardTableChange = (page) => {
    const { dispatch, admins } = this.props;
    console.log(page);
    dispatch({
      type: "admins/getadminsdata",
      saveState:this.saveState,
      payload: {
        pagination: {
          page: page.current,
          pageSize: page.pageSize,
        }
      }
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const areas = this.props.areas;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={6}>
            <Search
              placeholder="name, phone or email"
              onSearch={this.handleSearch}
              className={styles.search}
              enterButton
            />
            <Button
              className={styles.button}
              style = {{display: this.state.arrlength ? 'inline-block': 'none'}}
              onClick={() => this.getAdminsAll()}
            >
              Reset
            </Button>
            {/* <FormItem label="Name">
              {getFieldDecorator("name")(
                <Input placeholder="Name" />
              )}
            </FormItem> */}
          </Col>
          <Col span={10}>
            <FormItem>
              {authority.includes("register.admin.email") && (
                <Button
                  icon="plus"
                  type="primary"
                  className = {styles.buttonStyle}
                  onClick={() => this.handleEmailRegisterModalVisible(true)}
                  style={{ marginLeft: "0.5em" }}
                >
                  Register By Email
                </Button>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

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

  handleSearch = value => {
    const { dispatch, admins } = this.props;
    value = value.trim();
    if(!value){
      dispatch({
        type: "admins/get",
        // payload: filterCriteria,
        payload:{
          pagination: {
            page: 0,
            pageSize: 10,
          }
        },
      });
    }
    else if (/^[a-zA-Z]/.test(value) && !value.includes("@") && value.length > 0) {
      dispatch({
        type: "admins/adminSearch",
        payload: {
          name: value
        },
      });
    } else if (
      /^[0-9]/.test(value) &&
      !value.includes("@") &&
      value.length > 0
    ) {
      dispatch({
        type: "admins/adminSearch",
        payload: {
          phone: value
        },
      });
    } else if (/@/.test(value) && value.includes("@") && value.length > 0) {
      dispatch({
        type: "admins/adminSearch",
        payload: {
          email: value
        },
      });
    } else {
      return false
    }
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

  handleEmailRegisterModalVisible = flag => {
    this.setState({
      registerEmailModalVisible: !!flag
    });
  };

  handleEmailRegister = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: "admins/emailRegister",
      payload: fields,
      onSuccess: this.handleGetAdmins
    });

    //message.success("Add Success!");
    this.handleEmailRegisterModalVisible();
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
    const { dispatch,admins } = this.props;
    dispatch({
      type: "admins/update",
      payload: fields,
      id: id,
      pagination:{
        page:admins.pagenation.page,
        pageSize:admins.pagenation.pageSize
      },
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
    const { admins, loading, roles } = this.props;
    const { areas, filteredAdmins } = this.state;
    const totalSize = admins.pagenation? admins.pagenation.totalSize :0
    const {
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord,
      updatePasswordModalVisible,
      registerEmailModalVisible
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

    const emailRegisterMethods = {
      handleModalVisible: this.handleEmailRegisterModalVisible,
      handleSubmit: this.handleEmailRegister
    };

    return (
      <PageHeaderWrapper title="Admin List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/*{authority.includes("add.admin") && (*/}
                {/*<Button*/}
                  {/*icon="plus"*/}
                  {/*type="primary"*/}
                  {/*onClick={() => this.handleModalVisible(true)}*/}
                {/*>*/}
                  {/*Add*/}
                {/*</Button>*/}
              {/*)}*/}

              {
                this.renderSimpleForm()
              }

            </div>
            <StandardTable
              scroll={{ x: 1300 }}
              rowKey={record => record.id}
              loading={loading}
              selectPagenations = {this.selectPagenations}
              // data={{ list: filteredAdmins, pagination: {
              data={{ list: admins.payload, pagination: {
                total: totalSize,
                defaultCurrent:1,
              } }}
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

        <EmailRegisterForm
          {...emailRegisterMethods}
          modalVisible={registerEmailModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Admin;
