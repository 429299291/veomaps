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
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./BikeList.less";
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
const vehicleType = ["Bicycle", "Scooter", "E-Bike", "Car"];

const errorStatus = [
  "Normal",
  "Error",
  "Auto Error",
  "Scrapped",
  "Waiting for Activation"
];

const getPowerPercent = power => {
  if (power >= 420) return 100;
  else if (power < 420 && power >= 411) return 95 + ((power - 411) * 5) / 9;
  else if (power < 411 && power >= 395) return 90 + ((power - 395) * 5) / 16;
  else if (power < 395 && power >= 386) return 80 + ((power - 386) * 10) / 9;
  else if (power < 386 && power >= 379) return 70 + ((power - 379) * 10) / 7;
  else if (power < 379 && power >= 373) return 60 + ((power - 373) * 10) / 6;
  else if (power < 373 && power >= 369) return 50 + ((power - 369) * 10) / 4;
  else if (power < 369 && power >= 365) return 40 + ((power - 365) * 10) / 4;
  else if (power < 365 && power >= 363) return 30 + ((power - 363) * 10) / 2;
  else if (power < 363 && power >= 359) return 20 + ((power - 359) * 10) / 4;
  else if (power < 359 && power >= 354) return 10 + ((power - 354) * 10) / 5;
  else if (power < 354 && power > 340) return ((power - 340) * 10) / 14;
  return 0;
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator("desc", {
          rules: [
            {
              required: true,
              message: "请输入至少五个字符的规则描述！",
              min: 5
            }
          ]
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ bikes, loading }) => ({
  bikes,
  loading: loading.models.bikes
}))
@Form.create()
class BikeList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    paginationValues: { page: 1, pageSize: 10 },
    stepFormValues: {}
  };

  columns = [
    {
      title: "ID",
      dataIndex: "vehicleNumber"
    },
    {
      title: "Power",
      dataIndex: "power",
      render(val) {
        return <p>{roundTo2Decimal(getPowerPercent(val)) + "%"}</p>;
      }
    },
    {
      title: "Lock Status",
      dataIndex: "lockStatus",
      render(val) {
        return <p>{lockStatus[val]}</p>;
      }
    },
    {
      title: "Error Status",
      dataIndex: "errorStatus",
      render(val) {
        return <p>{errorStatus[val]}</p>;
      }
    },
    {
      title: "Connect Status",
      dataIndex: "connectStatus",
      render(val) {
        return <p>{connectStatus[val]}</p>;
      }
    },
    {
      title: "Ride Count",
      dataIndex: "rideCount",
      sorter: true,
      render: val => <span>{val}</span>
    },
    {
      title: "Last Ride Time",
      dataIndex: "lastRideTime",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "Type",
      dataIndex: "vehicleType",
      render(val) {
        return <p>{vehicleType[val]}</p>;
      }
    },
    {
      title: "operation",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            Detail
          </a>
          {/*<Divider type="vertical" />
          <a href="">订阅警报</a>*/}
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      currentPage: this.state.paginationValues.page,
      pageSize: this.state.paginationValues.pageSize
    };

    dispatch({
      type: "bikes/fetchCount",
      payload: {}
    });

    dispatch({
      type: "bikes/fetch",
      payload: params
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      ...filters
    };

    this.setState({
      paginationValues: {
        page: pagination.current,
        pageSize: pagination.pageSize
      }
    });

    params.currentPage = pagination.current;
    params.pageSize = pagination.pageSize;

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: "bikes/fetch",
      payload: params
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });

    this.setState({
      paginationValues: {
        page: 1,
        pageSize: this.state.paginationValues.pageSize
      }
    });

    const params = {
      currentPage: 1,
      pageSize: this.state.paginationValues.pageSize
    };

    dispatch({
      type: "bikes/fetchCount",
      payload: {}
    });
    dispatch({
      type: "bikes/fetch",
      payload: params
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case "remove":
        dispatch({
          type: "bikes/remove",
          payload: {
            key: selectedRows.map(row => row.key)
          },
          callback: () => {
            this.setState({
              selectedRows: []
            });
          }
        });
        break;
      default:
        break;
    }
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
        currentPage: 1,
        pageSize: 10
      };

      console.log(values);

      this.setState({
        formValues: values
      });

      dispatch({
        type: "bikes/fetchCount",
        payload: values
      });

      dispatch({
        type: "bikes/fetch",
        payload: values
      });
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
      stepFormValues: record || {}
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "bikes/add",
      payload: {
        desc: fields.desc
      }
    });

    message.success("添加成功");
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "bikes/update",
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key
      }
    });

    message.success("配置成功");
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
              {getFieldDecorator("numberOrImei")(
                <Input placeholder="number or imei" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Battery Status">
              {getFieldDecorator("powerStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Low Battery</Option>
                  <Option value="1">Full Battery</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                more <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("numberOrImei")(
                <Input placeholder="number or imei" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Battery Status">
              {getFieldDecorator("powerStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Low Battery</Option>
                  <Option value="1">Full Battery</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Lock Status">
              {getFieldDecorator("lockStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Unlock</Option>
                  <Option value="1">Lock</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Error Status">
              {getFieldDecorator("errorStatus")(
                <Select
                  mode="multiple"
                  placeholder="select"
                  style={{ width: "100%" }}
                >
                  <Option value="0">Normal</Option>
                  <Option value="1">Error</Option>
                  <Option value="2">Auto Error</Option>
                  <Option value="3">Scrapped</Option>
                  <Option value="4">Waiting for Activation</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Vehicle Type">
              {getFieldDecorator("vehicleType")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Bike</Option>
                  <Option value="1">Scooter</Option>
                  <Option value="2">e-bike</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Connection Status">
              {getFieldDecorator("connectStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">offline</Option>
                  <Option value="1">online</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: "hidden" }}>
          <div style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              close <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { bikes, loading } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      paginationValues
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    const pagination = {
      defaultCurrent: paginationValues.page,
      pageSize: paginationValues.pageSize,
      total: bikes.total
    };

    return (
      <PageHeaderWrapper title="Vehicle List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                Add
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: bikes.data, pagination: pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default BikeList;
