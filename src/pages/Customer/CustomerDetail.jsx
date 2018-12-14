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
  Radio,
  Popconfirm,
  Table
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import Customer from "./Customer";

const FormItem = Form.Item;

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const authority = getAuthority();

const customerStatus = ["NORMAL", "FROZEN", "ERROR"];

const vehicleType = ["Bicycle", "Scooter", "E-Ride", "Car"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const EndRideForm = Form.create()(props => {
  const {
    isEndRideVisible,
    form,
    handleEndRide,
    handleEndRideVisible,
    ride
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEndRide(ride.id, fieldsValue);
    });
  };

  const minutes = Math.round((new Date() - new Date(ride.start)) / 60000); // This will give difference in milliseconds

  return (
    <Modal
      destroyOnClose
      title="End Ride"
      visible={isEndRideVisible}
      onOk={okHandle}
      onCancel={() => handleEndRideVisible(false)}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Minutes"
      >
        {form.getFieldDecorator("minutes", {
          initialValue: minutes
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { form, handleUpdate, areas, record } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        if (fieldsValue.email === "") fieldsValue.email = null;

        if (fieldsValue.fullName === "") fieldsValue.fullName = null;

        handleUpdate(record.id, fieldsValue);
      });
  };

  const checkMoneyFormat = (rule, value, callback) => {
    if (isNumberRegex.test(value)) {
      callback();
      return;
    }
    callback("Credit Must be Number!");
  };

  const checkEmailFormat = (rule, value, callback) => {
    if (value === "" || isEmailRegex.test(value)) {
      callback();
      return;
    }
    callback("Please input correct email format");
  };

  return (
    <div>
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

      <Row>
        <Col>
          <Button
            icon="plus"
            type="primary"
            onClick={okHandle}
            disabled={!form.isFieldsTouched()}
          >
            Update Customer
          </Button>
        </Col>
      </Row>
    </div>
  );
});

const AddCouponForm = Form.create()(props => {
  const { form, coupons, handleAddCustomerCoupon } = props;

  return (
    <div>
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
            onClick={() => handleAddCustomerCoupon(form)}
            disabled={!form.isFieldsTouched()}
          >
            Add Coupon
          </Button>
        </Col>
      </Row>
    </div>
  );
});

@connect(({ coupons, areas, loading }) => ({
  areas,
  coupons,
  loading: loading.models.geo
}))
class CustomerDetail extends PureComponent {
  state = {
    customerCoupons: null,
    isAbleToAddCoupon: false,
    customerDetail: null,
    customerRides: null,
    isEndRideVisible: false,
    selectedRide: null
  };

