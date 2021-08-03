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
  Tabs,
  Checkbox,
  Pagination,
  Spin,
  Switch
} from "antd";

const { RangePicker } = DatePicker;

const TabPane = Tabs.TabPane;

import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Vehicle.less";
import LocationMap from "./LocationMap";
import { roundTo2Decimal } from "../../utils/mathUtil";
import CustomerDetail from "../Customer/CustomerDetail";
import VehicleDetail from "./VehicleDetail";

import { getAuthority } from "@/utils/authority";




const authority = getAuthority();


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
const vehicleType = ["Bicycle", "Scooter", "E-Bike", "COSMO"];

import { exportCSVFile } from "../../utils/utils";

const errorStatusIndexs = {
  0: "Normal",
  1: "Error",
  3: "Deactivated",
  5: "Rebalance",
  6: "Maintain",
  7: "Out of Service"
};

const errorStatus = Object.keys(errorStatusIndexs);


const formatTime = val => {
  const local = moment(val).format('YYYY-MM-DD HH:mm:ss');
  return local;
}

import VehicleMap from "@/components/Map/VehicleMap";
import ResponsiveList from "./ResponsiveList";

const vehicleCsvHeader = {
  vehicleId: "vehicleId",
  vehicleNumber: "vehicleNumber",
  vehicleType: "vehicleType",
  lockStatus: "lockStatus",
  reported: "reported",
  areaId: "areaId",
  imei: "imei",
  errorStatus: "errorStatus",
  connectStatus: "connectStatus",
  power: "power",
  vehiclePower: "vehiclePower",
  isTurnedOn: "isTurnedOn",
  heartTime: "heartTime",
  wirelessTech: "wirelessTech",
  lastRideTime: "lastRideTime",
  lastDropOffTime: "lastDropOffTime",
  mac: "mac",
  iccid: "iccid",
  firmware: "firmware",
  lat: "lat",
  lng: "lng"
};



const weekdays = ["Mon", "Tue", "Weds", "Thu", "Fri", "Sat", "Sun"];

const hours = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM","11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];

const RenderSimpleForm=(props)=> {
  const [form] = Form.useForm()
  // const handleSearch=()=>{
  //   form.submit()
  // }
  const handleFormReset = ()=>{
    props.handleFormReset()
    form.resetFields()
  }
  return (
    <Form layout="inline" form={form}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="Keywords" name='numberOrImei'>
              <Input placeholder="number or imei" />
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="Battery Status" name='lockPower'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value="0">Low Battery</Option>
                <Option value="1">Full Battery</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="Connection Status" name='connected'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value={false}>offline</Option>
                <Option value={true}>online</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        
        </Row>



      <div style={{ overflow: "hidden" }}>
        <div style={{ float: "right", marginBottom: 24 }}>
              <Button onClick={()=>{props.handleSearch(form.getFieldsValue(true))}}>
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                Reset
              </Button>
              <a style={{ marginLeft: 8 }} onClick={props.toggleForm}>
                more <Icon type="down" />
              </a>
              </div>
      </div>
    </Form>
  );
}
const RenderAdvancedForm=(props)=> {
  const [form] = Form.useForm()
  // const { areas }= this.props;


  const checkIdleDays = (rule, value, callback) => {
    if (value === undefined || ( value > 0 && Number.isInteger(value))) {
      callback();
      return;
    }

    callback("Number must be larger than zero.");
  };

  return (
    <Form  layout="inline" form= {form}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={8}>
          <FormItem label="Keywords" name='numberOrImei'>
              <Input className="number_or_imei_input"  placeholder="number or imei" />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Lock Battery Status" name='iotBattery'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value={40}>Low Battery</Option>
                <Option value={100}>Full Battery</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem label="Connection Status" name='connected'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value={false}>offline</Option>
                <Option value={true}>online</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        
      {/* </Row>
      <Row> */}
      <Col span={8}>
          <FormItem label="Lock Status" name='locked'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value={false}>Unlock</Option>
                <Option value={true}>Lock</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Vehicle Type" name='vehicleType'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value="0">Bike</Option>
                <Option value="1">Scooter</Option>
                <Option value="2">e-bike</Option>
                <Option value="3">COSMO</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Error Status" name='statuses'>
              <Select
                mode="multiple"
                placeholder="select"
              >

              {
                errorStatus.map((status) => {
                return <Option value={status} key={status}>{errorStatusIndexs[status]}</Option>;
                })
              }
              </Select>
          </FormItem>
          </Col>
      {/* </Row>

      <Row > */}
      <Col span={8}>
          <FormItem label="Is Using" name='isUsing'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Vehicle Power Status" name='vehicleBattery'>
              <Select placeholder="select" style={{ width: "100%" }}>
              <Option value={40}>Low Battery</Option>
              <Option value={100}>Full Battery</Option>
              <Option value={null}>All</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={8}>
            <FormItem label="Idle Days"
              name='idleDays'
              rules={
                [
                  {
                    validator: checkIdleDays
                  }
                ]
              }
              >

             <InputNumber placeholder="Please Input" style={{ marginLeft: "1em" }} />
        </FormItem>
        </Col>
      {/* </Row>

      <Row gutter={{ md: 8, lg: 24, xl: 48 }}> */}
      <Col md={8} sm={24}>
          <FormItem label="Is Reported" name='isReported'>
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem label="Custom Vehicle Power Search:" name='vehiclePowerCustom'>
              <Input placeholder="power" suffix="%"/>
          </FormItem>
        </Col>
      </Row>

     
      

      <div style={{ overflow: "hidden" }}>
        <div style={{ marginBottom: 24 }}>
          <Button  onClick={()=>{props.handleSearch(form.getFieldsValue(true))}}>
            Search
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={()=>{form.resetFields();props.handleFormReset()}}>
            Reset
          </Button>
          <a style={{ marginLeft: 8 }} onClick={()=>{props.toggleForm()}}>
            close <Icon type="up" />
          </a>
        </div>
      </div>
    </Form>
  );
}

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

