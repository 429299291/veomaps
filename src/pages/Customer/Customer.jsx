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
  Divider,
  Steps,
  Radio,
  InputNumber,
  DatePicker
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

const { RangePicker } = DatePicker;

import styles from "./Customer.less";
import { roundTo2Decimal } from "../../utils/mathUtil";

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");
const statusMap = ["default", "processing", "success", "error"];
const operationStatus = ["NORMAL", "MANTAINANCE"];
const connectStatus = ["Offline", "Online"];
const lockStatus = ["Unlock", "lock"];
const customerType = ["Bicycle", "Scooter", "E-Customer", "Car"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const customerStatus = ["NORMAL", "FROZEN", "ERROR"];

const queryStatus = ["FROZEN"];

const UpdateForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    areas,
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

  const checkMoneyFormat = (rule, value, callback) => {
    if (isNumberRegex.test(value)) {
      callback();
      return;
    }
    callback("Credit Must be Number!");
  };

  const checkEmailFormat = (rule, value, callback) => {
    if (isEmailRegex.test(value)) {
      callback();
      return;
    }
    callback("Please input correct email format");
  };

  return (
    <Modal
      destroyOnClose
      title="Update Customer"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="CREDIT AMOUNT"
      >
        {form.getFieldDecorator("credit", {
          rules: [{ validator: checkMoneyFormat }],
          initialValue: record.credit
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="FULL NAME"
      >
        {form.getFieldDecorator("fullName", {
          initialValue: record.fullName
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="EMAIL">
        {form.getFieldDecorator("email", {
          rules: [{ validator: checkEmailFormat }],
          initialValue: record.email
        })(<Input placeholder="Please Input" />)}
      </FormItem>

      {customerStatus && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Status"
        >
          {form.getFieldDecorator("status", {
            rules: [
              {
                required: true,
                message: "You have pick a status"
              }
            ],
            initialValue: record.status
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {customerStatus.map((status, index) => (
                <Option key={index} value={index}>
                  {customerStatus[index]}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}

      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area">
          {form.getFieldDecorator("areaId", {
            rules: [
              {
                required: true,
                message: "You have pick a area"
              }
            ],
            initialValue: record.areaId
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ customers, areas, loading }) => ({
  customers,
  areas,
  loading: loading.models.customers
}))
@Form.create()
class Customer extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: { currentPage: 1, pageSize: 10 },
    selectedRecord: {}
  };

  columns = [
    {
      title: "phone",
      dataIndex: "phone"
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: true
    },
    {
      title: "email",
      dataIndex: "email"
    },
    {
      title: "Balance",
      dataIndex: "credit"
    },
    {
      title: "operation",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            Update
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDetailModalVisible(true, record)}>
            Detail
          </a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetCustomers();
  }

  handleGetCustomers = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "customers/get",
      payload: filterCriteria
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    params.currentPage = pagination.current;
    params.pageSize = pagination.pageSize;

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params });

    dispatch({
      type: "customers/get",
      payload: params
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { filterCriteria } = this.state;
    form.resetFields();

    const params = {
      currentPage: 1,
      pageSize: filterCriteria.pageSize
    };

    this.setState(
      {
        filterCriteria: params
      },
      () => this.handleGetCustomers()
    );
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.created) {
        fieldsValue.registerStart = fieldsValue.created[0].format("MM-DD-YYYY");
        fieldsValue.registerEnd = fieldsValue.created[1].format("MM-DD-YYYY");
        fieldsValue.created = undefined;
      }

      const values = Object.assign({}, filterCriteria, fieldsValue, {
        currentPage: 1,
        pageSize: 10
      });

      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetCustomers()
      );
    });
  };

  handleModalVisible = flag => {
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

  handleDetailModalVisible = (flag, record) => {
    this.setState({
      detailModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customers/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetCustomers
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("nameOrPhoneOrEmail")(
                <Input placeholder="PHONE NAME EMAIL" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Status">
              {getFieldDecorator("queryStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {queryStatus.map((status, index) => (
                    <Option key={index} value={index}>
                      {queryStatus[index]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Registered">
              {getFieldDecorator("created")(<RangePicker />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={{ span: 8, offset: 16 }} sm={24}>
            <span className={styles.submitButtons} style={{ float: "right" }}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { customers, areas, loading } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord,
      filterCriteria
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    const pagination = {
      defaultCurrent: 1,
      current: filterCriteria.currentPage,
      pageSize: filterCriteria.pageSize,
      total: customers.total
    };

    return (
      <PageHeaderWrapper title="Customer List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                Haha
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: customers.data, pagination: pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1300 }}
            />
          </div>
        </Card>

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          areas={areas.data}
        />

        {selectedRecord &&
          detailModalVisible && (
            <Modal
              destroyOnClose
              title="Detail"
              visible={detailModalVisible}
              onCancel={() => this.handleDetailModalVisible()}
              onOk={() => this.handleDetailModalVisible()}
            >
              {Object.keys(selectedRecord).map(key => (
                <p key={key}>{`${key} : ${selectedRecord[key]}`}</p>
              ))}
            </Modal>
          )}
      </PageHeaderWrapper>
    );
  }
}

export default Customer;