  customerCouponColumns = [
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
            onConfirm={() => this.handleDeleteCoupon(record.id)}
          >
            {authority.includes("delete.customer.coupon") && (
              <a href="#" style={{ color: "red" }}>
                Delete
              </a>
            )}
          </Popconfirm>
        </Fragment>
      )
    }
  ];

  customerRideColumns = [
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber"
    },
    {
      title: "Imei",
      dataIndex: "imei"
    },
    {
      title: "Lock Way",
      dataIndex: "lockMethod",
      render: val => <span>{lockOperationWay[val]}</span>
    },
    {
      title: "Unlock Way",
      dataIndex: "unlockMethod",
      render: val => <span>{lockOperationWay[val]}</span>
    },
    {
      title: "Start",
      dataIndex: "start",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "Minutes",
      dataIndex: "minutes"
    },
    {
      title: "End",
      dataIndex: "end",
      render: val =>
        val ? (
          <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
        ) : (
          "not finished"
        )
    },
    {
      title: "operation",
      render: (text, record) => (
        <Fragment>
          {!record.end &&
            authority.includes("end.customer.ride") && (
              <Popconfirm
                title="Are you Sure？"
                icon={
                  <Icon type="question-circle-o" style={{ color: "red" }} />
                }
                onConfirm={() => this.handleEndRideVisible(true, record)}
              >
                <a>End Ride</a>
              </Popconfirm>
            )}
        </Fragment>
      )
    }
  ];


  customerPaymentColumn = [
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Created",
      dataIndex: "created",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  ];




  componentDidMount = () => {
    this.handleGetCustomerCoupons(this.props.customerId);
    this.handleGetCustomerDetail(this.props.customerId);
    this.handleGetCustomerRides(this.props.customerId);
    this.handleGetCustomerPayments(this.props.customerId);
  };

  handleEndRideVisible = (flag, record) => {
    this.setState({
      isEndRideVisible: !!flag,
      selectedRide: record
    });
  };

  handleEndRide = (rideId, minutes) => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: "rides/endRide",
      rideId: rideId,
      minutes: minutes,
      onSuccess: () => this.handleGetCustomerRides(customerId)
    });
    this.handleEndRideVisible();
  };

  handleAddCustomerCoupon = form => {
    const { dispatch, customerId } = this.props;

    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        const start = fieldsValue.start.toDate();

        dispatch({
          type: "coupons/addCouponToCustomer",
          couponId: fieldsValue.couponId,
          customerId: customerId,
          onSuccess: this.handleGetCustomerCoupons,
          start: start
        });
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

  handleGetCustomerPayments = customerId => {
    const { dispatch } = this.props;
    dispatch({
      type: "customers/customerPayments",
      payload: customerId,
      onSuccess: response => this.setState({ customerPayments: response })
    });
  };

  handleGetCustomerDetail = customerId => {
    const { dispatch } = this.props;
    dispatch({
      type: "customers/getCustomerDetail",
      customerId: customerId,
      onSuccess: response => this.setState({ customerDetail: response })
    });
  };

  handleGetCustomerRides = customerId => {
    const { dispatch } = this.props;
    dispatch({
      type: "rides/getCustomerRides",
      customerId: customerId,
      onSuccess: response => this.setState({ customerRides: response })
    });
  };

  handleDeleteCoupon = customerCouponId => {
    const { dispatch } = this.props;
    dispatch({
      type: "coupons/removeCustomerCoupon",
      id: customerCouponId,
      onSuccess: () => this.handleGetCustomerCoupons(this.props.customerId)
    });
  };

  filterCouponsByAreaId = (coupons, areaId) => {
    return coupons.filter(coupon => coupon.areaId === areaId);
  };

  handleUpdate = (id, fields) => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: "customers/update",
      payload: fields,
      id: id,
      onSuccess: () => {
        this.props.handleGetCustomers();
        this.handleGetCustomerDetail(customerId);
      }
    });
  };

  render() {
    const {
      customerCoupons,
      customerDetail,
      customerPayments,
      customerRides,
      isEndRideVisible,
      selectedRide,
    } = this.state;

    const {
      areas,
      coupons,
      isVisible,
      handleDetailVisible,
      customer
    } = this.props;

    const endRideMethod = {
      handleEndRide: this.handleEndRide,
      handleEndRideVisible: this.handleEndRideVisible
    };

    return (
      <Modal
        destroyOnClose
        title="Add Coupon to Customer"
        visible={isVisible}
        onOk={() => handleDetailVisible(false)}
        onCancel={() => handleDetailVisible(false)}
        width={"95%"}
        style={{ background: "#ECECEC" }}
      >
        {customerDetail && (
          <div>
            {authority.includes("update.customer.detail") && (
              <Card title="Update Customer">
                <UpdateForm
                  areas={areas.data}
                  record={customerDetail}
                  handleUpdate={this.handleUpdate}
                />
              </Card>
            )}

            {authority.includes("get.customer.coupons") && (
              <Card title="Customer Coupons" style={{ marginTop: "2em" }}>
                <Row>
                  <Col>
                    <Table
                      dataSource={customerCoupons}
                      columns={this.customerCouponColumns}
                      scroll={{ x: 1300 }}
                    />
                  </Col>
                </Row>

                {authority.includes("add.coupon.to.customer") && (
                  <AddCouponForm
                    coupons={this.filterCouponsByAreaId(
                      coupons.data,
                      customerDetail.areaId
                    )}
                    handleAddCustomerCoupon={this.handleAddCustomerCoupon}
                  />
                )}
              </Card>
            )}

            <Card title="Customer Rides" style={{ marginTop: "2em" }}>
              <Table
                dataSource={customerRides}
                columns={this.customerRideColumns}
                scroll={{ x: 1300 }}
              />

              {isEndRideVisible && (
                <EndRideForm
                  {...endRideMethod}
                  isEndRideVisible={isEndRideVisible}
                  ride={selectedRide}
                />
              )}
            </Card>

            <Card title="Payment History" style={{ marginTop: "2em" }}>
              <Table
                dataSource={customerPayments}
                columns={this.customerPaymentColumn}
                scroll={{ x: 1300 }}
              />
            </Card>
          </div>
        )}
      </Modal>
    );
  }
}

export default CustomerDetail;
