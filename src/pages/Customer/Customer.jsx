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
  Table,
  DatePicker,
  Popconfirm
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import CustomerDetail from "./CustomerDetail";

const { RangePicker } = DatePicker;

import styles from "./Customer.less";
import { roundTo2Decimal } from "../../utils/mathUtil";

import { getAuthority } from "@/utils/authority";
import {formatPhoneNumber} from "@/utils/utils"
import { exportCSVFile } from "../../utils/utils";
import ride from "@/models/ride";

const customerCsvHeader = {
  id: "uid",
  email: "email",
  deposit: "Deposit",
  rideCredit: "Ride Credit",
  phoneModel: "Phone Model",
  created: "Register",
  updated: "updated",
  areaId: "areaId",
  emailStatus: "emailStatus",
  inviteCode: "inviteCode",
  migrated: "migrated",
  status: "status",
};

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

const authority = getAuthority();

const GenTempCodeForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleGetTempCode,
    handleModalVisible,
    tempCode
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;

        handleGetTempCode(fieldsValue.phoneNumber);
      });
    else handleModalVisible();
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
        label="Phone Number:"
      >
        {form.getFieldDecorator("phoneNumber")(
        <Input style={{marginLeft: "2em"}} placeholder="Please Input" />
        )}
      </FormItem>
      { tempCode && <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Temp Code"
        >
          <span> {tempCode}</span>
        </FormItem>
      }
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

