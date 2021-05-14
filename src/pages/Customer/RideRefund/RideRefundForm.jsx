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

const REFUND_TYPE = {"FULL": 0, "CUSTOMER_FAULT": 1, "OTHER": 2};



@connect(({ rides, loading }) => ({
  rides
}))
@Form.create()
class RideRefundForm extends PureComponent {
  
  state = {
    needPickupFee: false,
    refundType: REFUND_TYPE.FULL,
    rideTransactions: []
  };

    handleRefund = (id, params) => {
      const { dispatch, ride } = this.props;

      dispatch({
        type: "rides/refund",
        params: params,
        id: ride.id
      });

    };

    handleGerRideTransaction = (id) => {
      const { dispatch, ride } = this.props;

      dispatch({
        type: "rides/transaction",
        id: ride.id,
      });

    };

    okHandle = () => {
      const {form, handleRefundFormVisiblem, ride} = this.props;
      const {refundType} = this.state;


      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        const params = {}

        params.stripeChargeId = ride.stripeChargeId;
        params.pickupFee = fieldsValue.pickupFee;
        params.refundNote = fieldsValue.refundNote;
        params.refundType = refundType;

        if (refundType === REFUND_TYPE.OTHER) {
          params.rideCreditRefund = fieldsValue.rideCreditRefund;
          params.depositRefund = fieldsValue.depositRefund;
          params.paymentRefund = fieldsValue.paymentRefund;
        }

        //params.refundAmount = amount - 0.3 - amount*0.029 - 1;
      

        handleRefund(customer.id, params);
        handleRefundFormVisible(false);

      });
    };

    refundNoteColumns = [{
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

    checkMoneyFormat = (rule, value, callback) => {

      if (isNaN(value)) {
        callback("Please input a correct number.");
        return;
      }
      if (value < 0) {
        callback("Amount must be larger than 0.");
        return;
      }

      const refundAmount =  ride.refundAmount === null ? 0 : ride.refundAmount;
      if (value + refundAmount > ride.amount) {
        callback("Amount exceeds limit.");
        return;
      }

      callback();

      return;
    };

    handleNeedPickupFee = value => {
      this.setState({needPickupFee: value})
    }

    handleNeedPickupFee = value => {
      this.setState({needPickupFee: value})
    }

  render() {

    const {
      isRefundFormVisible,
      handleRefundFormVisible,
      form,
      dispatch,
      ride
    } = props;

    const {
      needPickupFee,
      refundType
    } = state;


    const metaData = JSON.parse(ride.metaData);

    const stripeCharge = metaData.stripeChargeAmount ? (metaData.stripeChargeAmount/ 100).toFixed(2) : 0 

    return (
      <Modal
        destroyOnClose
        title="Refund Ride"
        visible={isRefundFormVisible}
        width={800}
        onOk={okHandle}
        onCancel={() => handleRefundFormVisible(false)}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Credit Card Charge Amount" 
        >
          <span>{stripeCharge + " usd"}</span>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Balance Deduction"
        >
          <span>{(ride.charge -  stripeCharge) + " usd"}</span>
        </FormItem>
  
  
        {
          ride.refundAmount &&
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Refunded Amount"
          >
            <span>{ride.refundAmount}</span>
          </FormItem>
        }
  
        {
          ride.refundNote &&
            <Card title="Refund History">
              <Table
                  columns={refundNoteColumns}
                  dataSource={JSON.parse(ride.refundNote)}
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

  }

}

export default RideRefundForm;