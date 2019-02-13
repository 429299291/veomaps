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
  Table,
  Checkbox
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import styles from "./CustomerDetail.less";


const FormItem = Form.Item;

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const authority = getAuthority();

const customerStatus = ["NORMAL", "FROZEN", "ERROR"];

const vehicleType = ["Bicycle", "Scooter", "E-Ride", "Car"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];
const REFUND_TYPE = {"FULL": 0, "CUSTOMER_FAULT": 1, "OTHER": 2};

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
    if (value === null || value === "" || isEmailRegex.test(value)) {
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Email">
        {form.getFieldDecorator("email", {
          rules: [{ validator: checkEmailFormat }],
          initialValue: record.email
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Email Status">
        {form.getFieldDecorator("emailStatus", {
          initialValue: record.emailStatus
        })(<Select placeholder="select" style={{ width: "100%" }}>
          <Option key={2} value={2}>
            Educational
          </Option>
          <Option key={1} value={1}>
            Normal
          </Option>
          <Option key={0} value={0}>
            Unverified
          </Option>
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Is Migrated">
        {form.getFieldDecorator("migrated", {
          initialValue: record.migrated
        })(<Select placeholder="select" style={{ width: "100%" }}>
          <Option key={1} value={true}>
            Yes
          </Option>
          <Option key={0} value={false}>
            No
          </Option>
        </Select>)}
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

const MembershipForm = Form.create()(props => {
  const { form, memberships, handleBuyMembership } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();


        handleBuyMembership(fieldsValue);
      });
  };

  return (
    <div>

      {memberships && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Membership"
        >
          {form.getFieldDecorator("membershipId", {
            rules: [
              {
                required: true,
                message: "You have pick a membership"
              }
            ]
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {memberships.map((membership, index) => (
                <Option key={index} value={membership.id}>
                  {"Title: " + membership.title + ", Free Minutes: " + membership.freeMinutes}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Is AutoRenew">
        {form.getFieldDecorator("autoRenew")(
          <Checkbox />
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Is Paid By Balance">
        {form.getFieldDecorator("paidWithBalance")(
          <Checkbox />
        )}
      </FormItem>

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

const RefundForm = Form.create()(props => {
  const {
    isRefundFormVisible,
    handleRefundFormVisible,
    form,
    handleRefund,
    customer,
    needPickupFee,
    handleNeedPickupFee,
    selectedCharge,
    handleRefundTypeChange,
    refundType
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      const params = {}

      params.stripeChargeId = selectedCharge.stripeChargeId;
      params.pickupFee = fieldsValue.pickupFee;
      params.refundNote = fieldsValue.refundNote;
      switch (refundType) {
        case REFUND_TYPE.FULL:
          params.refundAmount = selectedCharge.amount - (selectedCharge.refundAmount ? selectedCharge.refundAmount : 0);
          break;
        case REFUND_TYPE.CUSTOMER_FAULT:
          const amount = selectedCharge.amount;
          params.refundAmount = amount - 0.3 - amount*0.029 - 1;
          break;
        case REFUND_TYPE.OTHER:
          params.refundAmount = fieldsValue.refundAmount;
          break;

      }

      handleRefund(customer.id, params);
      handleRefundFormVisible(false);

    });
  };

  const refundNoteColumns = [{
    title: 'Note',
    dataIndex: 'note',
  }, {
    title: 'Amount',
    dataIndex: 'amount',
  }, {
    title: 'Created',
    dataIndex: "created",
    render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
  }, {
    title: 'Operator',
    dataIndex: 'operator'
  }];

  const checkMoneyFormat = (rule, value, callback) => {



    if (isNaN(value)) {
      callback("Please input a correct number.");
      return;
    }


    if (value < 0) {
      callback("Amount must be larger than 0.");
      return;
    }

    const refundAmount =  selectedCharge.refundAmount === null ? 0 : selectedCharge.refundAmount;
    if (value + refundAmount > selectedCharge.amount) {
      callback("Amount exceeds limit.");
      return;
    }

    callback();

    return;
  };

  return (
    <Modal
      destroyOnClose
      title="Refund"
      visible={isRefundFormVisible}
      width={800}
      onOk={okHandle}
      onCancel={() => handleRefundFormVisible(false)}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Charge Amount"
      >
        <span>{selectedCharge.amount + " usd"}</span>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Stripe Charge Token"
      >
        <span>{selectedCharge.stripeChargeId}</span>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Stripe Customer Token"
      >
        <span>{selectedCharge.stripeCustomerId}</span>
      </FormItem>


      {
        selectedCharge.refundAmount &&
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Refunded Amount"
        >
          <span>{selectedCharge.refundAmount}</span>
        </FormItem>
      }

      {
        selectedCharge.refundNote &&
          <Card title="Refund History">
            <Table
                columns={refundNoteColumns}
                dataSource={JSON.parse(selectedCharge.refundNote)}
                scroll={{ x: 800 }}
            />
          </Card>
      }

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Refund Type"
      >
        <Select
          placeholder="select"
          onSelect={value => handleRefundTypeChange(value)}
          value={refundType}
          style={{ width: "100%" }}>
          <Option key={1} value={REFUND_TYPE.FULL}>
            Full Amount
          </Option>
          <Option key={0} value={REFUND_TYPE.CUSTOMER_FAULT}>
            Customer Fault
          </Option>
          <Option key={0} value={REFUND_TYPE.OTHER}>
            Other
          </Option>
        </Select>

      </FormItem>

      {refundType == REFUND_TYPE.OTHER &&
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Refund Amount"
        >
          {form.getFieldDecorator("refundAmount", {
            rules: [
              {
                validator: checkMoneyFormat
              },
            ],
            initialValue: 0
          })(<InputNumber
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />)}
        </FormItem>
      }

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Note"
      >
        {form.getFieldDecorator("refundNote", {
          rules: [
            {
              required: true,
              message: "note can't be empty"
            }
          ]
        })(<Input.TextArea
          rows={4}
        />)}
      </FormItem>


      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Need Pickup Fee?"
      >
        <Checkbox
          onChange={e =>
            handleNeedPickupFee(e.target.checked)
          }
          checked={needPickupFee}
        />
      </FormItem>


      {needPickupFee &&

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Pick Up Fee"
      >
        {form.getFieldDecorator("pickupFee", {
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value < 100 && value > 0) {
                  callback();
                  return
                }
                callback("pick up fee too large, please contact your supervisor to refund this.");
              }
            }
          ],
          initialValue: 0
        })(<InputNumber
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />)}

      </FormItem>
      }

    </Modal>
  );
});

@connect(({ coupons, areas, loading, customers }) => ({
  areas,
  coupons,
  customers,
  loading: loading.models.customers && loading.models.coupons && loading.models.areas
}))
class CustomerDetail extends PureComponent {
  state = {
    customerCoupons: null,
    isAbleToAddCoupon: false,
    customerDetail: null,
    customerRides: null,
    isEndRideVisible: false,
    selectedRide: null,
    customerMembership: null,
    availableMemberships: null,
    isRefundFormVisible: false,
    selectedCharge: null,
    refundType: REFUND_TYPE.FULL,
    needPickupFee: null,
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
            {authority.includes("delete.customer.coupons") && (
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
      title: "Description",
      dataIndex: "description"
    },
    {
      title: "Stripe Id",
      dataIndex: "stripeChargeId"
    },
    {
      title: "Amount Refunded",
      dataIndex: "refundAmount"
    },
    {
      title: "Refund",
      render: (text, record) => (
        <Fragment>
          {authority.includes("refund.customer.charge") && (
            <Popconfirm
              title="Are you Sure？"
              icon={
                <Icon type="question-circle-o" style={{ color: "red" }} />
              }
              onConfirm={() => this.handleRefundFormVisible(true, record)}
            >
              <a>Refund</a>
            </Popconfirm>
          )}
        </Fragment>
      )
    },
    {
      title: "Created",
      dataIndex: "created",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  ];

  handleRefundFormVisible= (flag, record) =>  {
    this.setState({
      isRefundFormVisible: !!flag,
      selectedCharge: record
    });
  }


  handleNeedPickupFee = value => {
    console.log(value);
    this.setState({needPickupFee: value})
  }




  componentDidMount = () => {
    const {customerId} = this.props;

    this.handleGetCoupons();
    this.handleGetCustomerCoupons(customerId);
    this.handleGetCustomerDetail(customerId);
    this.handleGetCustomerRides(customerId);
    this.handleGetCustomerPayments(customerId);
    this.handleGetCustomerMembership(customerId);
    this.handleGetAvailableCustomerMemberships(customerId);
  };

  handleEndRideVisible = (flag, record) => {
    this.setState({
      isEndRideVisible: !!flag,
      selectedRide: record
    });
  };


  handleRefundTypeChange = type => {
    this.setState({refundType: type})
  }

  handleGetCoupons = () => {
    const {dispatch} = this.props;
    dispatch({
      type: "coupons/get",
      payload: {}
    });
  }

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

  handleRefund = (id, params) => {
    const { dispatch, customerId } = this.props;

    dispatch({
      type: "customers/refund",
      params: params,
      id: id,
      onSuccess: () => this.handleGetCustomerPayments(customerId)
    });

  };


  handleGetCustomerMembership = () => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: "customers/getMembership",
      customerId: customerId,
      onSuccess: response => {
        this.setState({customerMembership: response})
      }
    });
  };

  handleGetAvailableCustomerMemberships = () => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: "customers/getAvailableMemberships",
      customerId: customerId,
      onSuccess: response => {
        this.setState({availableMemberships: response})
      }
    });
  };


  handleBuyMembership = params => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: "customers/updateMembership",
      customerId: customerId,
      params: params,
      onSuccess: () => this.handleGetCustomerMembership()
    });
  }


  render() {
    const {
      customerCoupons,
      customerDetail,
      customerPayments,
      customerRides,
      isEndRideVisible,
      selectedRide,
      customerMembership,
      availableMemberships,
      isRefundFormVisible,
      selectedCharge,
      refundType,
      needPickupFee
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

    const refundMethod = {
      handleRefundFormVisible: this.handleRefundFormVisible,
      handleRefund: this.handleRefund,
      handleRefundTypeChange: this.handleRefundTypeChange,
      handleNeedPickupFee: this.handleNeedPickupFee
    };

    return (
      <Modal
        destroyOnClose
        title="Customer Detail"
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

            {authority.includes("get.rides") &&
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
            </Card> }

            {authority.includes("get.customer.payment") &&
            <Card title="Payment History" style={{ marginTop: "2em" }}>
              <Table
                dataSource={customerPayments}
                columns={this.customerPaymentColumn}
                scroll={{ x: 1300 }}
              />

              {isRefundFormVisible && (
                <RefundForm
                  isRefundFormVisible={isRefundFormVisible}
                  selectedCharge={selectedCharge}
                  customer={customerDetail}
                  {...refundMethod}
                  refundType={refundType}
                  needPickupFee={needPickupFee}
                />
              )}
            </Card>}

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

                {authority.includes("assign.coupon.to.customer") && (
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

            {authority.includes("get.customer.available.membership") &&
            <Card title="Membership" style={{ marginTop: "2em" }}>
              {customerMembership && Object.keys(customerMembership).map(
                (key, index) => <div key={index}>
                  {`${key} :  ${customerMembership[key]}`}
                </div>
              )}
              {authority.includes("customer.buy.membership") &&
                <MembershipForm
                  memberships={availableMemberships}
                  handleBuyMembership={this.handleBuyMembership}
                />
              }

            </Card>
            }
          </div>
        )}
      </Modal>
    );
  }
}

export default CustomerDetail;