const HeatMapForm = (props => { 
  const { getheatmapData, isMobile, styles, selectedAreaId, shouldShowHeatMap, clearHeatMap, getAreaCustomerSessionLocation } = props;
  const [form] = Form.useForm()

  const handleSubmit = () => {
    let fieldsValue = form.getFieldsValue(true)
    // form.validateFields((err, fieldsValue) => {
      // if (err) return;

     

      if (fieldsValue.isStart === 'customer') {
        getAreaCustomerSessionLocation(fieldsValue);
        return;
      }

      if (fieldsValue.timeRange) {
        
        fieldsValue.start = moment(fieldsValue.timeRange[0]).utcOffset(0).format(
          "MM-DD-YYYY HH:mm:ss"
        );
        fieldsValue.end = moment(fieldsValue.timeRange[1]).utcOffset(0).format(
          "MM-DD-YYYY HH:mm:ss"
        );
        
        fieldsValue.timeRange = undefined;


      }

      if (fieldsValue.endhour === null || fieldsValue.startHour === null) {
        if (fieldsValue.endhour !== null) {
          fieldsValue.startHour = 0;
        }
        if (fieldsValue.startHour !== null) {
          fieldsValue.endHour = 23; 
        }
      }
      

      const offset = (new Date().getTimezoneOffset() / 60);

      

      fieldsValue.offset = offset;


      if (fieldsValue.startHour !== undefined) {
        fieldsValue.startHour = (fieldsValue.startHour + offset ) % 24;
      }

      if (fieldsValue.endHour !== undefined) {
        fieldsValue.endHour = (fieldsValue.endHour + offset ) % 24;
      }

      


      getheatmapData(fieldsValue);

    // });

  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
 
  const width = isMobile ? "80%" : "7%"

  const rangeWidth = isMobile ? "80%" : "30%"

  const fontSize = isMobile ? "3vw" : "1vw"

  const style = isMobile ? styles.heatMapFilterMobile : styles.heatMapFilter;

  const isRideHeatMap = form.getFieldValue("isStart") !== 'customer';
 
  return ( <div style={{fontSize: fontSize, marginTop: "1em"}}>
    <Form form={form}>
      <Row>
      {/* <span className={style}> */}
      <Col span={3}>
          <FormItem name='isStart'>
            <Select>
              <Option value={true}>Start of Ride</Option>
              <Option value={false}>End of Ride</Option>
              <Option value={null}> Path of Ride </Option>
              <Option value="customer"> Customer </Option>
            </Select>
          </FormItem>
          </Col>
          <span> Time: </span> 
          <Col span={3}>
          <FormItem name='timeRange'>
            <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime/>
          </FormItem>
          </Col>
      {/* </span>  */}
        {/* {isMobile && <br />}  */}
      {isRideHeatMap && (
        <>
            <span > Weekday : </span> 
            <Col span={3}>
            <FormItem name='weekday'>
              <Select placeholder="select" style={{  opacity: isRideHeatMap ? 1 : 0 }} 
                showSearch
                filterOption={filterOption}

              >
                {
                  weekdays.map((weekday, index) => 
                    <Option value={index} key={index}>{weekday}</Option>
                  )
                }
            </Select>
            </FormItem>
            </Col></>)
       }
      {/* {isMobile && <br />}  */}
      {isRideHeatMap &&(
        <>
        <span> Hours : </span> 
        <Col span={2}>
          <FormItem name='startHour'>
              <Select 
                placeholder="select" style={{  opacity: isRideHeatMap ? 1 : 0 }} 
                showSearch
                filterOption={filterOption}
                >
                {
                  hours.map((hour, index) => 
                    <Option value={index} key={index}>{hour}</Option>
                  )
                }
            </Select>
            </FormItem>
        </Col>
            ~
            <Col span={2}>
            <FormItem name='endHour'>
              <Select 
                placeholder="select" style={{  opacity: isRideHeatMap ? 1 : 0 }} 
                showSearch
                filterOption={filterOption}
              >
                {
                  hours.map((hour, index) => 
                    <Option value={index} key={index}>{hour}</Option>
                  )
                }
            </Select>
            </FormItem>
            </Col>
      </>) }
      {isRideHeatMap &&(
        <>
        <span> Type : </span> 
        <Col span={3}>
        <FormItem name='vehicleType'>
              <Select 
                placeholder="select"
                style={{opacity: isRideHeatMap ? 1 : 0}}
                filterOption={filterOption}
                >
                <Option value={0} >Bike</Option>
                <Option value={1} >Scooter</Option>
                <Option value={2} >E-Bike</Option>
                <Option value={3} >COSMO</Option>
            </Select>
          </FormItem>
          </Col>
      </>) }
      {/* {isMobile && <br />}  */}
      <Col span={5}>
      <div style={{ marginTop: "1em"}}>


            <Button style={{ marginRight: "1vw" }}  htmlType="submit" onClick={() => { form.resetFields(); clearHeatMap();}} > Reset </Button>

            {shouldShowHeatMap ? <Button type="primary" htmlType="submit" onClick={handleSubmit} > Get HeatMap </Button> : <Spin size="middle" style={{ marginRight: "0.5vw" }} /> }
            
      </div> 
      </Col>
      </Row>
      </Form>
  </div>  );
});


const CreateForm = (props => {
  const { modalVisible, handleAdd, handleModalVisible, areas } = props;
  const [form] = Form.useForm()
  const okHandle = () => {

      let fieldsValue = form.getFieldsValue(true)
      fieldsValue.vehicleNumber = parseInt(fieldsValue.vehicleNumber, 10);

      handleAdd(fieldsValue);
    // });
  };
  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      forceRender
      onCancel={() => handleModalVisible()}
      width="700px"
    >
      <Form form={form} >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ID" 
        name='vehicleNumber'
        rules={
          [
            {
              required: true,
              message: "At least 8 Digits!",
              min: 1
            }
          ]
        }
      >
       <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="IMEI"
        name='imei'
        rules={
          [
            {
              required: true,
              message: "At least 15 Digits!",
              min: 1
            }
          ]
        }
      >
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Mac Address"
        name='mac'
        rules={
          [
            {
              required: true,
              message: "At least 8 Digits!",
              min: 1
            }
          ]
        }
      >
      <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Type"
        name='vehicleType'
        rules={
          [
            {
              required: true,
              message: "You have pick a type"
            }
          ]
        }
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value="0">Bike</Option>
            <Option value="1">Scooter</Option>
            <Option value="2">E-Bike</Option>
            <Option value="3">COSMO</Option>
          </Select>
      </FormItem>
      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area"
          name='areaId'
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
      </Form>
    </Modal>
  );
});


