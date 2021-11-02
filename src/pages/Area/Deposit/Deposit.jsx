import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
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
  InputNumber,
  Popconfirm, DatePicker
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Deposit.less";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const FormItem = Form.Item;
const { Step } = Steps;
const { TextDeposit } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const vehicleType = ["Bicycle", "Scooter", "E-Vehicle", "COSMO"];
const CreateForm = (props => {
  const {
    modalVisible,
    handleAdd,
    handleModalVisible,
    deposits,
    areas
  } = props;
  const [form] = Form.useForm()
  const okHandle = () => {
    form.submit()
    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;
    //   form.resetFields();

    //   handleAdd(fieldsValue);
    // });
  };
  return (
    <Modal
      destroyOnClose
      forceRender
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form onFinish ={()=>{handleAdd(form.getFieldsValue(true))}} form={form}>
      <FormItem labelCol={{ span: 5 }} 
        name='description'
        rules={
          [
            {
              required: true,
              message: "name is required",
              min: 1
            }
          ]
        }
        wrapperCol={{ span: 15 }} label="Description">
          <Input placeholder="Please Input" />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='deposit'
        rules={
          [
            {
              required: true
            }
          ]
        }
        label="Deposit"
      >
        <InputNumber placeholder="Please Input" />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='rideCredit'
        rules={
          [
            {
              required: true
            }
          ]
        }
        label="Ride Credits"
      >
        <InputNumber placeholder="Please Input" />
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
    record,
    areas,
    selectedAreaId
  } = props;
  const [form] = Form.useForm()
  form.setFieldsValue(record)
  const okHandle = () => {
    form.submit()
    // if (form.isFieldsTouched())
    //   form.validateFields((err, fieldsValue) => {
    //     if (err) return;
    //     form.resetFields();

    //     handleUpdate(record.id, fieldsValue);
    //   });
    // else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="Update"
      visible={modalVisible}
      onOk={okHandle}
      forceRender
      onCancel={() => handleModalVisible()}
    >
      <Form form={form} onFinish={()=>{handleUpdate(record.id, form.getFieldsValue(true))}}>
      <FormItem labelCol={{ span: 5 }} 
        name='description'
        rules={
          [
            {
              required: true,
              message: "name is required",
              min: 1
            }
          ]
        }
        wrapperCol={{ span: 15 }} label="Description">
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Deposit"
        name='deposit'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
       <InputNumber placeholder="Please Input" />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='rideCredit'
        label="Ride Credits"
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
       <InputNumber placeholder="Please Input" />
      </FormItem>
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
class Deposit extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    generateCodeDepositVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {
        pagination: {
            page: 0,
            pageSize: 10,
            total:null,
            "sort": {
                "direction": "desc",
                "sortBy": "created"
            }
        }
    },
    selectedRecord: {}
  };

  columns = [
    {
      title: "Description",
      dataIndex: "description"
    },
    {
      title: "Deposit",
      sorter: (a, b) => a.deposit - b.deposit,
      dataIndex: "deposit"
    },
    {
      title: "Ride Credit",
      sorter: (a, b) => a.rideCredit - b.rideCredit,
      dataIndex: "rideCredit"
    },
    {
      title: "Area",
      dataIndex: "areaId",
      render: areaId => <span>{this.props.areas.areaNames[areaId]}</span>
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>


          <Divider type="vertical" />

            <Popconfirm
              title="Are you sure？"
              icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
              onConfirm={() => this.handleDelete(record.id)}
            >
              <a href="#" style={{ color: "red" }}>
                Delete
              </a>
            </Popconfirm>

        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetDeposits();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetDeposits();
    }

  }

  handleGetDeposits = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;
    dispatch({
      type: "deposits/get",
      payload: selectedAreaId ? Object.assign({}, filterCriteria, {areaIds: [selectedAreaId]}) :  filterCriteria,
      onSuccess:(page,pageSize,total)=>{
        this.setState({
          ...filterCriteria,
          filterCriteria:{
            pagination:{
              ...filterCriteria.pagination,
              page:page,
              total:total,
              pageSize:pageSize,            },
          }
        })
      }
    });
  };

  handleStandardTableChange = (pageData, sorter) => {
    const { filterCriteria } = this.state;
    console.log(pageData);
    this.setState({ filterCriteria: {
      ...filterCriteria,
      pagination:{
        ...filterCriteria.pagination,
        page:pageData.current,
        pageSize:pageData.pageSize,      }
    } }, () => this.handleGetDeposits());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetDeposits()
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
        () => this.handleGetDeposits()
      );
    });
  };

  handleCreateModalVisible = flag => {
    this.setState({
      createModalVisible: !!flag
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;

    dispatch({
      type: "deposits/delete",
      id: id,
      onSuccess: this.handleGetDeposits
    });
  };

  handleAdd = fields => {
    const { dispatch,selectedAreaId } = this.props;
    fields.areaId = selectedAreaId
    dispatch({
      type: "deposits/add",
      payload: fields,
      onSuccess: this.handleGetDeposits
    });

    this.handleCreateModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "deposits/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetDeposits
    });

    this.handleUpdateModalVisible();
  };

  render() {
    const { deposits, loading, areas,selectedAreaId } = this.props;
    const {
      createModalVisible,
      updateModalVisible,
      selectedRecord,
      generateCodeDepositVisible
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    const codeDepositMethods = {
      handleModalVisible: this.handleGenerateCodeDepositModalVisible,
      handleGenerateDepositWithCode: this.handleGenerateDepositWithCode
    };

    return (
      <PageHeaderWrapper title="Deposit List">
        <Card bordered={false}>
          <div className={styles.tableList}>
          {
            selectedAreaId && 
            <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  onClick={() => this.handleCreateModalVisible(true)}
                >
                  Add
                </Button>
            </div>
          }
            { deposits.data && areas && areas.areaNames && 
              <StandardTable
              loading={loading}
              data={{ list: deposits.data, pagination:this.state.filterCriteria.pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
            }
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={createModalVisible}
          deposits={deposits.data}
          areas={areas.data}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          deposits={deposits.data}
          areas={areas.data}
        />

      
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ deposits, areas, loading }) => {
  return {
    deposits,
    areas,
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.deposits
    }
}
export default connect(mapStateToProps)(Deposit) 