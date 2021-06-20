import React, { useState, useEffect,PureComponent, Fragment } from "react";
import {connect} from 'dva'
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";


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
  Space ,
  Tag,
  Divider,
  message,
  Popconfirm
} from "antd";
import styles from "./Admin.less";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const superAdminId = 1;
const { Search,TextAdmin } = Input;

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
import { AudioOutlined } from '@ant-design/icons';
import { string } from "prop-types";

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

 class Admin extends React.Component {
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
        areasAll: [],
        filteredAdmins: [],
        search:''
      };
      columns = [
        {
          title: "Name",
          dataIndex: "name",
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
            <Tag style={{cursor:'default'}} color= {record.isActivated ? "green" : "volcano"}>
            {record.isActivated ? "true" : "false"}
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
        {
          title: "Operation",
          render: (text, record) =>(
          record.role ?  record.role.name === 'Super Admin'? (<span>Super administrator cannot modify</span>) :
          (
            //other permissions
              <Fragment>
                {authority.includes("me") && (
                  <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                    Update
                  </a>
                )}
    
                <Divider type="vertical" />
    
                {authority.includes("me") && (
                  <a
                    href="#"
                    onClick={() =>
                      this.handleUpdatePasswordModalVisible(true, record)
                    }
                  >
                    Update Password
                  </a>
                )}
              </Fragment>
            )
          
          
          :(
            //no permissions
            <Fragment>
            {authority.includes("me") && (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                Update
              </a>
            )}
    
            <Divider type="vertical" />
    
            {authority.includes("me") && (
              <a
                href="#"
                onClick={() =>
                  this.handleUpdatePasswordModalVisible(true, record)
                }
              >
                Update Password
              </a>
            )}
          </Fragment>
    
          )
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
        const { dispatch,admins } = this.props;
        const { filterCriteria } = this.state;
    
        dispatch({
          type: "admins/get",
          payload:{
            pagination: {
              page:0,
              pageSize: 10,
            }
          },
          onSuccess: this.handleSearch
        });
      };
    
      handleGetAreas = () => {
        const { dispatch } = this.props;
        dispatch({
          type: "areas/getAll",
        });
      };
    
      handleStandardTableChange = (page) => {
        const { dispatch, admins } = this.props;
        if(this.state.search){
          this.handleSearch({
            value:this.state.search,
            page: page.current-1,
          })
        }else{
          dispatch({
            type: "admins/getadminsdata",
            saveState:this.saveState,
            payload: {
              pagination: {
                page: page.current >0 ?page.current-1 :0,
                pageSize: page.pageSize,
              }
            }
          });
        }
    
      };
    
      renderSimpleForm() {
        return (
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col span={9}>
                <Search
                  placeholder="name, phone or email"
                  onSearch={this.handleSearch}
                  className={styles.search}
                  defaultValue=''
                  enterButton
                />
              </Col>
              <Col span={15}>
                <FormItem>
                  {authority.includes("admin") && (
                    <Button
                      icon="plus"
                      type="primary"
                      className = {styles.buttonStyle}
                      onClick={() => this.handleEmailRegisterModalVisible(true)}
                      style={{ marginLeft: "3em" }}
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
        // const { form } = this.props;
        form.resetFields();
    
        this.setState(
          {
            filterCriteria: {}
          },
          () => this.handleGetAdmins()
        );
      };
    
      handleSearch = (value,pagenation) => {
        const { dispatch, admins } = this.props;
        if(typeof value === 'string'){
          value = value.trim().replace(/\s*/g,"")
        }
        if(!value){
          dispatch({
            type: "admins/get",
            // payload: filterCriteria,
            payload:{
              pagination: {
                page: 0,
                pageSize: admins.pagenation.pageSize,
              }
            },
          });
        }
        else if (/^[a-zA-Z]/.test(value) && !value.includes("@") && value.length > 0) {
          dispatch({
            type: "admins/adminSearch",
            payload: {
              name: value,
              pagination: {
                page: 0,
                pageSize: admins.pagenation.pageSize,
              }
            },
          });
        } else if (
          /[0-9]()/.test(value) &&
          !value.includes("@") &&
          value.length > 0
        ) {
          value = value.replace(/-/g,"").replace(/\(/g,'').replace(/\)/g,'').replace(/^\+1/,'')
          dispatch({
            type: "admins/adminSearch",
            payload: {
              phone: value,
              pagination: {
                page: 0,
                pageSize: admins.pagenation.pageSize,
              }
            },
          });
        } else if (/@/.test(value) && value.includes("@") && value.length > 0) {
          dispatch({
            type: "admins/adminSearch",
            payload: {
              email: value,
              pagination: {
                page: 0,
                pageSize: admins.pagenation.pageSize,
              }
            },
          });
        } else {
          dispatch({
            type: "admins/adminSearch",
            payload: {
              name: value.value,
              pagination: {
                page:value.page,
                pageSize: admins.pagenation.pageSize,
              }
            },
          });
          return false
        }
        this.setState({
          search:value
        })
        admins.pagenation.page = 0
      };
    
      handleModalVisible = flag => {
        this.setState({
          modalVisible: !!flag
        });
      };

  handleUpdateModalVisible = (flag, record) => {
      ///////////////11111111
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
    
      handleUpdate = (id, fields,areas) => {
        const { dispatch,admins } = this.props;
        console.log(fields);
        if(fields.areaIds.includes('all')){
          fields.areaIds = areas.map(area => area.id);
        }
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
        const { admins, loading, roles,areas:{data,allAreas},user } = this.props;
        let availableRoles
        if(user.availableRoles){
           availableRoles = user.availableRoles.map(role => {
            return role.name
          })
        }
        // const { areas, filteredAdmins } = this.state;
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
        const EmailRegisterForm = (props => {
            const { modalVisible, handleSubmit, handleModalVisible } = props;
            const [form] = Form.useForm();
            const okHandle = () => {
                form.submit()
              };
            return (
              <Modal
                destroyOnClose
                title="Register by Email"
                visible={modalVisible}
                forceRender
                onOk={okHandle}
                onCancel={() => handleModalVisible()}
              >
              <Form form={form} onFinish={handleSubmit}>
                <FormItem
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 15 }}
                  label="Email"
                  name ='email'
                  rules={[
                    {
                      required: true,
                      type:'email',
                      message: "The email format is incorrect",
                      min:5
                    },
                  ]}
                >
                  <Input placeholder="Please Input" />
                </FormItem>
                <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 15 }}
                    label="Phone"
                    name='phone'
                    rules={
                        [
                            {
                            required: true,
                            message: "The phone number must be ten digits",
                            min: 10,
                            max:13
                            }
                        ]
                    }
                >
                    <Input placeholder="Please Input" />
                </FormItem>
                <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 15 }}
                    label="Name"
                    name='name'
                    rules={
                        [
                            {
                            required: true,
                            message: "name cant be empty.",
                            min: 2
                            }
                        ]
                    }
                >
                    <Input placeholder="Please Input" />
                </FormItem>
                </Form>
              </Modal>
            );
          });
          const CreateForm = (props => {
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
                <Form onFinish={handleAdd}>
                <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}
                    name='email'
                    rules={
                        [
                            {
                              required: true,
                              message: "email is required",
                              min: 1
                            }
                          ]
                    }
                    label="E-mail">
                 <Input placeholder="Please Input" />
                </FormItem>
                <FormItem
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 15 }}
                  name='username'
                  label="Username"
                  rules={
                    [
                        {
                          required: true,
                          message: "username is required",
                          min: 5
                        }
                      ]
                  }
                >
                 <Input placeholder="Please Input" />
                </FormItem>
                <FormItem
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 15 }}
                  label="Password"
                  name='password'
                  rules={
                    [
                        {
                          required: true,
                          message: "password is required, at least 5 chars",
                          min: 5
                        }
                      ]
                  }
                >
                  <Input placeholder="Please Input" type="password" />
                </FormItem>
                <FormItem
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 15 }}
                  label="Confirm Password"
                  name='confirmPassword'
                  rules={
                    [
                        {
                          required: true,
                          message: "confirm password is required, at least 5 chars",
                          min: 5
                        }
                      ]
                  }
                >
                  <Input placeholder="Please Input" type="password" />
                </FormItem>
                <FormItem
                  label="Is Activated"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 15 }}
                  name='activated'
                  rules={
                    [
                        {
                          required: true,
                          message: "Activated is required"
                        }
                      ]
                  }
                >
                
                    <Select placeholder="select" style={{ width: "100%" }}>
                      <Option value={0}>false</Option>
                      <Option value={1}>true</Option>
                    </Select>
                </FormItem>
                {roles && (
                  <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}
                  name='roleId'
                  rules={
                    [
                        {
                          required: true,
                          message: "Role is required"
                        }
                      ]
                  }
                  label="Role">
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
                  </FormItem>
                )}
                </Form>
              </Modal>
            );
          });
          
 const UpdatePasswordForm = (props => {
    const [form] = Form.useForm();
    const {
      updatePasswordModalVisible,
      handleUpdatePassword,
      handleUpdatePasswordModalVisible,
      record
    } = props;
    const okHandle = () => {
        if(form.getFieldValue('password')!==form.getFieldValue('confirmPassword')){
            form.resetFields()
            return false
        }
        form.submit()
    };
    return (
      <Modal
        destroyOnClose
        title="Update Password"
        visible={updatePasswordModalVisible}
        forceRender
        onOk={okHandle}
        onCancel={() => handleUpdatePasswordModalVisible()}
        width="700px"
      >
        <Form onFinish={()=>handleUpdatePassword(record.id,form.getFieldValue('password'))} form={form} 
           >
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="New Password"
          name='password'
          rules={
            [
                {
                  required: true,
                  message: "password is required, at least 5 chars",
                  min: 5
                }
              ]
          }
        >
          <Input placeholder="Please Input" type="password" />
        </FormItem>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          name='confirmPassword'
          rules={
            [
                {
                  required: true,
                  message: "confirm password is required, at least 5 chars",
                  min: 5
                }
              ]
          }
          label="Confirm New Password"
        >
          <Input placeholder="Please Input" type="password" />
        </FormItem>
        </Form>
      </Modal>
    );
  });
  const UpdateForm = (props => {
    const {
      modalVisible,
      handleUpdate,
      handleModalVisible,
      areas,
      user,
      roles,
      availableRoles,
      currentArea,
      record
    } = props;
    const [form] = Form.useForm();
    props.record?form.setFieldsValue(props.record):null
    let currentAreaData = currentArea.map(data=>{
      return data.name
    })
    if(areas && currentArea){
      if(areas.length == currentArea.length){
        currentAreaData.push('all')
      }
    }
    const okHandle = () => {
        form.submit()
    };
    return (
      <Modal
        destroyOnClose
        title="update admins"
        visible={modalVisible}
        onOk={okHandle}
        forceRender
        onCancel={() => handleModalVisible()}
      >
        <Form onFinish={()=>handleUpdate(record.id, form.getFieldsValue(true),areas)} form={form}
                  initialValues={{
                  }}
        >
        <FormItem labelCol={{ span: 7 }}
            name='email'
            rules={
                [
                    {
                      required: true,
                      message: "email is required",
                      min: 3,
                    },
                    {
                      message: "The email format is incorrect",
                      type:'email'
                    },
                  ]
            }
            wrapperCol={{ span: 15 }} label="E-mail">
          <Input placeholder="Please Input" />
        </FormItem>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="name"
          rules={
            [
                {
                  required: true,
                  message: "username is required",
                  whitespace: false,
                  min: 1
                }
              ]
          }
          name='name'
        >
            <Input placeholder="Please Input" />
        </FormItem>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="phone"
          name='phone'
          rules={
            [
                {
                  required:true,
                  message:'Phone is required',
                }
              ]
          }
        >
          <Input placeholder="Please Input" />
        </FormItem>
        {roles && (
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}
          name={['role', 'id']}
          rules={
            [
                {
                  required: true,
                  message: "Role is required",
                }
              ]
          }
            label="Role">
              <Select placeholder="select" style={{ width: "100%" }}>
                {roles.map(role => {
                    return (
                      <Option key={role.id} value={role.id} disabled={availableRoles?!availableRoles.includes(role.name):false}>
                        {role.name}
                      </Option>
                    );
                })}
              </Select>
          </FormItem>
        )}
        {areas && (
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="Areas"
            normalize={values =>
                values.includes("all")
                  ? values.filter(value => value === "all")
                  : values}
            rules={
                [
                    {
                      required: true,
                      message: "area is required"
                    }
                  ]
            }
            name='areaIds'
          >
              <Select
                placeholder="select"
                style={{ width: "100%" }}
                mode="multiple"
              >
                <Option key={"all"} value={"all"} disabled={!currentAreaData.includes('all')}>
                  All
                </Option>
                {areas.map(area => (
                  <Option key={area.id} value={area.id} disabled={!currentAreaData.includes(area.name)}>
                    {area.name}
                  </Option>
                ))}
              </Select>
            
          </FormItem>
        )}
        <FormItem
          label="Is Activated"
          labelCol={{ span: 7 }}
          name='isActivated'
          rules={
            [
                {
                  required: true,
                  message: "Activated is required"
                }
              ]
          }
          wrapperCol={{ span: 15 }}
        >
            <Select placeholder="select" style={{ width: "100%" }}>
              <Option value={false}>false</Option>
              <Option value={true}>true</Option>
            </Select>
        </FormItem>
        </Form>
      </Modal>
    );
  });
        return (
            <PageHeaderWrapper title="Admin List">
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
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
                    hideOnSinglePage	:true,
                    total: totalSize,
                    current:admins.pagenation?admins.pagenation.page+1:1,
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
              areas={allAreas}
            />
    
            <UpdateForm
              {...updateMethods}
              modalVisible={updateModalVisible}
              record={selectedRecord}
              admins={admins}
              roles={roles}
              availableRoles={availableRoles}
              areas={allAreas}
              currentArea={data}
            />
    
            <UpdatePasswordForm
              {...updatePasswordMethods}
              updatePasswordModalVisible={updatePasswordModalVisible}
              record={selectedRecord}
              admins={admins}
              roles={roles}
              // areas={allAreas}
            />
    
            <EmailRegisterForm
              {...emailRegisterMethods}
              modalVisible={registerEmailModalVisible}
            />
          </PageHeaderWrapper>
        );
      }
}

const mapStateToProps = ({ admins, roles, areas, loading,user }) => {
    return {
        admins: admins.data,
        roles: roles.data,
        areas,
        user:user.currentUser,
        loading: loading.models.admins && loading.models.roles
    }
  }
  export default connect(mapStateToProps)(Admin) 