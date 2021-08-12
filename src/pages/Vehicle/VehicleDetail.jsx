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
  Slider,
  Table,
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import errorVehicle from "../../assets/bike_report_lock.png";
import errorVehicleUnlock from "../../assets/bike_report.png";
import lowBattery from "../../assets/bike_mark_low_lock.png";
import vehicleUnlock from "../../assets/bike_mark.png";
import ebike from "../../assets/ebike_mark.png";
import bike from "../../assets/bike_mark_lock.png";
import { compose, withProps } from "recompose";
import LocationMap from "./LocationMap";
import { GoogleMap, Marker, withGoogleMap, withScriptjs, Polygon, Polyline } from "react-google-maps";

const FormItem = Form.Item;

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

import { fenceType, fenceTypeColor } from "@/constant";
const authority = getAuthority();

const errorStatusIndexs = {
  0: "Normal",
  1: "Error",
  3: "Deactivated",
  5: "Rebalance",
  6: "Maintain",
  7: "Out of Service"
};

const errorStatus = Object.keys(errorStatusIndexs);

const vehicleType = ["Bicycle", "Scooter", "E-Bike", "COSMO"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const vehicleOrders = ["", "sign in", "heart", "unlock", "lock", "location", "info", "find", "version", "ip", "error", "alert", "heart period", "iccid", "shut down", "ok", "mac info", "connect", "disconnect", "version update", "Report", "External Device"];
const EndRideForm = (props => {
  const {
    isEndRideVisible,
    handleEndRide,
    handleEndRideVisible,
    ride
  } = props;
  const [form] = Form.useForm()
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
      <Form form={form} onFinish={()=>{handleEndRide(ride.id, form.getFieldsValue(true));}}>
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
const VehicleControlForm = (props => {
  const okHandle = () => {
    form.submit()
  };

  const {
    record,
    handleControl,
  } = props;
  const [form] = Form.useForm()

  const marks = {
    0: 'Not Set',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    13: '13',
    14: '14',
    15: '15',
    16: '16',
    17: '17',
    18: '18',
    19: '19',
    20: '20',
    21: '21',
    22: '22',
    23: '23',
    24: '24',
    25: '25',
  }

  return (
    <div>
      <Form form={form} onFinish={()=>{handleControl(record.id, form.getFieldsValue(true))}}>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Light"
        name='changeLight'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Mode"
        name='changeMode'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Cruise Control"
        name='cruiseControl'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Inch Status"
        name='inchStatus'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Start Type"
        name='startType'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Non-Zero Start</Option>
            <Option value={2}>Zero Start</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="High Speed Limit"
        name='highSpeedLimit'
      >

          <Slider  max={25} step={null} marks={marks} />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Med Speed Limit"
        name='midSpeedLimit'
      >

          <Slider  max={25} step={null} marks={marks} />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Low Speed Limit"
        name='lowSpeedLimit'
      >
          <Slider  max={25} step={null} marks={marks} />
      </FormItem>
      <Button
        type="primary"
        onClick={okHandle}
        disabled={!form.isFieldsTouched()}
        style={{ marginRight: "1em", marginTop: "0.5em" }}
      >
        Update Control
      </Button>
      </Form>
    </div>
  );
});

const VehicleControlExtensionForm = (props => {
  const okHandle = () => {
    form.submit()
  };

  const {
    record,
    handleControlExtension,
  } = props;
  const [form] = Form.useForm()

  return (
    <div>
      <Form form={form} onFinish={()=>{handleControlExtension(record.id, form.getFieldsValue(true))}}>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Headlight"
        name='headLight'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Taillight"
        name='tailLight'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Speed Mode"
        name='speedMode'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Low Speed</Option>
            <Option value={2}>Medium Speed</Option>
            <Option value={3}>High Speed</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Throttle"
        name='throttleStatus'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
      </FormItem>
      <Button
        type="primary"
        onClick={okHandle}
        disabled={!form.isFieldsTouched()}
        style={{ marginRight: "1em", marginTop: "0.5em" }}
      >
        Update Control Extension
      </Button>
      </Form>
    </div>
  )
});
const UpdateForm = (props => {
  const { handleUpdate, areas, record, changeLockStatus, updateLocation, alertVehicle, getVehicleStatus, restartVehicle,handleVoice } = props;
  const [form] = Form.useForm()
  let voiceType = null
  let times = null
  const [voiceVisible, setVoiceVisible] = useState(false);
  const onChangeVoice =(value)=>{
    voiceType = value.target.value
  }
  const handleVoiceVisible = ()=>{
    setVoiceVisible(true)
  }
  form.setFieldsValue(record)
  const okHandle = () => {
    form.submit()
  };
  const voiceHandleCancel = ()=>{
    setVoiceVisible(false)
  }
  const voiceHandleOk =()=>{
      if(!times){
        message.error('times select')
      }else if(!voiceType){
        message.error('voiceType select')
      }else{
        handleVoice(voiceType,times)
        setVoiceVisible(false)
      }
  }
  const timesOnChange = (value)=>{
    times = value
  }
  return (
    <div>
      <Form form={form} onFinish={()=>{handleUpdate(record.id, form.getFieldsValue(true))}}>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Vehicle Id"
      >
        <div>
          {record.id}
        </div>
      </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Status"
          // name='errorStatus'
          name='status'
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

                <Option value={0} >Normal</Option>

                <Option value={1} >Error</Option>

                <Option disabled={true} value={3} >Deativated</Option>

                <Option disabled={true} value={5} >Rebalance</Option>

                <Option disabled={true} value={6} >Maintain</Option>

                <Option disabled={true} value={7} >Out of Service</Option>


              </Select>

        </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Lock Status"
      >
        <div>
          {record.lockStatus === 0 ? "Unlock" : "Lock"}
        </div>
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Imei"
      >
        <div>
          {record.imei}
        </div>
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="iccid"
      >
        <div>
          {record.iccid}
        </div>
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Firmware"
      >
        <div>
          {record.firmware}
        </div>
      </FormItem>


      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Is Connected"
      >
        <div>
          {record.connected === true ? "true" : "false"}
        </div>
      </FormItem>

      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} 
          name='areaId'
          rules={
            [
              {
                required: true,
                message: "You have pick a area"
              }
            ]
          }
          label="Area">
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
        </FormItem>
      )}

    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} 
      name='provider'
      label="Provider">
                <Select placeholder="select" style={{ width: "100%" }}>
                   <Option key={0} value={0}>
                      Omni
                    </Option>
                    <Option key={0} value={1}>
                      Meige
                    </Option>
                </Select>
            </FormItem>

      <Row>
        <Col>
          <Button
            type="primary"
            onClick={okHandle}
            // disabled={!form.isFieldsTouched() && !authority.includes("update.vehicle.detail")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Update Vehicle
          </Button>
          <Button
            type="primary"
            onClick={changeLockStatus}
            // disabled={!authority.includes("unlock.vehicle") }
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            {(record.lockStatus === 1 ? "Unlock" : "Lock") + " Vehicle"}
          </Button>
          <Button
            type="primary"
            onClick={alertVehicle}
            // disabled={!authority.includes("alert.vehicle")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Beep Remotely
          </Button>
          <Button
            type="primary"
            onClick={updateLocation}
            // disabled={!authority.includes("update.vehicle.location")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Update Location
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
        <Button
            type="primary"
            onClick={getVehicleStatus}
            // disabled={!form.isFieldsTouched() && !authority.includes("get.status")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Get Status
          </Button>
          <Button
            type="primary"
            onClick={handleVoiceVisible}
            // disabled={!form.isFieldsTouched() && !authority.includes("get.status")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Voice
          </Button>
          <Modal title="Voice type" visible={voiceVisible} onOk={voiceHandleOk} onCancel={voiceHandleCancel} centered={true}>
            times:<InputNumber min={1} max={100} onChange={timesOnChange} />
            <Radio.Group onChange={onChangeVoice}>
              <Radio value={0}>SELF ALERT</Radio>
              <Radio value={12}>Help Alarm</Radio>
              <Radio value={13}>Ayuda Alarm</Radio>
              <Radio value={14}>Warning</Radio>
              {/* <Radio value={1}>INVALID PARKING</Radio>
              <Radio value={2}>SLOW SPEED ZONE</Radio>
              <Radio value={3}>DO NOT SHAKE</Radio>
              <Radio value={4}>START RIDE</Radio>
              <Radio value={5}>END RIDE</Radio>
              <Radio value={6}>NO RIDE ZONE</Radio>
              <Radio value={7}>LOW BATTERY</Radio> */}
            </Radio.Group>
          </Modal>
          {/* <Button
            icon="plus"
            type="primary"
            onClick={restartVehicle}
            disabled={!form.isFieldsTouched() && !authority.includes("restart.vehicle")}
            style={{marginRight: "1em", marginTop: "0.5em"}}
          >
            Restart
          </Button> */}

        </Col>

      </Row>
      </Form>
    </div>
  );
});
class VehicleDetail extends PureComponent {
  state = {
    vehicleRides: null,
    isEndRideVisible: false,
    selectedRide: null,
    vehicleOrders: [],
    orderTablePagination: null,
    // voiceVisible:false,
    vehicelRidesCurrent:1,
    vehicleRidesTotalSize:null
  };