const UpdateForm = (props => {
  const {
    modalVisible,
    handleUpdate,
    handleModalVisible,
    areas,
    record
  } = props;
  const [form] = Form.useForm()
  form.setFieldsValue(record)
  const okHandle = () => {
    let fieldsValue = form.getFieldsValue(true)
    if (fieldsValue){

      fieldsValue.vehicleNumber = parseInt(fieldsValue.vehicleNumber, 10);

      //filter out unchanged value
      Object.keys(fieldsValue).map(key => {
        if (record[key] === fieldsValue[key] && key !== "areaId") {
          fieldsValue[key] = null;
        }
      });

      handleUpdate(record.id, fieldsValue, record);

    }
      // form.validateFields((err, fieldsValue) => {
        
      // });
    else handleModalVisible();
};
  return (
    <Modal
      destroyOnClose
      title="Update"
      visible={modalVisible}
      onOk={okHandle}
      forceRender
      onCancel={() => handleModalVisible()}
    >
     <Form form={form}>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Lock Status"
        name='lockStatus'
      >

          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Unlock</Option>
            <Option value={1}>Lock</Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Error Status"
        name='errorStatus'
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            {errorStatus.map((status) => (
              <Option key={status} value={status} disabled={status >= 5}>
                {errorStatusIndexs[status]}
              </Option>
            ))}
          </Select>
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Type"
        name='vehicleType'
        rules={
          [
            {
              required: true,
              message: "You have pick a type"
            }
          ]
        }
        >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Bike</Option>
            <Option value={1}>Scooter</Option>
            <Option value={2}>E-Bike</Option>
            <Option value={3}>COSMO</Option>
          </Select>
      </FormItem>
      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area"
          name='areaId'
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
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
class Vehicle extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    vehicleLocations: [],
    filterCriteria: {pagination: {page: 0, pagSize: 10}},
    selectedRecord: {},
    selectedMarker: null,
    selectedTab: "1",
    shouldShowHeatMap: true,
    shoudlShowVehicles: true,
    heatMapMaxIntensity: 0,
    heatMapRadius: 15,
    todayRange: {start: moment().startOf('day').format("MM-DD-YYYY HH:mm:ss"),end: moment().endOf('day').format("MM-DD-YYYY HH:mm:ss")} 
  };

  columns = [
    {
      title: "ID",
      dataIndex: "vehicleNumber"
    },
    {
      title: "IoT Power",
      dataIndex: "iotBattery",
      render(val) {
        return <p>{roundTo2Decimal(val > 100 ? getPowerPercent(val)  : val) + "%"}</p>;
      }
    },
    {
      title: "Status",
      dataIndex: "connectStatus",
      render: (text, record) => (
        <Fragment>
          <span>{record.locked ? "lock" : "unlock"}</span>
          <Divider type="vertical" />
          <span>{errorStatusIndexs[record.status]}</span>
          <Divider type="vertical" />
          <span>{record.connected ? "connect" : "disconnect"}</span>
        </Fragment>
      )
    },
    {
      title: "HeartTime",
      dataIndex: "heartTime",
      sorter: true,
      render: val => <span>{formatTime(val)}</span>
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
      title: "Last Drop Off Time",
      dataIndex: "lastDropOffTime",
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
      title: "Vehicle Power",
      dataIndex: "vehicleBattery",
      render(val) {
        return <p>{`${val}%`}</p>;
      }
    },
    {
      title: "Chain Lock",
      dataIndex: "chainLock",
      render(val) {
        return <p>{`${(val !== null) ? val.chainLockNumber : 'unknown'}`}</p>;
      }
    },
    {
      title: "operation",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            Update
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDetailModalVisible(true, record)}>
            Detail
          </a>
        </Fragment>
      )
    }
  ];


  handleResponsiveItemClick = vehicleId => {


    this.setState({selectedVehicleId: vehicleId === this.state.selectedVehicleId ? null : vehicleId});
  } 
  

  handleResponsivePageChange = (current, pageSize) => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    params.pagination = {
        page: 0,
        pageSize: 10 
    }

    this.setState({ filterCriteria: params });

    dispatch({
      type: "vehicles/get",
      payload: params
    });
  }


  handleSetSelectedVehicleRefresh = val => {
    this.setState({selectedVehicleRefresh: val});
  }

  changeLockStatus = record => {
    const { dispatch, isMobile } = this.props;

    if (isMobile) {
      if (record.lockStatus === 1) {
        //unlock
        this.setState({unlockModalVisible: true, readyToUnlockVehicle: record});
      } else {
        //lock
        this.handleApplyingPickUpAction(0, record);
      }
    } else {
      const type = record.lockStatus === 1  ? "vehicles/unlock" : "vehicles/lock";

      if ( (type === "vehicles/unlock"  && authority.includes("vehicle")) || (type === "vehicles/lock" && authority.includes("vehicle"))){
        dispatch({
          type: type,
          id: record.id,
          onSuccess: () => {
            setTimeout(() => {
              this.handleSearch();
              }, 3000)
          }
        });
      }

    }
    

    

    
        
  };

  updateLocation = vehicleId => {
    const { dispatch } = this.props;
    dispatch({
      type: "vehicles/updateLocation",
      id: vehicleId,
      onSuccess: () => {
        setTimeout(() => {
          this.handleSetSelectedVehicleRefresh(true);
        }, 4000)
      }
    });
  }

  alertVehicle = vehicleId => {
    const { dispatch } = this.props;
    dispatch({
      type: "vehicles/alertVehicle",
      vehicleId: vehicleId
    });
  };


  clearHeatMap = () => {

    this.setState({heatmapData: undefined, shoudlShowVehicles: true}); 
  }


  getResponsiveVehicleInfo = (vehicle, selectedVehicleId) => {

    const {selectedVehicleRefresh} = this.state;

    const lockPower = roundTo2Decimal(vehicle.iotBattery);
    
    const power = vehicle.vehicleType === 0 ? lockPower :  vehicle.vehicleBattery;


    const batteryColor = power => power > 60 ? "#04e508" : (power < 40 ? "#e81309" : "#EFAF13");

    const isSelected = selectedVehicleId === vehicle.id;


    return <div key={vehicle.id} style={{textAlign: "center", fontSize: "3.5vw"}}>
          <Row >
              <Col span={6}>
                {vehicleType[vehicle.vehicleType] }
              </Col>
             {isSelected &&  <Col offset={16} span={2}>
                {<Icon type="redo" onClick={() => { this.handleSearch(); this.handleSetSelectedVehicleRefresh(true); }} />}
              </Col>
             }
          </Row>

          {
              isSelected &&
              <Row style={{marginTop: "1em"}}>

                  <LocationMap 
                  record = {vehicle} 
                  selectedVehicleRefresh= {selectedVehicleRefresh} 
                  handleSetSelectedVehicleRefresh = {this.handleSetSelectedVehicleRefresh}
                  
                  />

              </Row>

          }

          {
              isSelected &&
              <Row  style={{marginTop: "1em"}}>

                    <Col span={12}> Lock Power : <span style={{color: batteryColor(lockPower)}}> {lockPower} % </span>  </Col>

                    <Col span={12}> Vehicle Power : <span style={{color: batteryColor(vehicle.vehicleBattery)}}>  {vehicle.vehicleBattery} % </span>  </Col>

              </Row>

          }

            {
                isSelected &&

                      <Row style={{marginTop: "1em"}} >
                          
                            <Col span={8}>
                              Ride Count
                          </Col>
                            <Col span={8}> 
                                Heart Time
                            </Col>
                            <Col span={8}> 
                                Last Ride
                            </Col>

                      </Row>
                      }
                      {
                          isSelected &&
                      <Row >
                          
                          <Col span={8}>
                           {vehicle.rideCount}
                          </Col>
                          <Col span={8}> 
                            {moment(vehicle.heartTime).format("YYYY-MM-DD HH:mm:ss")}
                          </Col>
                          <Col span={8}> 
                            {moment(vehicle.lastRideTime).format("YYYY-MM-DD HH:mm:ss")}
                          </Col>

                    </Row>
            }


    
          <Row style={{marginTop: "1em"}} >
              
                <Col span={6}> {vehicle.vehicleNumber} </Col>
                <Col span={11}> 
                    <span> 
                      <Icon type={vehicle.locked? "lock" : "unlock"} style={{color: (vehicle.lockStatus === 1 ?  "blue" : "orange")}} /> 
                      {" | "}
                    </span> 
                    <span style={{color: (vehicle.status === 0 ?  "#04e508" : "red")}}>{errorStatusIndexs[vehicle.status]}</span>
                    {" | "}
                    <span style={{color: (vehicle.connected ?  "#04e508" : "red")}}>{this.isConnected(vehicle)}</span>
                </Col>
                <Col span={7} >Battery: <span style={{color: batteryColor(power)}}> {power + "%"} </span> </Col>

          </Row>

          {
              isSelected &&
              <Row  style={{marginTop: "1em"}}>
                    
                    <Col span={5}> 

                     {
                       authority.includes("vehicle") ?

                       <a onClick={() => this.changeLockStatus(vehicle)}>
                        {((!vehicle.locked && vehicle.vehicleType === 1) ?  "Lock" : "Unlock")}
                       </a> 

                       :

                       <span  style={{color: "grey"}}>
                          {((!vehicle.locked  && vehicle.vehicleType === 1) ?  "Lock" : "Unlock")}
                       </span> 
                    }

                    
                    </Col>

                    <Col span={5} style={{fontSize: "2.5vw"}}> 

                    {authority.includes("vehicle") ?
                        <a onClick={() => this.updateLocation(vehicle.id)}>
                          Update Location
                      </a> 
                      :
                      <span  style={{color: "grey"}}>
                            Update Location
                        </span> 
                    }
                      
                    </Col>

                    <Col span={5}> 
                      {authority.includes("vehicle") ?
                          <a onClick={() => this.alertVehicle(vehicle.id)}>
                            Beep
                        </a> 
                        :
                        <span  style={{color: "grey"}}>
                              Beep
                          </span> 
                      }
                    </Col>

                    <Col span={5}> 
                      <a onClick={() => this.handleUpdateModalVisible(true, vehicle)}>
                       Update
                      </a> 
                    </Col>

                    <Col span={4}> 
                      <a onClick={() => this.handleDetailModalVisible(true, vehicle)}>
                        Detail
                      </a> 
                    </Col>
              </Row>

          }

          <Row style={{marginTop: "1em", marginBottom: "0px"}} onClick={() => this.handleResponsiveItemClick(vehicle.id)}>
          {isSelected ?  <Icon type="up" /> :   <Icon type="down" />}
          </Row>
         
       </div>
  }

  componentDidMount() {
    
    this.handleSearch();

    if (this.props.isMobile ) {
      const input = document.getElementById("numberOrImei"); 

      if (input) {
        input.setAttribute("type", "number");
        input.setAttribute("pattern", "[0-9]*");
      }
    }
  }

  isConnected(vehicle) {
    // const now = moment.utc();
    // const heartime = moment.utc(vehicle.heartTime);
    // return now.diff(heartime,'minutes') < 10 ? 'online' : 'offline';

    return vehicle.connected ? 'online' : 'offline';
  }

  handleGetListVehicles = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "vehicles/get",
      payload: filterCriteria
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    params.pagination = {};

    params.pagination.page = pagination.current - 1;

    params.pagination.pageSize = pagination.pageSize;

    if (sorter.field) {

      params.pagination.sort = {};

      params.pagination.sort.direction = sorter.order.startsWith("desc") ? "desc" : "asc";

      params.pagination.sort.sortBy = sorter.field;
      
    }

    this.setState({ filterCriteria: params }, 
      () => dispatch({
      type: "vehicles/get",
      payload: params
    }));

  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { filterCriteria } = this.state;

    this.handleSearch();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm
    });
  };


  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleSearch();
    }
  }

  handleSearch = fieldsValue => {
    const { dispatch,  selectedAreaId } = this.props;
    const { filterCriteria, selectedTab } = this.state;
    // form.validateFields((err, fieldsValue) => {
      // if (err) return;
      if(fieldsValue){
      if(/[0-9]()/.test(fieldsValue.numberOrImei) &&
      !fieldsValue.numberOrImei.includes("@")
      ) {
        fieldsValue.numberOrImei = fieldsValue.numberOrImei.replace(/-/g,"").replace(/\(/g,'').replace(/\)/g,'').replace(/^\+1/,'').trim().replace(/\s*/g,"")
      }
    }
    
      let values;

      if (selectedTab == 1) {
       values = Object.assign({}, filterCriteria, fieldsValue, {
          pagination: {
              page: 0,
              pageSize: 10
          },
          areaIds: selectedAreaId ? [selectedAreaId] : null
        });
        if (values.numberOrImei) {
          if (values.numberOrImei.toString().length == 15) {
            values.imei = values.numberOrImei;
          } else {
            values.vehicleNumber = values.numberOrImei;  
          }
          values.numberOrImei = undefined;
        }  else {
          values.imei = null;
          values.vehicleNumber = null;
        }
        values.vehicleTypes = values.vehicleType ? [values.vehicleType] : null;
        if (values.idleDays) {
          values.idleQuery = {idleDays: values.idleDays};
        } else {
          values.idleQuery = null;
        }
        if(fieldsValue){
          if (fieldsValue.vehiclePowerCustom) {
            values.vehicleBattery =  fieldsValue.vehiclePowerCustom;
          }    
        }
        
      } else {
        values = Object.assign({}, filterCriteria, fieldsValue);

        if (values.connected !== null && values.connected !== undefined) {
          values.connectStatus = values.connected ? "1" : "0";

        }

        if (values.iotBattery) {
          values.iotBattery === 100 ? "1" : "0";
        }

        if (values.locked !== null && values.locked !== undefined) {
          values.lockStatus = values.locked  ? "1" : "0";
        }

        if (values.statuses) {
          values.errorStatus = values.statuses;
        }

        if (values.vehicleBattery) {
          values.vehiclePower = values.vehicleBattery;
        }

        if (fieldsValue&&fieldsValue.vehiclePowerCustom) {
          values.vehiclePower =  fieldsValue.vehiclePowerCustom;
        }   

      }
    if(!fieldsValue){
      values={
        areaIds: selectedAreaId ? [selectedAreaId] : [],
        idleQuery: null,
        imei: null,
        pagination: {page: 0, pageSize: 10},
        vehicleNumber: null,
        vehicleTypes: null
      }
    }

 

      this.setState(
        {
          filterCriteria: values
        },
        () => {
          switch (selectedTab) {
            case "1":

            this.handleGetListVehicles();
            break;
          case "2":
            this.handleGetMapData();
            break;
          default:
            return;
          }
        }
        
      );
    // });
  };

  handleUpdateAllLocations = ()=> {

    const { dispatch, form, selectedAreaId } = this.props;
    const { filterCriteria, selectedTab } = this.state;

      const values = Object.assign({}, filterCriteria, {
        currentPage: 1,
        pageSize: 10,
        areaId: selectedAreaId
      });
      this.setState(
        {
          filterCriteria: values
        },
        () => 
          dispatch({
            type: "vehicles/updateAllLocations",
            payload: filterCriteria,
            areaId: selectedAreaId
          })
      );
  };

  getAreaCustomerSessionLocation = (fieldsValue) => {

    const { dispatch, selectedAreaId } = this.props;

    dispatch({
      type: "vehicles/getAreaSessionLocation",
      areaId: selectedAreaId,
      onSuccess: result => this.setState({heatmapData: result, heatmapType: 'customer', shouldShowHeatMap: true, heatMapMaxIntensity:  2 * (Math.floor(result.length / 1000) + 1)}),
      fieldsValue: fieldsValue,
    })

  }

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

  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: "vehicles/add",
      payload: fields
    });

    //message.success("Add Success!");
    this.handleModalVisible();
  };


  handleApplyingPickUpAction = (vehicleStatus, record) => {
    const { dispatch, isMobile } = this.props;

    if (!authority.includes("vehicle")) {
      message.error("You don't have permmision to apply action to this vehicle.");
      return;
    }

    if (!isMobile) {
      message.error("can't apply action to vehicle on pc.");
      return;
    }

    const actionParam = {};

    //pick up or drop off
    actionParam.actionType = vehicleStatus >=5 ? 0 : 1;

    switch(vehicleStatus) {
      //rebalance
      case 5:
        actionParam.reasonType = 1;
        break;
      //maintain
      case 6:
        actionParam.reasonType = 2;
        break;
      //service off
      case 7:
        actionParam.reasonType = 0;
        break;
      default:
        break;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        actionParam.location = {lat: position.coords.latitude, lng: position.coords.longitude}

        dispatch({
          type: "vehicles/applyAction",
          payload: actionParam,
          id: record.id,
          vehicleNumber: record.vehicleNumber,
          onSuccess: this.handleGetListVehicles
        });

      });
    } else {
      error.message("You have to enable to gps location to apply action to vehicle."); 
    }

  }


  handleUpdate = (id, fields) => {
    const { dispatch, isMobile } = this.props;

    dispatch({
      type: "vehicles/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetListVehicles
    });

    this.handleUpdateModalVisible();
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? <RenderAdvancedForm handleSearch={this.handleSearch} handleFormReset={this.handleFormReset} toggleForm={this.toggleForm} /> : <RenderSimpleForm toggleForm={this.toggleForm} handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}/>;
  }


  //map vehicle list data
  getAreaGeoInfo = () => {

    const { dispatch, selectedAreaId } = this.props;

    dispatch({
      type: "geo/getFences",
      areaId: selectedAreaId
    });

    dispatch({
      type: "geo/getCenter",
      areaId: selectedAreaId
    });
  };

  getVehicleLocations() {
    const { dispatch, selectedAreaId } = this.props;

    const { filterCriteria } = this.state;
    console.log(filterCriteria);
    dispatch({
      type: "vehicles/getVehicleLocation",
      payload: filterCriteria,
      onSuccess: result => this.setState({vehicleLocations: result})
    });
  }

  setClickedMarker = vehicleNumber => {
    this.setState({selectedMarker: vehicleNumber})
  }


  hadnleTabChange = value => {
    
    this.setState({selectedTab: value}, this.handleSearch)
  }

  getheatmapData= params => {
    const { dispatch, selectedAreaId } = this.props;

    this.setState({ shouldShowHeatMap: false});

    dispatch({
      type: "vehicles/getStartPoints",
      areaId: selectedAreaId,
      params, params,
      onSuccess: result => this.setState({heatmapData: result, heatmapType: params.isStart, shouldShowHeatMap: true, heatMapMaxIntensity:  2 * (Math.floor(result.length / 1000) + 1)})
    });
  }

  handleGetMapData = () => {
    const { selectedAreaId } = this.props;

    if (!(selectedAreaId >= 1)) {
      return;
    }

    this.getVehicleLocations();
    this.getAreaGeoInfo();
  }

  formatCsvData = vehicles => {
    return vehicles.map(vehicle => {
      vehicle.heartTime = moment(vehicle.heartTime).format("YYYY-MM-DD HH:mm:ss");
      vehicle.lastRideTime = vehicle.lastRideTime ? moment(vehicle.lastRideTime * 1000).format("YYYY-MM-DD HH:mm:ss") : null;
      vehicle.lastDropOffTime = vehicle.lastDropOffTime ? moment(vehicle.lastDropOffTime * 1000).format("YYYY-MM-DD HH:mm:ss") : null;
      return vehicle;
    })

  }

  handleSetHeatMapMaxIntensity =  value => {
    this.setState({heatMapMaxIntensity: value});
  }

  handleSetHeatMapRadius = value => {
    this.setState({heatMapRadius: value});
  }

  handleGetMyLocation = val => {
    if (val.target.checked) {


    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(position => this.setState({currPosition: position}));

        const watchId = navigator.geolocation.watchPosition(
            position => this.setState({currPosition: position}),
            err => console.log(err),
            {
                enableHighAccuracy: true,
                timeout: 10000
            }
        );

        this.setState({watchId: watchId});
    }

    } else {
      
      if (navigator.geolocation) { 
        navigator.geolocation.clearWatch(this.state.watchId);
      }

      this.setState({currPosition: null, watchId: null});
    }
}


