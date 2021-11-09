import React,{useState,useEffect} from 'react'
import styles from "./Ride.less";
import {
    Form,
    Modal,
    Select,
    Row,
    Col,
    InputNumber,
    Button,
    Icon,
    Input
  } from "antd";
  const { TextArea } = Input;
  const FormItem = Form.Item;

function RideRefundForm (props) {
    const refundReasons = [
        "Other",
        "Lock Issue",
        "Accidental Deposit",
        "No Longer in Market",
        "Fraud",
        "Scooter Issue",
        "App Issue",
        "Phone Issue"
      ];
      const [shouldOkButtonDisable, setShouldOkButtonDisable] = useState(false);
      const {
        isModalVisible,
        handleModalVisible,
        handleRefundRide,
        ride,
        handleGetRideRefundCalculateResult,
        rideRefundCalculateResult
      } = props;
      useEffect(() => {
        setShouldOkButtonDisable ((form.getFieldValue("refundWay") == "PARTIAL_REFUND") && !rideRefundCalculateResult);
     }, [rideRefundCalculateResult])
      const [form] = Form.useForm()
      const okHandle = () => {
        form.submit()
      };
    
      const onFinish=(fieldsValue)=>{


        const payload = {
          type: fieldsValue.refundType,
          refundReason: refundReasons[fieldsValue.refundReason],
          note: fieldsValue.note
        };
    
        if (rideRefundCalculateResult) {
          const refundDetail = rideRefundCalculateResult.refundDetail;
          payload.amount = refundDetail.refundTotal;
        }
        handleRefundRide(ride.id, payload);
      }
      const fenceHandleChange =(value)=>{
        console.log(value);
      }
      const refundWayChange = (value) =>{
        setShouldOkButtonDisable ((value == "PARTIAL_REFUND") && !rideRefundCalculateResult);
      }
      return (
        <Modal
          destroyOnClose
          title="Refund Ride"
          visible={isModalVisible}
          width="800px"
          forceRender
          onOk={okHandle}
          onCancel={() => handleModalVisible(false)}
          okButtonProps={{ disabled: shouldOkButtonDisable }}
          okText="Refund"
        >
          <Form form={form} 
          initialValues={{
            refundType:'TO_CARD',
            // refundReason:'Lock Issue',
            refundReason:1,
            refundWay:'Fully Refund'
          }}
          onFinish={()=>{onFinish(form.getFieldsValue(true))}}>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="Refund Type"
            name='refundType'
          >
              <Select style={{ width: 200 }}>
                <Option value={"TO_DEPOSIT"}>Deposit</Option>
                <Option value={"TO_CARD"}>Credit Card</Option>
              </Select>
          </FormItem>
    
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="Refund Reason"
            name='refundReason'
          >
              <Select style={{ width: 200 }} onChange={fenceHandleChange}>
                {refundReasons.map((reason, index) => (
                  <Option key={index} value={index}>
                    {reason}
                  </Option>
                ))}
              </Select>
          </FormItem>
          <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.refundReason !== currentValues.refundReason}
        >
          {({ getFieldValue }) =>
            getFieldValue('refundReason') == 0 ? (
              <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="Notes"
              name='note'
              rules={
                [
                  {
                    required: true,
                    message: "note can't be empty",
                    max: 50,
                    min: 1
                  }
                ]
              }
            >
              <TextArea autosize={{ minRows: 3, maxRows: 10 }} />
            </FormItem>
            ) : null
          }
        </Form.Item>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="Refund Way"
            name='refundWay'
          >
              <Select onChange={refundWayChange} style={{ width: 200 }}>
                <Option value={"FULLY_REFUND"}>Fully Refund</Option>
                <Option value={"PARTIAL_REFUND"}>Partial Refund</Option>
              </Select>
          </FormItem>
    
          <Form.Item
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          shouldUpdate={(prevValues, currentValues) => prevValues.refundWay !== currentValues.refundWay}
        >
          {({ getFieldValue }) =>
            getFieldValue('refundWay') == 'PARTIAL_REFUND' ? (
              <Row>
                <Col>
                <span style={{paddingLeft:'90px'}}> originally {ride.minutes} minutes.  Refund Ride as</span>
                </Col>
                <Col span={2}>
                  <FormItem
                    name='minutes'
                    >
                      <InputNumber style={{width:'auto'}} min={0}/>
                  </FormItem>
                </Col>
                <Col>minutes</Col>
                <Button
                  style={{ marginLeft: "2em" }}
                  type="primary"
                  onClick={ () => {
                    const minutes = form.getFieldValue("minutes");
                    const refundType = form.getFieldValue("refundType");
                    handleGetRideRefundCalculateResult(ride.id, {
                      minutes: minutes,
                      refundType: refundType
                    });
                  }}
                >
                  Estimate
                </Button>
            </Row>
            ) : null
          }
        </Form.Item>
    
          {rideRefundCalculateResult &&(
          <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.refundWay !== currentValues.refundWay}
        >
          {({ getFieldValue }) =>
            getFieldValue('refundWay') == 'PARTIAL_REFUND' ? (
              <Row>
              <Col span={6} />
              <Col span={18}>
                {rideRefundCalculateResult.info && (
                  <div style={{ marginTop: "0.5em" }}>
                    {" "}
                    <Icon type="warning" /> {rideRefundCalculateResult.info}{" "}
                  </div>
                )}
    
                <table
                  className={styles.refundTable}
                  style={{ marginTop: "0.5em" }}
                >
                  <tbody>
                    <tr>
                      <th>original total amount</th>
                      <th>new total amount</th>
                      <th>total to refund</th>
                      {/* <th>mfm</th>
                        <th>mfrm</th>
                        <th>charge frequency</th>
                        <th>charge price</th>
                        <th>unlock fee</th>
                        <th>is low income</th>
                        <th> max charge </th> */}
                    </tr>
                    <tr>
                      <th>
                        $
                        {-1 *
                          (rideRefundCalculateResult.rideTransaction
                            .depositChange +
                            rideRefundCalculateResult.rideTransaction
                              .rideCreditChange -
                            rideRefundCalculateResult.rideTransaction
                              .paymentCharge -
                              rideRefundCalculateResult.rideTransaction
                              .holdCapture)}
                      </th>
                      <th>
                        $
                        {rideRefundCalculateResult.billingInfo.subTotal +
                          rideRefundCalculateResult.billingInfo.tax}
                      </th>
    
                      <th>
                        $
                        {(-1 *
                          (rideRefundCalculateResult.rideTransaction
                            .depositChange +
                            rideRefundCalculateResult.rideTransaction
                              .rideCreditChange -
                            rideRefundCalculateResult.rideTransaction
                              .paymentCharge-
                              rideRefundCalculateResult.rideTransaction
                              .holdCapture) -
                          rideRefundCalculateResult.billingInfo.subTotal -
                          rideRefundCalculateResult.billingInfo.tax).toFixed(2)}
                      </th>
                    </tr>
                  </tbody>
                </table>
    
                <div style={{ marginTop: "0.5em" }}>
                  estimated refund transaction:{" "}
                </div>
    
                <table
                  className={styles.refundTable}
                  style={{ marginTop: "0.5em" }}
                >
                  <tbody>
                    <tr>
                      <th>refund to deposit</th>
                      <th>refund to ride credit</th>
                      <th>refund to credit card</th>
                      <th>refund hold capture</th>
                    </tr>
                    <tr>
                      <th>
                        ${rideRefundCalculateResult.refundDetail.refundToDeposit}
                      </th>
                      <th>
                        $
                        {
                          rideRefundCalculateResult.refundDetail
                            .refundToRideCredit
                        }
                      </th>
                      <th>
                        ${rideRefundCalculateResult.refundDetail.refundToCard}
                      </th>
                      <th>
                        ${rideRefundCalculateResult.refundDetail.refundHoldCapture}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            ) : null
          }
        </Form.Item>
            )}
            </Form>
        </Modal>
      )
}

export default RideRefundForm