  vehicleRideColumns = [
    {
      title: "Customer Phone",
      dataIndex: "phone"
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
            (
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

  handleRenderingOrderLocation = (shouldShowMap, record) => {



    this.setState({
        orderIdToShowMap: shouldShowMap ? record.id : undefined 
    });

  }

  getLocationOrderContent = (orderIdToShowMap, record) => {

    

    if (orderIdToShowMap ===  record.id) {

      const locationSplit =  record.content.split("=");

      if (locationSplit.length !== 3) {


          try {



           const coords = record.content.match(/[+-]?\d+(\.\d+)?/g).map(parseFloat);
            return <div>   
              <LocationMap record = {this.state.record} orderLocation={{lat:coords[0], lng: coords[1]}}/> 

                  <Button onClick={e => {
                    this.handleRenderingOrderLocation(false);
                    e.stopPropagation();
                  }} > Close </Button>

            </div>
          


          } catch (error) {
            message.error(error);
            return record.content;
          }

    

        
          
          return record.content;

      }

  

      return <div> 
        <LocationMap record = {this.state.record} orderLocation={{lat: Number(locationSplit[1].split(",")[0]), lng: Number(locationSplit[2])}}/> 
        
        <Button onClick={e => {
          this.handleRenderingOrderLocation(false);
          e.stopPropagation();
        }} > Close </Button>
        </div>



    } else {

      return record.content;

    }

  }

  vehicleOrdersColumn = [
    {
      title: "Type",
      dataIndex: "orderId",
      render: val => <span>{vehicleOrders[val]}</span>
    },
    {
      title: "Content",
      dataIndex: "content",
      render: (val, record) => vehicleOrders[record.orderId] === "location" ?  <a onClick={() => this.handleRenderingOrderLocation(true, record) }> {this.getLocationOrderContent(this.state.orderIdToShowMap, record)} </a> : <span >{val}</span> 
    },
    {
      title: "Time",
      dataIndex: "created",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  ];



  vehicleRideColumns = [
    {
      title: "Customer Phone",
      dataIndex: "phone"
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
    }
  ];



  componentDidMount = () => {
    this.handleGetVehicle(this.props.vehicleId);
    // this.handleGetVehicleOrders(this.props.vehicleId);
    this.handleGetVehicleRides(this.props.vehicleId);
  };

  getAreaGeoInfo = vehicleAreaId => {
    const { dispatch } = this.props;

    authority.includes("get.fences") && dispatch({
      type: "geo/getFences",
      areaId: vehicleAreaId
    });
  };

  handleGetVehicle = vehicleId => {
    const { dispatch } = this.props;
    dispatch({
      type: "vehicles/getVehicle",
      vehicleId: vehicleId,
      onSuccess: response => this.setState({ record: response }, () => this.getAreaGeoInfo(response.areaId)),
    });
  };

  getVehicleStatus = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/getStatus",
      vehicleId: vehicleId,
      onSuccess: () => {
        setTimeout(() => {
          this.handleGetVehicle(vehicleId);
        }, 4000)
      }
    });
  }
  handleVoice = (value,times) => {
    const { dispatch, vehicleId,voiceVisible } = this.props;
    if(value !== null){
      dispatch({
        type: "vehicles/controlVoice",
        payload: {
          vehicleId:vehicleId,
          type:value,
          times
        }
      });
    }else{
    }
  }
  restartVehicle = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/restart",
      vehicleId: vehicleId,
      onSuccess: () => {
        setTimeout(() => {
          this.handleGetVehicle(vehicleId);
        }, 4000)
      }
    });
  }

  handleEndRideVisible = (flag, record) => {
    this.setState({
      isEndRideVisible: !!flag,
      selectedRide: record
    });
  };

  handleEndRide = (rideId, minutes) => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "rides/endRide",
      rideId: rideId,
      minutes: minutes,
      onSuccess: () => this.handleGetVehicleRides(vehicleId)
    });
    this.handleEndRideVisible();
  };

  // handleGetVehicleOrders = id => {
  //   const { dispatch } = this.props;

    
  //     // dispatch({
  //     //   type: "vehicles/getOrders",
  //     //   id: id,
  //     //   onSuccess: response => this.setState({ vehicleOrders: response, orderTablePagination: { current: Math.round((response.length / 10) + 1) } })
  //     // });
  // };

  handleGetVehicleRides = vehicleId => {
    const { dispatch } = this.props;
      dispatch({
        type: "rides/getVehicleRides",
        payload:{
          vehicleId,
          pagination:{
            page: 0,
            pageSize: 10,
            sort:{
              sortBy:'start',
              direction:'desc'
            }
          }
        },
        onSuccess: (response,totalSize,current) => this.setState({ 
          vehicleRides: response,vehicleRidesTotalSize:totalSize,vehicelRidesCurrent:current
         })
      });
  };

  handleUpdate = (id, fields) => {
    const { dispatch, vehicleId, handleGetVehicles } = this.props;
    // if(fields.errorStatus){
      dispatch({
        type: "vehicles/update",
        payload: fields,
        id: id,
        onSuccess: () => {
          handleGetVehicles && handleGetVehicles();
          this.handleGetVehicle(vehicleId);
        }
      });
    // }
  };

  redefineProperties = (object) => {
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        if (object[property] === undefined) {
          object[property] = 0;
        }
      }
    }
    return object;
  }

  handleControl = (id, fields) => {
    const { dispatch, vehicleId } = this.props;
    const redefinedFields = this.redefineProperties(fields);
    dispatch({
      type: "vehicles/control",
      payload: redefinedFields,
      id: id,
    })
  }

  handleControlExtension = (id, fields) => {
    const { dispatch, vehicleId } = this.props;
    const redefinedFields = this.redefineProperties(fields);
    dispatch({
      type: "vehicles/controlExtension",
      payload: redefinedFields,
      id: id,
    })
  }

  changeLockStatus = () => {
    const { dispatch, vehicleId, handleGetVehicles } = this.props;

    const { record } = this.state;

    const type = record.lockStatus === 1 ? "vehicles/unlock" : "vehicles/lock";



    dispatch({
      type: type,
      id: vehicleId,
      onSuccess: () => {
        handleGetVehicles && handleGetVehicles();
        setTimeout(() => {
          this.handleGetVehicle(vehicleId);
        }, 1500)
      }
    });

  };

  alertVehicle = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/alertVehicle",
      vehicleId: vehicleId
    });
  };



  handleOrderTableChange = (pagination, filtersArg, sorter) => this.setState({ orderTablePagination: pagination })



  updateLocation = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/updateLocation",
      id: vehicleId,
      onSuccess: () => {
        // setTimeout(() => {
        //   this.handleGetVehicleOrders(vehicleId);
        // }, 3000)
      }
    });
  }

  render() {
    const {
      vehicleRides,
      isEndRideVisible,
      vehicleOrders,
      selectedRide,
      vehicelRidesCurrent,
      vehicleRidesTotalSize,
      record,
      orderTablePagination
    } = this.state;
    const {
      areas,
      coupons,
      isVisible,
      handleDetailVisible,
      vehicle,
      geo
    } = this.props;

    const endRideMethod = {
      handleEndRide: this.handleEndRide,
      handleEndRideVisible: this.handleEndRideVisible
    };
    const customerRidesPagination = (value)=>{
      const { dispatch } = this.props;
      dispatch({
        type: "rides/getVehicleRides",
        payload:{
          vehicleId:this.props.vehicleId,
          pagination:{
            page: value.current-1,
            pageSize: value.pageSize || 10 ,
            sort:{
              sortBy:'start',
              direction:'desc'
            }
          }
        },
        onSuccess: (response,totalSize,current) => this.setState({
          vehicleRides: response,vehicleRidesTotalSize:totalSize,vehicelRidesCurrent:current
         })
      });
    }
    return (
      <Modal
        destroyOnClose
        title="Vehicle Detail"
        visible={isVisible}
        onOk={() => handleDetailVisible(false)}
        onCancel={() => handleDetailVisible(false)}
        width={"95%"}
        style={{ background: "#ECECEC" }}
      >
        <div>


          <Card title="Update Vehicle">
            {record && <UpdateForm
              areas={areas.data}
              record={record}
              handleUpdate={this.handleUpdate}
              changeLockStatus={this.changeLockStatus}
              updateLocation={this.updateLocation}
              restartVehicle={this.restartVehicle}
              getVehicleStatus={this.getVehicleStatus}
              handleVoice = {this.handleVoice}
              alertVehicle={this.alertVehicle}
            />}
          </Card>

          {record && <Card title="Location">
            <LocationMap
              record={record}
            />
          </Card>}


          {/* {authority.includes("get.rides") && */
            <Card title="Vehicle Rides" style={{ marginTop: "2em" }}>
              <Table
                dataSource={vehicleRides}
                columns={this.vehicleRideColumns}
                scroll={{ x: 1300 }}
                onChange={customerRidesPagination}
                pagination={
                  { current: vehicelRidesCurrent+1,total:vehicleRidesTotalSize }
                }
              />

              {isEndRideVisible && (
                <EndRideForm
                  {...endRideMethod}
                  isEndRideVisible={isEndRideVisible}
                  ride={selectedRide}
                />
              )}
            </Card>
          }

          {/* {
            <Card title="Vehicle Orders" style={{ marginTop: "2em" }}>
              <Table
                dataSource={vehicleOrders}
                columns={this.vehicleOrdersColumn}
                scroll={{ x: 1300 }}
                onChange={this.handleOrderTableChange}
                pagination={orderTablePagination}
              />
            </Card>
          }
          {
          <Card title="Control Vehicle">
            {record &&
              <div>
                <VehicleControlForm
                  record={record}
                  handleControl={this.handleControl}
                />
                <Divider />
                <VehicleControlExtensionForm
                  record={record}
                  handleControlExtension={this.handleControlExtension}
                />
              </div>
            }
          </Card>
          } */}
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = ({ coupons, areas, geo, loading }) => {
  return {
    areas,
    loading: loading.models.areas
    }
}
export default connect(mapStateToProps)(VehicleDetail) 