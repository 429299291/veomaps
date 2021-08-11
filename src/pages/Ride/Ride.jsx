import React, { PureComponent, Fragment,useState,useEffect } from "react";
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
  DatePicker,
  message
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import VehicleDetail from "@/pages/Vehicle/VehicleDetail";
import RideDetail from "@/pages/Vehicle/RideDetail";
import CustomerDetail from "@/pages/Customer/CustomerDetail";
import { formatPhoneNumber } from "@/utils/utils";

import { exportCSVFile } from "../../utils/utils";

const rideCsvHeader = {
  id: "id",
  vehicleType: "vehicleType",
  imei: "imei",
  vehicleNumber: "vehicleNumber",
  minutes: "minutes",
  charge: "charge",
  lockMethod: "lockMethod",
  unlockMethod: "unlockMethod",
  start: "start",
  end: "end",
  area: "area",
  state: "state",
  areaId: "areaId",
  created: "created",
  vehicleId: "vehicleId",
  customerId: "customerId",
  distance: "Distance"
};

const { RangePicker } = DatePicker;

import styles from "./Ride.less";
import { compose, withProps } from "recompose";
import {
  GoogleMap,
  Marker,
  Polygon,
  Polyline,
  withGoogleMap,
  withScriptjs
} from "react-google-maps";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();
const RenderSimpleForm=(props)=> {
  const [form] = Form.useForm()
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss'
  const handleReaset = ()=>{
    props.handleFormReset()
    form.resetFields()
  }
  if(props.filterCriteria.timeRange){
    if(props.filterCriteria.timeRange.start){
      setTimeout(() => {
        const start = props.filterCriteria.timeRange.start;
        const end = props.filterCriteria.timeRange.end;
        start? props.filterCriteria.timeRange = [moment(start, dateFormat), moment(end, dateFormat)] : null
        // props.filterCriteria.timeRange = [moment('2015-01-01T12:22:22', dateFormat), moment('2021-05-01T12:33:33', dateFormat)] 
      }, 20);
    }
  }
  setTimeout(() => {
    props.filterCriteria.hasOwnProperty('notEnded') ? null : props.filterCriteria.notEnded = 0
    props.filterCriteria.hasOwnProperty('lockMethod') ? null : props.filterCriteria.lockMethod = null
    props.filterCriteria.hasOwnProperty('unlockMethod') ? null : props.filterCriteria.unlockMethod = null
  }, 20);
  form.setFieldsValue(props.filterCriteria)
return (
  <Form form={form} initialValues={{
    notEnded: 0,
  }}>
    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
    <Col span={5}>
        <FormItem label="Phone" name='phone' rules={[
          {message: 'PHONE Error!',type:'number'},
        ]}>
            <InputNumber placeholder="Phone"  style={{width:'100%'}} maxlength='10'/>
        </FormItem>
      </Col>
      <Col span={5}>
        <FormItem label="Vehicle Number" name='vehicleNumber' rules={[
          {message: 'Vehicle Number Error!',type:'number'},
        ]}>
            <InputNumber placeholder="Vehicle Number" style={{width:'100%'}}/>
        </FormItem>
      </Col>
      <Col span={4}>
        <FormItem label="In Use" name='notEnded'>
            <Select placeholder="select" style={{ width: "100%" }}>
              {rideType.map((status, index) => (
                <Option key={index} value={status.value}>
                  {status.name}
                </Option>
              ))}
              {/* <Option value={null}>All</Option> */}
            </Select>
        </FormItem>
      </Col>
      <Col span={5}>
        <FormItem label="Lock Method" name='lockMethod'>
            <Select placeholder="select" style={{ width: "100%" }}>
              {lockOperationWay.map((status, index) => (
                <Option key={index} value={index}>
                  {lockOperationWay[index]}
                </Option>
              ))}
              <Option value={null}>All</Option>
            </Select>
        </FormItem>
      </Col>
      <Col span={5}>
        <FormItem label="Unlock Method" name='unlockMethod'>
            <Select placeholder="select" style={{ width: "100%" }}>
              {lockOperationWay.map((status, index) => (
                <Option key={index} value={index}>
                  {lockOperationWay[index]}
                </Option>
              ))}
              <Option value={null}>All</Option>
            </Select>
        </FormItem>
      </Col>
    {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}> */}
      <Col span={6}>
        <FormItem
          label="Time"
          name='timeRange'
        >
            <RangePicker
              // style={{ width: "90%" }}
              format="YYYY-MM-DDTHH:mm:ss"
              showTime
            />
        </FormItem>
      </Col>
      <Col span={4}>
        <FormItem
          label="Vehicle Type"
          name='vehicleType'
        >
            <Select placeholder="select">
              {vehicleType.map((status, index) => (
                <Option key={index} value={index}>
                  {vehicleType[index]}
                </Option>
              ))}
              <Option value={null}>All</Option>
            </Select>
        </FormItem>
      </Col>
    {/* </Row> */}
    </Row>

    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Col span={3}>
        {`count: ${props.total}`}
      </Col>
      <Col span={10}>
        <span className={styles.submitButtons} >
          <Button  onClick={()=>{props.handleSearch(form.getFieldsValue(true))}}>
            Search
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReaset}>
            Reset
          </Button>
        </span>
      </Col>
    </Row>
  </Form>
);
}