handleShowingVehicles = val => {

  this.setState({shoudlShowVehicles: val.target.checked});

}

  render() {
    const { vehicles, areas, loading, selectedAreaId, geo, areaNames, dispatch } = this.props;

    const center = geo.area && geo.area.center;

    const fences = geo.fences;
    
    const {
      createModalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord,
      filterCriteria,
      selectedMarker,
      selectedTab,
      vehicleLocations,
      heatmapData,
      heatmapType,
      shouldShowHeatMap,
      selectedVehicleId,
      selectedVehicleRefresh,
      heatMapMaxIntensity,
      heatMapRadius,
      currPosition,
      shoudlShowVehicles
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
      current: filterCriteria.pagination.page + 1,
      pageSize: filterCriteria.pagination.pageSize,
      total: vehicles.total
    };
  
    return (
      <PageHeaderWrapper title="Vehicle List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                Add
              </Button>


            {selectedAreaId >= 1 && authority.includes("vehicle") && 
                <Button
                type="primary"
                onClick={() => this.handleUpdateAllLocations()}
              >
                Update All Locations
              </Button>
            }
              

              <span style={{marginLeft: "1em"}}>
                {`count: ${selectedTab === "1" ? vehicles.total : vehicleLocations.length}`}
              </span>
            </div>
            <Tabs defaultActiveKey="1" onChange={this.hadnleTabChange}>
            
            <TabPane tab="List View" key="1">

              {this.props.isMobile ?
                <ResponsiveList 
                  vehicles={vehicles.data}
                  selectedVehicleId={selectedVehicleId}
                  getResponsiveVehicleInfo={this.getResponsiveVehicleInfo}
                  selectedVehicleRefresh={selectedVehicleRefresh}
                  totalCount = {vehicles.total} 
                  onPageChange= {this.handleResponsivePageChange}
                />
                :
                 <StandardTable
                 loading={loading}
                 data={{ list: vehicles.data, pagination: pagination }}
                 columns={this.columns}
                 onChange={this.handleStandardTableChange}
                 scroll={{ x: 1300 }}
               />
              }

                  { <Row>
                    {/* <Col span={6}> <DatePicker defaultValue={moment()} onChange={e => { */}
                      <Col span={6}> <DatePicker onChange={e => {

                          this.setState({todayRange: {start: e.startOf('day').format("MM-DD-YYYY HH:mm:ss"),end: e.endOf('day').format("MM-DD-YYYY HH:mm:ss")}});
                      }} /> 
                      </Col>

                      <Col span={6}> 
                        <Button onClick={() => 
                          dispatch(
                            {
                              type: "vehicles/getVehicleSnapshot", 
                              payload: Object.assign({}, 
                              this.state.todayRange, 
                              {areaId: selectedAreaId}), 
                              onSuccess: data => {

                                if (Array.isArray(data) && data.length <= 0 ) {

                                  message.error("Snapshot doesn't exits");

                                  return;

                                }
                                
                                const vehicleSnapshotHeader = {

                                  vehicleId: "id",
                                  imei: "imei",
                                  vehicleNumber: "vehicleNumber",
                                  vehicleType: "vehicleType",
                                  areaName: "Area",
                                  errorStatus: "errorStatus",
                                  batteryLevel: "batteryLevel",
                                  isConnected: "isConnected",
                                  lastRideIdleHour: "lastRideIdleHour",
                                  isInGeoFence: "isInGeoFence",
                                  lastDropOffIdleHour: "lastDropOffIdleHour",
                                  primeLocationId: "Hub Id",
                                  created: "Created"
                                }

                                const formatedData = data.map(vehicle => {
                                    vehicle.vehicleType = vehicle.vehicleType !== null ? vehicleType[vehicle.vehicleType]  : null;
                                    vehicle.areaName = vehicle.areaId !== null ? areaNames[vehicle.areaId]  : null;
                                    vehicle.isInGeoFence = vehicle.locationStatus === null ? "Unknown" : vehicle.locationStatus === 0;
                                    vehicle.errorStatus = errorStatusIndexs[vehicle.errorStatus];
                                    vehicle.created = formatTime(vehicle.created) + " " +  Intl.DateTimeFormat().resolvedOptions().timeZone;
                                    return vehicle;
                                  });
                              


                                exportCSVFile(vehicleSnapshotHeader, formatedData, this.state.todayRange.start.split(' ')[0] + "-" + (selectedAreaId === null ? "All" : areaNames[selectedAreaId]) + "-vehicle-snapshot");

                                } })  } >
                            Export Vehicle Snapshot
                        </Button> 
                        </Col>
                        <Col span={6}> 
                        <Button onClick={() => 
                          dispatch(
                            {
                              type: "vehicles/getPrimLocationSnapshot", 
                              payload: Object.assign({}, 
                              this.state.todayRange, 
                              {areaId: selectedAreaId}), 
                              onSuccess: data => {

                                if (Array.isArray(data) && data.length <= 0 ) {

                                  message.error("Snapshot doesn't exits");

                                  return;

                                }

                                
                                
                                const primLocationSnapshotHeader = {

                                  id: "Hub ID",
                                  description: "Hub Description",
                                  lat: "Lat",
                                  lng: "Lng",
                                  market: "Market",
                                  radius: "Radius(ft)",
                                  target: "Target",
                                  minimum: "Mimimum",
                                  total: "Number of Vehicles in Hub",
                                  created: "Created"
                                }

                                const formatedData = data.map(primLocation => {
                                  primLocation.id = primLocation.primeLocationId;
                                    primLocation.market = primLocation.areaId !== null ? areaNames[primLocation.areaId]  : null;
                                    primLocation.radius = primLocation.radius === null ? null : primLocation.radius * 328 / 100;
                                    primLocation.created = formatTime(primLocation.created) + " " +  Intl.DateTimeFormat().resolvedOptions().timeZone;;
                                    return primLocation;
                                  });
                              


                                exportCSVFile(primLocationSnapshotHeader, formatedData, this.state.todayRange.start.split(' ')[0] + "-" + (selectedAreaId === null ? "All" : areaNames[selectedAreaId]) + "-Hub-Snapshot");

                                } })  } >
                            Export Vehicle Hub Snapshot
                        </Button> 
                        </Col>
                        
                    </Row>

                    }
             
              </TabPane>

              {selectedAreaId >= 1 && 
                <TabPane tab="Map View" key="2">
                    {center && fences &&
                    <VehicleMap
                      center={center}
                      vehicles={vehicleLocations}
                      fences={fences}
                      heatMapData={heatmapData}
                      heatmapType={heatmapType}
                      shouldShowHeatMap={shouldShowHeatMap}
                      handleGetMapData={this.handleGetMapData}
                      styles={styles}
                      heatMapMaxIntensity={heatMapMaxIntensity}
                      heatMapRadius={heatMapRadius}
                      handleSetHeatMapMaxIntensity={this.handleSetHeatMapMaxIntensity}
                      handleSetHeatMapRadius={this.handleSetHeatMapRadius}
                      currPosition={currPosition}
                      handleGetMyLocation={this.handleGetMyLocation}
                      handleShowingVehicles={this.handleShowingVehicles}
                      shoudlShowVehicles={shoudlShowVehicles}
                      vehicleTypeFilter={{
                        unlock: true,
                        lock: true,
                        lowBattery: true,
                        error: true,
                        errorUnlock: true,
                        ebike: true
                      }}
                      setClickedMarker={this.setClickedMarker}
                      selectedMarker={selectedMarker}
                    />}
                    {authority.includes("vehicle")  && !this.props.isMobile &&
                      <HeatMapForm 
                        isMobile={this.props.isMobile} 
                        styles={styles} 
                        getheatmapData={this.getheatmapData}  
                        shouldShowHeatMap={shouldShowHeatMap}
                        clearHeatMap={this.clearHeatMap}
                        selectedAreaId={selectedAreaId}
                        getAreaCustomerSessionLocation={this.getAreaCustomerSessionLocation}/> 
                    }
                    { vehicleLocations.length > 0 && 
                        <Button style={{marginTop: "1em"}} onClick={() => exportCSVFile(vehicleCsvHeader, this.formatCsvData(vehicleLocations), areaNames[selectedAreaId])} >
                            Export
                        </Button>
                        

                    }
                </TabPane>
              }
            </Tabs>
            
          </div>
          
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={createModalVisible}
          areas={areas}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          areas={areas}
        />

        {detailModalVisible && (
          <VehicleDetail
            isVisible={detailModalVisible}
            handleDetailVisible={this.handleDetailModalVisible}
            vehicleId={selectedRecord.id}
            handleGetVehicles={this.handleGetListVehicles}
          />
        )}

        <Modal 
          footer={null}
          visible={this.props.isMobile && this.state.unlockModalVisible} 
          destroyOnClose
          onCancel={() => this.setState({unlockModalVisible: false})}
          title="Purpose for Unlock"
        >
          {
            [5,6,7].map(vehicleStatus => <Row style={{textAlign: "center", marginTop: "2em"}}>
            <Button 
              style={{width: "80vw"}}
              type="primary"
              onClick={() => this.handleApplyingPickUpAction(vehicleStatus, this.state.readyToUnlockVehicle)} 
             
            > 
              {errorStatusIndexs[vehicleStatus]}
            </Button></Row>)

          }
        
        </Modal>

         

      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ vehicles, areas, loading, geo, global }) => {
  return {
    vehicles,
    areas: areas.data,
    selectedAreaId : areas.selectedAreaId,
    loading: loading.models.vehicles,
    areaNames: areas.areaNames,
    isMobile: global.isMobile,
    geo
    }
}
export default connect(mapStateToProps)(Vehicle) 