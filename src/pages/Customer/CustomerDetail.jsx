import React, { PureComponent, Fragment, useState } from "react";
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
  Checkbox,
  Switch,
  Spin
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import styles from "./CustomerDetail.less";
import {transactionType} from "@/constant";


const FormItem = Form.Item;

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const authority = getAuthority();

const customerStatus = ["NORMAL", "FROZEN", "ERROR"];

const vehicleType = ["Bicycle", "Scooter", "E-Bike", "COSMO"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];
const REFUND_TYPE = {"FULL": 0, "CUSTOMER_FAULT": 1, "OTHER": 2};

const REFUND_REASON = ["first timer forgot to lock", "first timer locked outside geofence", "too large/accidental deposit", "locking didn't end trip", 
"cx no longer lives in market",
"cx unhappy with geofence/NRZ",
"cx unhappy w/ family riding",
"fraud",
"misc. app glitch",
"cx phone died",
"cx couldn't find working ride",
"accident",
];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


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
    customerActiveDays: null,
    customerTransactions: null,
    customerApprovedViolationCount: "Loading"
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
            {/* {authority.includes("") && ( */}
              <a href="#" style={{ color: "red" }}>
                Delete
              </a>
            {/* )} */}
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
      title: "Charge",
      dataIndex: "charge"
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
      render: (text, record) => {
        return <Fragment>
          {!record.end &&
            // authority.includes("") && (
              <Popconfirm
                title="Are you Sure？"
                icon={
                  <Icon type="question-circle-o" style={{ color: "red" }} />
                }
                onConfirm={() => this.handleEndRideVisible(true, record)}
              >
                <a>End Ride</a>
              </Popconfirm>
            /* )*/}
        </Fragment>
      }
    }
  ];


  customerTransactionColumn = [
    {
      title: "Type",
      dataIndex: "type",
      render: (value, record) =>  <span>{ transactionType[value] + (value === 0 && record.metaData ? `(${JSON.parse(record.metaData).adminEmail})` : "") } </span>
    },
    {
      title: "Deposit Change",
      dataIndex: "depositChange",
      render: val =>  <span>{ Math.round(val * 100 ) / 100 } </span>
    },
    {
      title: "Ride Credit Change",
      dataIndex: "rideCreditChange",
      render: val =>  <span>{  Math.round(val * 100 ) / 100 } </span>
    },
    {
      title: "Payment Charge",
      dataIndex: "paymentCharge",
      render: val =>  <span>{  Math.round(val * 100 ) / 100  } </span>
    },
    {
      title: "Created",
      dataIndex: "created",
      render: value =>  <span>{ moment(value).format("YYYY-MM-DD HH:mm:ss")} </span>
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
          {/* {authority.includes("") && (
            
          )} */}

            <Popconfirm
              title="Are you Sure？"
              icon={
                <Icon type="question-circle-o" style={{ color: "red" }} />
              }
              onConfirm={() => this.handleRefundFormVisible(true, record)}
            >
              <a>Refund</a>
            </Popconfirm>
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
    this.setState({needPickupFee: value})
  }




  componentDidMount = () => {
    const {customerId} = this.props;

    this.handleGetCoupons();
    this.handleGetCustomerCoupons(customerId);
    this.handleGetCustomerDetail(customerId);
    this.handleGetCustomerRides(customerId);
    this.handleGetCustomerPayments(customerId);
    this.handleGetAvailableCustomerMemberships();
    this.handleGetCustomerTransactions(customerId);
    this.handleGetCustomerApprovedViolationCount(customerId);
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

  handleRefundReasonChange = reason => {
    this.setState({refundReason: reason})
  }

  handleGetCoupons = () => {
    const {dispatch} = this.props;
    dispatch({
      type: "coupons/get",
      payload: {}
    });
  }

  handleEndRide = (rideId, minutes) => {
    const { dispatch, customerId, handleGetRides } = this.props;
    dispatch({
      type: "rides/endRide",
      rideId: rideId,
      minutes: minutes,
      onSuccess: () => {
        this.handleGetCustomerRides(customerId); 
        handleGetRides();
      }
    });
    this.handleEndRideVisible();
  };

  handleAddCustomerCoupon = fieldsValue => {
    const { dispatch, customerId } = this.props;
    if(fieldsValue.start&&fieldsValue.couponId){
      const start = fieldsValue.start.toDate();
      dispatch({
        type: "coupons/addCouponToCustomer",
        couponId: fieldsValue.couponId,
        customerId: customerId,
        onSuccess: this.handleGetCustomerCoupons,
        start: start
      });
    }else{
      return false
    }
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
      onSuccess: response => {
        //group ride to calculate active date

        const activeDate = {}

        response.map(ride => {

          const day = moment(ride.start).format("YYYY-MM-DD") ;
          activeDate[day] = true; 
        })
        this.setState({ customerRides: response, customerActiveDays: Object.keys(activeDate).length });
      }
    });
  };

  handleGetCustomerApprovedViolationCount = customerId => {
    const { dispatch } = this.props;

    dispatch({
      type: "violation/getCustomerApprovedViolationCount",
      customerId: customerId,
      onSuccess: result => {

        this.setState({ customerApprovedViolationCount: result});

      }
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
    const { dispatch, customerId, handleGetCustomers } = this.props;
    dispatch({
      type: "customers/update",
      payload: fields,
      id: id,
      onSuccess: () => {
        handleGetCustomers && handleGetCustomers();
        message.success("customer update success!");
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


  handleGetCustomerTransactions = () => {
    const { dispatch, customerId } = this.props;

    dispatch({
      type: "customers/getTransactions",
      customerId: customerId,
      onSuccess: response => {
        this.setState({customerTransactions: response})
      }
    });
  };

  handleGetAvailableCustomerMemberships = onSuccess => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: "customers/getAvailableMemberships",
      customerId: customerId,
      onSuccess: response => {
        this.setState({availableMemberships: response}, onSuccess)
      }
    });
  };


  handleBuyMembership = (planId, callback) => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: "customers/buyMembership",
      customerId: customerId,
      planId: planId,
      onSuccess: () =>  {
        this.handleGetAvailableCustomerMemberships(callback) 
      },
      onFail: callback
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
      needPickupFee,
      customerActiveDays,
      customerTransactions,
      refundReason,
      customerApprovedViolationCount
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
      handleRefundReasonChange: this.handleRefundReasonChange,
      handleNeedPickupFee: this.handleNeedPickupFee
    };
    const EndRideForm = (props => {
      const {
        isEndRideVisible,
        handleEndRide,
        handleEndRideVisible,
        ride
      } = props;
      const [form] = Form.useForm()
      const okHandle = () => {

          handleEndRide(ride.id, form.getFieldsValue(true));
      };
    
      const minutes = Math.round((new Date() - new Date(ride.start)) / 60000); // This will give difference in milliseconds
    
      return (
        <Modal
          destroyOnClose
          title="End Ride"
          visible={isEndRideVisible}
          onOk={okHandle}
          forceRender
          onCancel={() => handleEndRideVisible(false)}
        >
          <Form>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Minutes"
            name='minutes'
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          </Form>
        </Modal>
      );
    });
    
    const UpdateForm = (props => {
      const { handleUpdate, areas, record, customerActiveDays, customerApprovedViolationCount } = props;
      const [form] = Form.useForm()
      form.setFieldsValue(record)
      const okHandle = () => {
            handleUpdate(record.id, form.getFieldsValue(true));
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
          <Form form={form}>
          <FormItem labelCol={{ span: 10}} wrapperCol={{ span: 10 }} label="Balance (Deposit + Ride Credit)">
            <span> {record.deposit + record.rideCredit} </span>
          </FormItem>
        
          <FormItem
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 10 }}
            label="Ride Credit Amount"
            name='rideCredit'
            rules={[{ validator: checkMoneyFormat }]}
          >
            <Input placeholder="Please Input" />
          </FormItem>
    
          <FormItem
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 10 }}
            label="Deposit Amount"
            name='deposit'
            rules={[{ validator: checkMoneyFormat }]}
          >
            <Input placeholder="Please Input" />
          </FormItem>
    
    
    
          
          <FormItem
            labelCol={{ span: 10}}
            wrapperCol={{ span: 10 }}
            label="FULL NAME"
            name='fullName'
          >
           <Input placeholder="Please Input" />
          </FormItem>
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Email" name='email' rules={[{ validator: checkEmailFormat }]}>
            <Input placeholder="Please Input" />
          </FormItem>
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Email Status" name='emailStatus' >
            <Select placeholder="select" style={{ width: "100%" }}>
              <Option key={2} value={2}>
                Educational
              </Option>
              <Option key={1} value={1}>
                Normal
              </Option>
              <Option key={0} value={0}>
                Unverified
              </Option>
            </Select>
          </FormItem>
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Is Migrated" name='migrated'>
            <Select placeholder="select" style={{ width: "100%" }}>
              <Option key={1} value={true}>
                Yes
              </Option>
              <Option key={0} value={false}>
                No
              </Option>
            </Select>
          </FormItem>
    
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Is Low Income" name='lowIncome'>
            <Select placeholder="select" style={{ width: "100%" }}>
              <Option key={1} value={true}>
                Yes
              </Option>
              <Option key={0} value={false}>
                No
              </Option>
            </Select>
          </FormItem>
    
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Auto Reload" name='autoReloaded'>
            <Select placeholder="select" style={{ width: "100%" }}>
              <Option key={1} value={true}>
                Yes
              </Option>
              <Option key={0} value={false}>
                No
              </Option>
            </Select>
          </FormItem>
    
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Education Mode Activated" name='isEducationModeActivated'>
            <Select placeholder="select" style={{ width: "100%" }}>
              <Option key={1} value={true}>
                Yes
              </Option>
              <Option key={0} value={false}>
                No
              </Option>
            </Select>
          </FormItem>
    
          {customerStatus && (
            <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 10 }}
              label="Status"
              name='status'
              rules={
                [
                  {
                    required: true,
                    message: "You have pick a status"
                  }
                ]
              }
            >
                <Select placeholder="select" style={{ width: "100%" }}>
                  {customerStatus.map((status, index) => (
                    <Option key={index} value={index}>
                      {customerStatus[index]}
                    </Option>
                  ))}
                </Select>
            </FormItem>
          )}
    
          {areas && (
            <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Area" name='areaId' 
              rules={
                [
                  {
                    required: true,
                    message: "You have pick a area"
                  }
                ]
              }
            >
            
                <Select placeholder="select" style={{ width: "100%" }}>
                  {areas.map(area => (
                    <Option key={area.id} value={area.id}>
                      {area.name}
                    </Option>
                  ))}
                </Select>
            </FormItem>
          )}
    
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Notes" name='notes'>
            <TextArea placeholder="Please Input" />
          </FormItem>
    
          <FormItem
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 10 }}
            label="Is Driver License Verified"
            name='licenseStatus'
          >
            <Select>
                <Option value={1}>Verified</Option>
                <Option value={0}>Not Verified</Option>
               </Select>
          </FormItem>
    
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10}} label="Phone Model">
            <span> {record.phoneModel} </span>
          </FormItem>
          <FormItem labelCol={{ span: 10}} wrapperCol={{ span: 10 }} label="App Version">
            <span> {record.appVersion} </span>
          </FormItem>
    
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Register Date">
            <span> { moment(record.created).format("YYYY/MM/DD hh:mm:ss")} </span>
          </FormItem>
    
            <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Active Days">
              <span> {customerActiveDays} </span>
            </FormItem> 
    
    
    
              <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="Customer Approved Violation Count">
                <span> {customerApprovedViolationCount} </span>
              </FormItem> 
          
    
          <Row>
            <Col>
              <Button
                type="primary"
                onClick={okHandle}
              >
                Update Customer
              </Button>
            </Col>
          </Row>
          </Form>
        </div>
      );
    });
    
    const MembershipForm = (props => {
      const { memberships, handleBuyMembership } = props;
      const [form] = Form.useForm();
      
      const activeMembership = memberships.filter(m => m.activated).reduce((o , m) => m, null);

      const [allowToBuy, setAllowToBuy] = useState(false); 

      const [isLoading, setIsLoading] = useState(false);


      const okHandle = () => {
        let fieldsValue = form.getFieldsValue(true)
        if(!fieldsValue.selectedMembership) return false
        
        setIsLoading(true);
        const setNotLoadiing = () => setIsLoading(false);
        handleBuyMembership(fieldsValue.selectedMembership, setNotLoadiing);
    };

      return (
        <div>
          {isLoading ?
            <Spin size="large" />
            :
            <Form form={form}>
            {memberships && (
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="Membership"
                name='selectedMembership'
              >
                  <Select 
                      placeholder="select" style={{ width: "100%" }} 
                      defaultValue ={activeMembership ? activeMembership.id : undefined}
                      onChange={val => setAllowToBuy(!activeMembership && !!val)}    
                      disabled={!!activeMembership}            
                  >
                    { (activeMembership ? [activeMembership] : memberships).map((membership, index) => (
                      <Option key={index} value={membership.id}>
                        { membership.name + "," + membership.description}
                      </Option>
                    ))}
                  </Select>
              </FormItem>
            )}
      
      
            <Row>
              <Col>
                <Button
                  type="primary"
                  onClick={okHandle}
                  disabled={!allowToBuy}
                >
                  Buy Membership
                </Button>
              </Col>
            </Row>
            </Form>
          }         
        </div>
      );
    });
    
    const AddCouponForm = (props => {
      const { coupons, handleAddCustomerCoupon } = props;
      const [form]= Form.useForm();
      return (
        <div>
          <Form form={form}>
          {coupons && (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="Coupon"
              name='couponId'
              rules={
                [
                  {
                    required: true,
                    message: "You have pick a coupon to add"
                  }
                ]
              }
            >
                <Select placeholder="select" style={{ width: "100%" }}>
                  {coupons.map(coupon => (
                    <Option key={coupon.id} value={coupon.id}>
                      Name: <b> {coupon.name} </b> free minutes:{" "}
                      {coupon.freeMinutes} Valid days: <b> {coupon.days} </b>
                    </Option>
                  ))}
                </Select>
            </FormItem>
          )}
    
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Start Time"
            name='start'
            rules={
              [
                {
                  required: true,
                  message: "You have to pick a time to start!"
                }
              ]
            }
          >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select Start Time"
              />
          </FormItem>
    
          <Row>
            <Col>
              <Button
                type="primary"
                onClick={() => handleAddCustomerCoupon(form.getFieldsValue(true))}
                // disabled={!form.isFieldsTouched()}
              >
                Add Coupon
              </Button>
            </Col>
          </Row>
          </Form>
        </div>
      );
    });
    
    const RefundForm = (props => {
      const {
        isRefundFormVisible,
        handleRefundFormVisible,
        handleRefund,
        customer,
        needPickupFee,
        handleNeedPickupFee,
        selectedCharge,
        handleRefundTypeChange,
        handleRefundReasonChange,
        refundType,
        refundReason
      } = props;
      const [form] = Form.useForm()
    
      const okHandle = () => {
          let fieldsValue = form.getFieldsValue(true)
          const params = {}
    
          params.stripeChargeId = selectedCharge.stripeChargeId;
          params.pickupFee = fieldsValue.pickupFee;
          params.refundNote = (refundReason ?  refundReason : "") + "|"  + fieldsValue.refundNote;
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
    
      };
    
      const handleNote = val => {
        const len = val.length;
    
        const splitNote = val.split("|");
    
        if (val) {
          if (splitNote.length == 2) {
            return "Note: " + splitNote[1] + ". " + "Reason: " + REFUND_REASON[parseInt(splitNote[0], 10)];
          } else {
            return val;
          }
        } else {
          return "";
        }
      }
    
      const refundNoteColumns = [{
        title: 'Note',
        dataIndex: 'note',
        render: val => <span>{handleNote(val)}</span>
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
          forceRender
          title="Refund"
          visible={isRefundFormVisible}
          width={800}
          onOk={okHandle}
          onCancel={() => handleRefundFormVisible(false)}
        >
          <Form form={form}>
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
    
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Refund Reason"
          >
            <Select
              placeholder="select"
              onSelect={value => handleRefundReasonChange(value)}
              value={refundReason}
              style={{ width: "100%" }}>
              {
                REFUND_REASON.map((item,key) => 
                <Option key={key} value={key}>
                {item}
              </Option>)
              }
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
    </Form>
        </Modal>
      );
    });
    return (
      <Modal
        destroyOnClose
        forceRender
        title="Customer Detail"
        visible={isVisible}
        onOk={() => handleDetailVisible(false)}
        onCancel={() => handleDetailVisible(false)}
        width={"95%"}
        style={{ background: "#ECECEC" }}
      >
        {customerDetail && (
          <div>
            {(
              <Card title="Update Customer">
                <UpdateForm
                  areas={areas.data}
                  record={customerDetail}
                  handleUpdate={this.handleUpdate}
                  customerActiveDays={customerActiveDays}
                  customerApprovedViolationCount={customerApprovedViolationCount}
                />
              </Card>
            )}

          { customerTransactions &&
            <Card title="Customer Transactions" style={{ marginTop: "2em" }}>

              <Table
                dataSource={customerTransactions}
                columns={this.customerTransactionColumn}
                scroll={{ x: 1300 }}
              />

            </Card> 
          }

            {
            <Card title="Customer Rides" style={{ marginTop: "2em" }}>
              {customerRides && <div style={{marginBottom: "1em"}}> count : {customerRides.length}</div>  }
            
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

            {
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
                  refundReason={refundReason}
                />
              )}
            </Card>}

            {(
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

                { (
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

            {availableMemberships &&  
              <Card title="Membership" style={{ marginTop: "2em" }}>
                <MembershipForm
                    memberships={availableMemberships}
                    handleBuyMembership={this.handleBuyMembership}
                  />
              </Card>
            }
          
            
          </div>
        )}
      </Modal>
    );
  }
}
const mapStateToProps = ({ coupons, areas, loading, customers }) => {
  return {
    areas,
    coupons,
    customers,
    loading: loading.models.customers && loading.models.coupons && loading.models.areas
      }
}
export default connect(mapStateToProps)(CustomerDetail) 