const EndRideForm = (props => {
  const {
    isEndRideVisible,
    handleEndRide,
    handleEndRideVisible,
    ride,
  } = props;
  const [form] = Form.useForm()
  form.setFieldsValue(ride)
  const okHandle = () => {
    form.submit()
    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;
    //   form.resetFields();
    //   handleEndRide(ride.id, fieldsValue);
    // });
  };

  const minutes = Math.round((new Date() - new Date(ride.start)) / 60000); // This will give difference in milliseconds

  return (
    <Modal
      destroyOnClose
      title="End Ride"
      visible={isEndRideVisible}
      forceRender
      onOk={okHandle}
      onCancel={() => handleEndRideVisible(false)}
    >
      <Form form={form} onFinish={()=>{handleEndRide(ride.id, form.getFieldsValue(true))}}>
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

const getViolateType = (val, record) => {
  const violateColor = val >= 0 ? violateTypeColor[val] : "black";
  const limitColor =
    record.limitType >= 0 ? violateTypeColor[record.limitType] : "black";
  const violateContent = (
    <span style={{ color: violateColor }}>
      {" "}
      {val >= 0 ? violateType[val] : "unknown"}
    </span>
  );
  const limitContent = (
    <span style={{ color: limitColor }}>
      {" "}
      {record.vehicleType === 1 ? " | " + limitType[record.limitType] : ""}
    </span>
  );

  return (
    <span>
      {violateContent}
      {limitContent}
    </span>
  );
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
// const rideType = ["True", "False"];
const rideType = [{name:"True",value:true},{name:"False",value:false},{name:"All",value:0}];
const vehicleType = ["Bicycle", "Scooter", "E-Bike", "COSMO"];
const lockOperationWay = [
  "GPRS",
  "BLUETOOTH",
  "ADMIN",
  "ABORT",
  "TIMEOUT",
  "PRE_AUTH_FAIL",
  "REACH_MAX"
];
const rideState = ["unconfirmed", "success", "error"];
const rideStateColor = ["#e5bb02", "#0be024", "#ff0000"];

const violateType = [
  "Normal",
  "In restricted fence",
  "out of geo fence",
  "out of force parking zone",
  "unknown"
];
const limitType = ["Normal", "No Ride Zone", "limit speed zone", "unknown"];
const violateTypeColor = ["black", "#ff0000", "#b72126", "#1300ff", "#f1fc64"];

import { fenceType, fenceTypeColor } from "@/constant";
import { number } from "prop-types";

const refundReason = [
  "Other",
  "Lock Issue",
  "Accidental Deposit",
  "No Longer in Market",
  "Fraud",
  "Scooter Issue",
  "App Issue",
  "Phone Issue"
];

const queryStatus = ["FROZEN"];
const RefundForm = (props => {
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
      refundType: fieldsValue.refundType,
      refundReason: refundReasons[fieldsValue.refundReason],
      note: fieldsValue.note
    };

    if (rideRefundCalculateResult) {
      const refundDetail = rideRefundCalculateResult.refundDetail;
      payload.refundDetail = refundDetail;
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
        refundType:'DEPOSIT',
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
          <Select>
            <Option value={"DEPOSIT"}>Deposit</Option>
            <Option value={"CREDIT_CARD"}>Credit Card</Option>
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
          <Select onChange={refundWayChange}>
            <Option value={"FULLY_REFUND"}>Fully Refund</Option>
            <Option value={"PARTIAL_REFUND"}>Partial Refund</Option>
          </Select>
      </FormItem>

      <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.refundWay !== currentValues.refundWay}
    >
      {({ getFieldValue }) =>
        getFieldValue('refundWay') == 'PARTIAL_REFUND' ? (
          <Row>
            <Col>
            <span> originally {ride.minutes} minutes.  Refund Ride as</span>
            </Col>
            <Col span={2}>
              <FormItem
                name='minutes'
                >
                  <InputNumber style={{width:'auto'}}/>
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
                          .paymentCharge)}
                  </th>
                  <th>
                    $
                    {rideRefundCalculateResult.billingInfo.subTotal +
                      rideRefundCalculateResult.billingInfo.tax}
                  </th>

                  <th>
                    $
                    {-1 *
                      (rideRefundCalculateResult.rideTransaction
                        .depositChange +
                        rideRefundCalculateResult.rideTransaction
                          .rideCreditChange -
                        rideRefundCalculateResult.rideTransaction
                          .paymentCharge) -
                      rideRefundCalculateResult.billingInfo.subTotal -
                      rideRefundCalculateResult.billingInfo.tax}
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
  );
});
/* eslint react/no-multi-comp:0 */
class Ride extends PureComponent {
  state = {
    isEndRideVisible: false,
    filterCriteria: {},
    selectedRecord: null,
    rideRefundCalculateResult: null
  };

  columns = [
    {
      title: "Phone",
      render: (text, record) => (
        <a
          onClick={() =>
            this.setState({ selectedCustomerId: record.customerId }, () =>
              this.handleCustomerDetailModalVisible(true)
            )
          }
        >
          {formatPhoneNumber(record.phone + "")}
        </a>
      )
    },
    {
      title: "Vehicle Number",
      render: (text, record) => (
        <a
          onClick={() =>
            this.setState({ selectedVehicleId: record.vehicleId }, () =>
              this.handleVehicleDetailModalVisible(true)
            )
          }
        >
          {record.vehicleNumber}
        </a>
      )
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      render: val => <span>{vehicleType[val]}</span>
    },
    {
      // title: "Lock Way",
      title: "Lock Method",
      dataIndex: "lockMethod",
      render: val => <span>{lockOperationWay[val]}</span>
    },
    {
      title: "Charge",
      dataIndex: "charge"
    },
    {
      title: "Tax",
      dataIndex: "tax"
    },
    {
      title: "Violate Type",
      dataIndex: "violateType",
      render: getViolateType
    },
    {
      title: "Unlock Method",
      dataIndex: "unlockMethod",
      render: val => <span>{lockOperationWay[val]}</span>
    },
    {
      title: "Start",
      dataIndex: "start",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "End",
      dataIndex: "end",
      sorter: true,
      render: (val, record) => {
        const endTime = val
          ? moment(val).format("YYYY-MM-DD HH:mm:ss")
          : "not finished";

        const metaData = JSON.parse(record.metaData);

        const endBy = metaData && metaData.adminEmail;

        return <span>{endTime + (endBy ? "|" + endBy : "")}</span>;
      }
    },
    {
      title: "Minutes",
      render: (text, record) => {
        const minutsDiff = record.end
          ? record.minutes
          : moment().diff(moment(record.start), "minutes");
        return <span>{minutsDiff}</span>;
      }
    },
    {
      title: "Distance",
      dataIndex: "distance"
    },
    {
      title: "operation",
      render: (text, record) => (
        <Fragment>
          {!record.end && ( 
            <a onClick={() => this.handleEndRideVisible(true, record)}>
              End Ride
            </a>
           )}

          <Divider type="vertical" />

          {this.isRideRefundable(record) && (
            <a onClick={() => this.handleRefundModalVisible(true, record)}>
              Refund
            </a>
          )}

          <Divider type="vertical" />

          <a onClick={() => this.handleDetailModalVisible(true, record)}>
            Detail
          </a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleSearch();
  }

  isRideRefundable = ride => {
    const meta = JSON.parse(ride.metaData);

    // return (authority.includes("refund.ride")) && ride.end && (!meta || !meta.refunded);
    return ride.end && (!meta || !meta.refunded);
  };

  handleGetRides = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;
    dispatch({
      type: "rides/get",
      payload: filterCriteria
    });
  };

  handleGetRideRefundCalculateResult = (id, payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: "rides/getRefundCalculateResult",
      payload: payload,
      id: id,
      onSuccess: result => this.setState({ rideRefundCalculateResult: result })
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;
    const params = {
      ...filterCriteria
    };
    params.pagination={
      page:pagination.current-1,
      pageSize:pagination.pageSize,
      sort:{
        sortBy:'start',
        direction:'desc'
      }
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    params.vehicleNumber ? null : delete params.vehicleNumber
    params.notEnded === 0 ? delete params.notEnded  : null
    params.lockMethod === null ? delete params.lockMethod : null
    params.unlockMethod === null ? delete params.unlockMethod : null
    this.setState({ filterCriteria: params });
    dispatch({
      type: "rides/get",
      payload: params
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { filterCriteria } = this.state;
    // form.resetFields();
    let params = {
      pagination:{
        page: 0,
        pageSize: 10,
        sort:{
          sortBy:'start',
          direction:'desc'
        }
      }
    }
    this.props.selectedAreaId ? params.areaIds= [this.props.selectedAreaId] : null
    this.setState(
      {
        filterCriteria: params
      },
      () => this.handleGetRides()
    );
  };

  handleSearch = fieldsValue => {
    const { selectedAreaId } = this.props;
    const { filterCriteria } = this.state;
    if (fieldsValue) {
      if(fieldsValue.timeRange){
        fieldsValue.timeRange ={
          start:moment(fieldsValue.timeRange[0]).utcOffset(0).format("YYYY-MM-DDTHH:mm:ss"),
          end:moment(fieldsValue.timeRange[1]).utcOffset(0).format("YYYY-MM-DDTHH:mm:ss")
        }
    }
    // if (fieldsValue.phone){
    //     fieldsValue.phone = fieldsValue.phone.replace(/-/g,"").replace(/\(/g,'').replace(/\)/g,'').replace(/^\+1/,'').trim().replace(/\s*/g,"")
    //     fieldsValue.phone == '' ? delete fieldsValue.phone : null
    // }
    fieldsValue.vehicleNumber ? null : delete fieldsValue.vehicleNumber
    fieldsValue.notEnded === 0 ? delete fieldsValue.notEnded  : null
    fieldsValue.lockMethod === null ? delete fieldsValue.lockMethod : null
    fieldsValue.unlockMethod === null ? delete fieldsValue.unlockMethod : null
  }

      let values = Object.assign({}, fieldsValue, {
        pagination:{
          page: 0,
          pageSize: 10,
          sort:{
            sortBy:'start',
            direction:'desc'
          }
        }
      });
      selectedAreaId ? values.areaIds= [selectedAreaId] : values.areaIds = []
      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetRides()
      );
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleVehicleDetailModalVisible = flag =>
    this.setState({ vehicleDetailModalVisible: flag });

  handleCustomerDetailModalVisible = flag =>
    this.setState({ customerDetailModalVisible: flag });

  handleRefundModalVisible = (flag, record) => {
    this.setState({
      isRefundModalVisible: !!flag,
      selectedRecord: record,
      rideRefundCalculateResult: null
    });
  };

  handleDetailModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    const { filterCriteria, rideImageUrl } = this.state;

    if (!!flag) {

      record.imageId && dispatch({
        type: "rides/image",
        rideId: record.id,
        onSuccess: imageUrl =>
          this.setState({
            rideImageUrl: imageUrl
          }),
        onError: () => {
          this.setState({
            rideImageUrl: undefined
          })
        }
      });

      dispatch({
        type: "rides/getRoute",
        rideId: record.id,
        onSuccess: pathInfo =>
          this.setState({
            selectedRidePathInfo: pathInfo
          })
      });

      dispatch({
        type: "geo/getFences",
        areaId: record.areaId
      });

      dispatch({
        type: "rides/billingInfo",
        id: record.id,

        onSuccess: billingInfo =>
          this.setState({
            selectedRideBillingInfo: billingInfo
          })
      });

      this.setState({
        detailModalVisible: true,
        selectedRecord: record
      });
    } else {
      this.setState({
        detailModalVisible: false,
        selectedRecord: undefined,
        selectedRidePathInfo: undefined,
        rideImageUrl: undefined,
        selectedRideBillingInfo: undefined
      });
    }
  };

  handleEndRide = (rideId, minutes) => {
    const { dispatch } = this.props;
    dispatch({
      type: "rides/endRide",
      rideId: rideId,
      minutes: minutes,
      onSuccess: this.handleGetRides
    });
    this.handleEndRideVisible();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleSearch();
    }
  }

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: "rides/update",
      payload: fields,
      id: id,
      onSuccess: () => this.handleGetRides()
    });

    this.handleUpdateModalVisible();
  };

  handleRefundRide = (rideId, payload) => {
    const { dispatch } = this.props;

    dispatch({
      type: "rides/refund",
      payload: payload,
      id: rideId,
      onSuccess: this.handleGetRides
    });

    this.handleRefundModalVisible();
  };

  handleEndRideVisible = (flag, record) => {
    this.setState({
      isEndRideVisible: !!flag,
      selectedRecord: record
    });
  };

  formatCsvData = rides => {
    const { areaNames, selectedAreaId } = this.props;
    return rides.map(ride => {
      return {
        id: ride.id,
        vehicleType: vehicleType[ride.vehicleType],
        imei: ride.imei,
        vehicleNumber: ride.vehicleNumber,
        minutes: ride.minutes,
        charge: ride.charge,
        lockMethod: lockOperationWay[ride.lockMethod],
        unlockMethod: lockOperationWay[ride.unlockMethod],
        start: moment(ride.start).format("YYYY-MM-DDTHH:mm:ss"),
        end: moment(ride.end).format("YYYY-MM-DDTHH:mm:ss"),
        area: areaNames[ride.areaId],
        state: ride.state,
        areaId: ride.areaId,
        created: moment(ride.created).format("MM-DD-YYYY HH:mm:ss"),
        vehicleId: ride.vehicleId,
        customerId: ride.customerId,
        distance: ride.distance
      };
    });
  };

  handleExportData = () => {
    const { selectedAreaId } = this.props;
    const { filterCriteria } = this.state;
    const [form] = Form.useForm()
    const fieldsValue = form.getFieldsValue(true)
    // form.validateFields((err, fieldsValue) => {

      // if (fieldsValue.timeRange) {
      //   fieldsValue.rideStart = moment(fieldsValue.timeRange[0])
      //     .utcOffset(0)
      //     .format("YYYY-MM-DDTHH:mm:ss");
      //   fieldsValue.rideEnd = moment(fieldsValue.timeRange[1])
      //     .utcOffset(0)
      //     .format("YYYY-MM-DDTHH:mm:ss");
      //   fieldsValue.timeRange = undefined;
      // }

      const values = Object.assign(
        {},
        filterCriteria,
        { areaId: selectedAreaId },
        fieldsValue,
        {
          // pagination:{
          //   page: null,
          //   pageSize: null,
          // },
          areaId: selectedAreaId
        }
      );

      this.setState(
        {
          filterCriteria: values
        },
        this.finishExportData
      );
    // });
  };

  finishExportData() {
    const { filterCriteria } = this.state;
    const { areaNames, selectedAreaId, dispatch } = this.props;
    dispatch({
      type: "rides/getAll",
      payload: filterCriteria,
      onSuccess: data => {
        exportCSVFile(
          rideCsvHeader,
          this.formatCsvData(data),
          areaNames[selectedAreaId]
        );
      }
    });
  }

  render() {
    const { rides, areas, geo, loading, selectedAreaId } = this.props;
    const {
      isEndRideVisible,
      detailModalVisible,
      selectedRecord,
      filterCriteria,
      selectedRidePathInfo,
      vehicleDetailModalVisible,
      selectedVehicleId,
      customerDetailModalVisible,
      selectedCustomerId,
      rideImageUrl,
      isRefundModalVisible,
      rideRefundCalculateResult,
      selectedRideBillingInfo
    } = this.state;

    const endRideMethod = {
      handleEndRide: this.handleEndRide,
      handleEndRideVisible: this.handleEndRideVisible
    };

    const pagination = {
      defaultCurrent: 1,
      // current: filterCriteria.currentPage,
      pageSize: filterCriteria.pageSize,
      total: rides.total
    };

    return (
      <PageHeaderWrapper title="Ride List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <RenderSimpleForm filterCriteria={this.state.filterCriteria} total={this.props.rides.total} handleFormReset={this.handleFormReset} handleSearch={this.handleSearch}/>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: rides.data, pagination: pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1400 }}
            />

            {selectedAreaId >= 1 && (
              <div>
                <Button
                  style={{ marginTop: "1em" }}
                  onClick={this.handleExportData}
                >
                  Export
                </Button>
              </div>
            )}
          </div>
        </Card>

        {isEndRideVisible && (
          <EndRideForm
            {...endRideMethod}
            isEndRideVisible={isEndRideVisible}
            ride={selectedRecord}
          />
        )}

        {selectedRecord &&
          detailModalVisible && (
            <RideDetail
              isVisible={detailModalVisible}
              ride={selectedRecord}
              ridePath={selectedRidePathInfo}
              rideImageUrl={rideImageUrl}
              billingInfo={selectedRideBillingInfo}
              handleDetailModalVisible={this.handleDetailModalVisible}
            />
          )}

        {vehicleDetailModalVisible &&
          selectedVehicleId && (
            <VehicleDetail
              isVisible={vehicleDetailModalVisible}
              handleDetailVisible={this.handleVehicleDetailModalVisible}
              vehicleId={selectedVehicleId}
            />
          )}

        {customerDetailModalVisible && (
          <CustomerDetail
            isVisible={customerDetailModalVisible}
            handleDetailVisible={this.handleCustomerDetailModalVisible}
            customerId={selectedCustomerId}
            handleGetRides={this.handleGetRides}
          />
        )}

        {isRefundModalVisible && (
          <RefundForm
            isModalVisible={isRefundModalVisible}
            handleModalVisible={this.handleRefundModalVisible}
            handleRefundRide={this.handleRefundRide}
            ride={selectedRecord}
            handleGetRideRefundCalculateResult={
              this.handleGetRideRefundCalculateResult
            }
            rideRefundCalculateResult={rideRefundCalculateResult}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ rides, areas, geo, loading }) => {
  return {
    rides,
    areas: areas.data,
    geo,
    selectedAreaId: areas.selectedAreaId,
    areaNames: areas.areaNames,
    loading: loading.models.rides
  }
}
export default connect(mapStateToProps)(Ride) 
