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
  notification
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

import styles from "./Role.less";

const FormItem = Form.Item;
const { Step } = Steps;
const { TextRole } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const CreateForm = (props => {
  const { modalVisible, handleAdd, handleModalVisible, roles } = props;
  const [form] = Form.useForm()
  const okHandle = () => {

    const fieldsValue = form.getFieldsValue(true)
      //disable adding super admin
      if (fieldsValue.name === "Super Admin") {
        form.resetFields();
        handleModalVisible(false);
        notification.error({
          message: "Operation Denied",
          description: "You can't create super admin"
        });
      }

      handleAdd(fieldsValue);
  };
  return (
    <Modal
      destroyOnClose
      title="Add"
      forceRender
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form form={form}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="NAME"
        name='name'
        rules={
          [
            {
              required: true,
              message: "name is required",
              min: 1
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

const UpdateForm = (props => {
  const {
    modalVisible,
    handleUpdate,
    handleModalVisible,
    record
  } = props;
  const [form] = Form.useForm()
  const okHandle = () => {
    const fieldsValue = form.getFieldsValue(true)
    if(fieldsValue.name){
      handleUpdate(record.id, fieldsValue);
      form.resetFields()
    }else{
      handleModalVisible();
    }
  };

  return (
    <Modal
      destroyOnClose
      title="Add"
      forceRender
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form form={form}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="NAME"
        name='name'
        rules={
          [
            {
              required: true,
              message: "name is required",
              min: 1
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

/* eslint react/no-multi-comp:0 */
class Role extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {}
  };

  columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Created",
      dataIndex: "created"
    },
    {
      title: "Updated",
      dataIndex: "updated"
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          {authority.includes("area") &&
            record.name !== "Super Admin" && (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                Update
              </a>
            )}
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetRoles();
  }

  handleGetRoles = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "roles/get",
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

    this.setState({ filterCriteria: params }, () => this.handleGetRoles());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetRoles()
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
        () => this.handleGetRoles()
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

  handleDetailModalVisible = (flag, record) => {
    this.setState({
      detailModalVisible: !!flag,
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
      type: "roles/add",
      payload: fields,
      onSuccess: this.handleGetRoles
    });

    //message.success("Add Success!");
    this.handleModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "roles/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetRoles
    });

    this.handleUpdateModalVisible();
  };

  render() {
    const { roles, loading } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    return (
      <PageHeaderWrapper title="Role List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {authority.includes("add.role") && (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  Add
                </Button>
              )}
            </div>
            <StandardTable
              loading={loading}
              data={{ list: roles.data, pagination: {} }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          roles={roles.data}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          roles={roles.data}
        />
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ roles, loading }) => {
  return {
    roles,
    loading: loading.models.roles
    }
}
export default connect(mapStateToProps)(Role) 