const CouponForm = Form.create()(props => {
  const {
    form,
    couponModalVisible,
    handleCouponModalVisible,
    handleGetCustomerCoupons,
    coupons,
    customerCoupons,
    handleDeleteCoupon,
    customer,
    dispatch
  } = props;
  const okHandle = () => {
    handleCouponModalVisible();
  };

  const couponColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Free Minutes",
      dataIndex: "freeMinutes",
      key: "freeMinutes"
    },
    {
      title: "Free Minutes",
      dataIndex: "freeMinutes",
      key: "freeMinutes"
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      render: start => moment(start).format("YYYY/MM/DD hh:mm:ss")
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      render: end => moment(end).format("YYYY/MM/DD hh:mm:ss")
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          <Popconfirm
            title="Are you sure？"
            icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
            onConfirm={() => handleDeleteCoupon(record.id)}
          >
            <a href="#" style={{ color: "red" }}>
              Delete
            </a>
          </Popconfirm>
        </Fragment>
      )
    }
  ];

  const handleAddCustomerCoupon = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        const start = fieldsValue.start.toDate();

        dispatch({
          type: "coupons/addCouponToCustomer",
          couponId: fieldsValue.couponId,
          customerId: customer.id,
          onSuccess: handleGetCustomerCoupons,
          start: start
        });
      });
  };

  let isAddEnabled = false;

  return (
    <Modal
      destroyOnClose
      title="Add Coupon to Customer"
      visible={couponModalVisible}
      onOk={okHandle}
      onCancel={() => handleCouponModalVisible()}
      width={"95%"}
    >
      <Row>
        <Col>
          <Table
            dataSource={customerCoupons}
            columns={couponColumns}
            scroll={{ x: 1300 }}
          />
        </Col>
      </Row>

      {coupons && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Coupon"
        >
          {form.getFieldDecorator("couponId", {
            rules: [
              {
                required: true,
                message: "You have pick a coupon to add"
              }
            ]
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {coupons.map(coupon => (
                <Option key={coupon.id} value={coupon.id}>
                  Name: <b> {coupon.name} </b> free minutes:{" "}
                  {coupon.freeMinutes} Valid days: <b> {coupon.days} </b>
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Start Time"
      >
        {form.getFieldDecorator("start", {
          rules: [
            {
              required: true,
              message: "You have to pick a time to start!"
            }
          ]
        })(
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Start Time"
          />
        )}
      </FormItem>

      <Row>
        <Col>
          <Button
            icon="plus"
            type="primary"
            onClick={handleAddCustomerCoupon}
            disabled={!form.isFieldsTouched()}
          >
            Add Coupon
          </Button>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ customers, areas, coupons, loading }) => ({
  customers,
  areas,
  coupons,
  selectedAreaId : areas.selectedAreaId,
  areaNames: areas.areaNames,
  loading: loading.models.customers
}))
@Form.create()
class Customer extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    couponModalVisible: false,
    expandForm: false,
    selectedRows: [],
    customerCoupons: null,
    filterCriteria: { currentPage: 1, pageSize: 10 },
    selectedRecord: {},
    genTempCodeModalVisible: false,
    tempCode: null
  };

  columns = [
    {
      title: "phone",
      dataIndex: "phone",
      render: val => formatPhoneNumber(val+"")
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: true
    },
    {
      title: "Area",
      render: (text, record) => this.props.areaNames && this.props.areaNames[record.areaId]
    },
    {
      title: "email",
      dataIndex: "email"
    },
    {
      title: "Balance",
      render: (text, record) => <p> {record.rideCredit + record.deposit }</p> 
    },
    {
      title: "operation",
      render: (text, record) => (
        <Fragment>
          {authority.includes("update.customer.detail") && (
            <a onClick={() => this.handleDetailModalVisible(true, record)}>
              Detail
            </a>
          )}
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetCustomers();
    this.handleGetCoupons();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetCustomers();
      this.handleGetCoupons();
    }
  }

  handleGetCoupons = () => {
    const { dispatch, selectedAreaId } = this.props;
    dispatch({
      type: "coupons/get",
      payload: {areaId: selectedAreaId}
    });
  };

  handleGetCustomers = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "customers/get",
      payload: selectedAreaId ? Object.assign({},filterCriteria, {areaId: selectedAreaId} ) : filterCriteria,
    });
  };

  handleGetCustomerCoupons = customerId => {
    const { dispatch } = this.props;
    dispatch({
      type: "coupons/getCustomerCoupons",
      payload: customerId,
      onSuccess: response => this.setState({ customerCoupons: response })
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

    this.setState({ filterCriteria: params }, () =>  this.handleGetCustomers());

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
        fieldsValue.registerStart = moment(fieldsValue.created[0]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss");
        fieldsValue.registerEnd = moment(fieldsValue.created[1]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss");
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

  handleCouponModalVisible = (flag, record) => {
    if (flag) this.handleGetCustomerCoupons(record.id);
    else this.setState({ customerCoupons: null });

    this.setState({
      couponModalVisible: !!flag,
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
          <Col md={4} sm={24}>
            {`count: ${this.props.customers.total}`}
          </Col>
          <Col md={{ span: 8, offset: 12}} sm={24}>
            <span className={styles.submitButtons} style={{ float: "right" }}>

            {authority.includes("get.customer.verification.code") && <Button type="primary" onClick={() => this.handleGenTempCodeModalVisible(true)}>
                  Generate Verification Code
              </Button> }

              <Button  style={{ marginLeft: 8 }} type="primary" htmlType="submit">
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

  filterCouponsByAreaId = (coupons, areaId) => {
    return coupons.filter(coupon => coupon.areaId === areaId);
  };

  handleDeleteCoupon = customerCouponId => {
    const { dispatch } = this.props;
    dispatch({
      type: "coupons/removeCustomerCoupon",
      id: customerCouponId,
      onSuccess: () =>
        this.handleGetCustomerCoupons(this.state.selectedRecord.id)
    });
  };

  formatCsvData = customers => {
    const {areaNames, selectedAreaId} = this.props;
  

    return customers.map(customer => {
      customer.created = moment(customer.created).format("YYYY-MM-DD HH:mm:ss");
      customer.area = areaNames[customer.areaId];
      
      return {
        id: customer.id,
        email: customer.email ? customer.email.replace(/(\r\n|\n|\r)/gm, "") : "unknown",
        deposit: customer.deposit,
        rideCredit: customer.rideCredit,
        phoneModel: customer.phoneModel,
        created: customer.created,
        updated: customer.updated,
        areaId: customer.areaId,
        emailStatus: customer.emailStatus,
        inviteCode: customer.inviteCode,
        migrated: customer.migrated,
        status: customer.status
      };
    })
  }

  handleGetTempCode= phoneNumber => {

    const { dispatch } = this.props;

    dispatch({
      type: "customers/getTempCode",
      phoneNumber: phoneNumber,
      onSuccess: tempCode => this.setState({tempCode: tempCode, genTempCodeModalVisible: true})
    });

  }

  handleGenTempCodeModalVisible = flag => {
    this.setState({
      genTempCodeModalVisible: !!flag,
    });
  }

  handleExportData = () => {
    const { form, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;


    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.created) {
        fieldsValue.registerStart =  moment(fieldsValue.created[0]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss");
        fieldsValue.registerEnd = moment(fieldsValue.created[1]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss");
        fieldsValue.created = undefined;
      }

      const values = Object.assign({}, filterCriteria, fieldsValue, {areaId: selectedAreaId}   , {
        currentPage: null,
        pageSize: null
      });

      this.setState(
        {
          filterCriteria: values
        },
        this.finishExportData
      );
    });
  }

  finishExportData() {
    const { filterCriteria } = this.state;
    const { areaNames, selectedAreaId, dispatch } = this.props;
    dispatch({
      type: "customers/getAll",
      payload: filterCriteria,
      onSuccess: data => {
        exportCSVFile(customerCsvHeader, this.formatCsvData(data), areaNames[selectedAreaId])
      }
    })
  }

  render() {
    const { customers, areas, loading, coupons, dispatch, selectedAreaId } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      couponModalVisible,
      selectedRecord,
      filterCriteria,
      customerCoupons,
      genTempCodeModalVisible,
      tempCode
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
            <StandardTable
              loading={loading}
              data={{ list: customers.data, pagination: pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1300 }}
            />
          </div>

          {selectedAreaId >= 1 && <div>
                        <Button style={{marginTop: "1em"}} onClick={this.handleExportData} >
                            Export
                        </Button>
                      </div>
          }

        </Card>

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          areas={areas.data}
        />

      <GenTempCodeForm
          modalVisible={genTempCodeModalVisible}
          handleModalVisible={this.handleGenTempCodeModalVisible}
          handleGetTempCode={this.handleGetTempCode}
          tempCode={tempCode}
        />

        {
          <CouponForm
            couponModalVisible={couponModalVisible}
            handleGetCustomerCoupons={this.handleGetCustomerCoupons}
            handleCouponModalVisible={this.handleCouponModalVisible}
            handleDeleteCoupon={this.handleDeleteCoupon}
            coupons={
              coupons &&
              coupons.data &&
              this.filterCouponsByAreaId(coupons.data, selectedRecord.areaId)
            }
            customerCoupons={customerCoupons}
            customer={selectedRecord}
            dispatch={dispatch}
          />
        }

        {detailModalVisible && (
          <CustomerDetail
            isVisible={detailModalVisible}
            handleDetailVisible={this.handleDetailModalVisible}
            customerId={selectedRecord.id}
            handleGetCustomers={this.handleGetCustomers}
          />
        )}


      

      </PageHeaderWrapper>
    );
  }
}

export default Customer;
