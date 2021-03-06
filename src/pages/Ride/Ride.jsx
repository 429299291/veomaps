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
import RideRefundForm from "@/pages/Ride/RideRefundForm";
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
// import { getAuthority } from "@/utils/authority";
// const authority = getAuthority();
const RenderSimpleForm=(props)=> {
  const [form] = Form.useForm()
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss'
  const handleReaset = ()=>{
    props.handleFormReset()
    form.resetFields()
  }
  let formData = props.filterCriteria
  //render error
  if(formData.timeRange){
    if(formData.timeRange.start){
      setTimeout(() => {
        const start = props.filterCriteria.timeRange.start;
        const end = props.filterCriteria.timeRange.end;
        start ? formData.timeRange = [moment(start, dateFormat), moment(end, dateFormat)] : null
      }, 20);
    }
  }
  setTimeout(() => {
    formData.hasOwnProperty('notEnded') ? null : formData.notEnded = 0
    formData.hasOwnProperty('lockMethod') ? null : formData.lockMethod = null
    formData.hasOwnProperty('unlockMethod') ? null : formData.unlockMethod = null
  }, 20);
  form.setFieldsValue(formData)
return (
  <Form form={form} initialValues={{
    notEnded: 0,
  }}>
    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
    <Col span={5}>
        <FormItem label="Phone" name='phone' rules={[
          {message: 'PHONE Error!',type:'number'},
        ]}>
            <InputNumber placeholder="Phone"  style={{width:'100%'}} maxLength='10'/>
        </FormItem>
      </Col>
      <Col span={6}>
        <FormItem label="Vehicle Number" name='vehicleNumber' rules={[
          {message: 'Vehicle Number Error!',type:'number'},
        ]}>
            <InputNumber placeholder="Vehicle Number" style={{width:'100%'}}/>
        </FormItem>
      </Col>
      <Col span={5}>
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
      <Col span={8}>
        <FormItem
          label="Time"
          name='timeRange'
        >
            <RangePicker
              // style={{ width: "90%" }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
            />
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
      <Col span={6}>
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
      <Col span={5}>
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
    </Row>

    <Row gutter={{ md: 16, lg: 24, xl: 48 }}>
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
      <Col span={3} offset={11}>
        {`count: ${props.total}`}
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
import Bicycle from "../../assets/bike_mark_lock.png";
import scooter from "../../assets/scooter-pin-lockedbackend.png";
import EBike from "../../assets/pedal-bike-pinbackend.png";
import COSMO from "../../assets/cosmo_normal.png";
const vehicleTypeIcon = [Bicycle, scooter,EBike,COSMO];
import {
  lockOperationWay,
} from "@/constant";
// const lockOperationWay = [
//   "GPRS",
//   "BLUETOOTH",
//   "ADMIN",
//   "ABORT",
//   "TIMEOUT",
//   "PRE_AUTH_FAIL",
//   "REACH_MAX"
// ];
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
      render: val => <span>{vehicleType[val]}<img src={vehicleTypeIcon[val]} alt="" style={{width:"15px"}}/></span>
    },
    {
      // title: "Lock Way",
      title: "Lock Method",
      dataIndex: "lockMethod",
      render: val => <span>{lockOperationWay[val]}</span>
    },
    {
      title: "Charge",
      sorter: (a, b) => a.charge - b.charge,
      dataIndex: "charge"
    },
    {
      title: "Tax",
      sorter: (a, b) => a.tax - b.tax,
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
      title: "Host",
      dataIndex: "isHost",
      render: val => val ? 'host' : 'guest'
    },
    {
      title: "Start",
      dataIndex: "start",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "End",
      dataIndex: "end",
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
      sorter: (a, b) => a.minutes - b.minutes,
      render: (text, record) => {
        const minutsDiff = record.end
          ? record.minutes
          : moment().diff(moment(record.start), "minutes");
        return <span>{minutsDiff}</span>;
      }
    },
    {
      title: "Distance",
      sorter: (a, b) => a.distance - b.distance,
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
    return ride.end && (!meta || !meta.refunded) && ride.minutes
  };

  handleGetRides = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;
    filterCriteria.vehicleNumber ? null : delete filterCriteria.vehicleNumber
    filterCriteria.notEnded === 0 ? delete filterCriteria.notEnded  : null
    filterCriteria.lockMethod === null ? delete filterCriteria.lockMethod : null
    filterCriteria.unlockMethod === null ? delete filterCriteria.unlockMethod : null
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
    console.log(params.timeRange);
    if(params.timeRange){
      params.timeRange ={
        start:moment(params.timeRange[0]).format("YYYY-MM-DDTHH:mm:ss"),
        end:moment(params.timeRange[1]).format("YYYY-MM-DDTHH:mm:ss")
      }
  }
  //   if(params.timeRange){
  //     params.timeRange ={
  //       start:moment(params.timeRange[0]).utcOffset(0).format("YYYY-MM-DDTHH:mm:ss"),
  //       end:moment(params.timeRange[1]).utcOffset(0).format("YYYY-MM-DDTHH:mm:ss")
  //     }
  // }
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
    this.props.selectedAreaId ? params.areaIds= [this.props.selectedAreaId] : delete params.areaIds
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
          start:moment(fieldsValue.timeRange[0]).format("YYYY-MM-DDTHH:mm:ss"),
          end:moment(fieldsValue.timeRange[1]).format("YYYY-MM-DDTHH:mm:ss")
        }
    }
    // if (fieldsValue.phone){
    //     fieldsValue.phone = fieldsValue.phone.replace(/-/g,"").replace(/\(/g,'').replace(/\)/g,'').replace(/^\+1/,'').trim().replace(/\s*/g,"")
    //     fieldsValue.phone == '' ? delete fieldsValue.phone : null
    // }
    // fieldsValue.vehicleNumber ? null : delete fieldsValue.vehicleNumber
    // fieldsValue.notEnded === 0 ? delete fieldsValue.notEnded  : null
    // fieldsValue.lockMethod === null ? delete fieldsValue.lockMethod : null
    // fieldsValue.unlockMethod === null ? delete fieldsValue.unlockMethod : null
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
      selectedAreaId ? values.areaIds= [selectedAreaId] : delete values.areaIds
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
      minutes: minutes.minutes,
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
    //   if(fieldsValue.timeRange){
    //     fieldsValue.timeRange ={
    //       start:moment(fieldsValue.timeRange[0]).utcOffset(0).format("YYYY-MM-DDTHH:mm:ss"),
    //       end:moment(fieldsValue.timeRange[1]).utcOffset(0).format("YYYY-MM-DDTHH:mm:ss")
    //     }
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
        {/* {isRefundModalVisible && (
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
        )} */}
        {isRefundModalVisible && (
          <RideRefundForm
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
