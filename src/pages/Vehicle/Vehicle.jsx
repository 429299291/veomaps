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
const vehicleType = ["Bicycle", "Scooter", "E-Bike", "Car"];

import { exportCSVFile } from "../../utils/utils";

// const errorStatus = [
//   "Normal",
//   "Error",
//   "Auto Error",
//   "Deactivated",
//   "Waiting for Activation",
//   "Rebalance",
//   "Maintain",
//   "Out of Service",
// ];

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
  mac: "mac",
  iccid: "iccid",
  firmware: "firmware",
  lat: "lat",
  lng: "lng"
};



const weekdays = ["Mon", "Tue", "Weds", "Thu", "Fri", "Sat", "Sun"];

const hours = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM","11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];

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

const HeatMapForm = Form.create()(props => { 
  const { form, getheatmapData, isMobile, styles, selectedAreaId, shouldShowHeatMap, clearHeatMap, getAreaCustomerSessionLocation } = props;

  const handleSubmit = () => {

    form.validateFields((err, fieldsValue) => {
      if (err) return;

     

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

    });

  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
 
  const width = isMobile ? "80%" : "7%"

  const rangeWidth = isMobile ? "80%" : "30%"

  const fontSize = isMobile ? "3vw" : "1vw"

  const style = isMobile ? styles.heatMapFilterMobile : styles.heatMapFilter;

  const isRideHeatMap = form.getFieldValue("isStart") !== 'customer';
 
  return ( <div style={{fontSize: fontSize, marginTop: "1em"}}>

      <span className={style}>

          {form.getFieldDecorator("isStart", {initialValue: true})(
            //<Switch checkedChildren="start" unCheckedChildren="end" defaultChecked />
            <Select defaultValue={true}>
              <Option value={true}>Start of Ride</Option>
              <Option value={false}>End of Ride</Option>
              <Option value={null}> Path of Ride </Option>
              <Option value="customer"> Customer </Option>
            </Select>
          )}

          <span> Time: </span> 
          {form.getFieldDecorator("timeRange")(
            <RangePicker style={{width: "20%"}} format="YYYY-MM-DD HH:mm:ss" showTime/>
          )}
      </span> 

        {isMobile && <br />} 
      {isRideHeatMap && <span className={style} >
            <span > Weekday : </span> 
            {form.getFieldDecorator("weekday")(
              <Select placeholder="select" style={{ width: width, opacity: isRideHeatMap ? 1 : 0 }} 
                showSearch
                filterOption={filterOption}

              >
                {
                  weekdays.map((weekday, index) => 
                    <Option value={index} key={index}>{weekday}</Option>
                  )
                }
            </Select>
            )}
      </span> }

      {isMobile && <br />} 

      {isRideHeatMap && <span className={style} style={{opacity: isRideHeatMap ? 1 : 0}}>
        <span> Hours : </span> 
          {form.getFieldDecorator("startHour")(
              <Select 
                placeholder="select" style={{ width: width, opacity: isRideHeatMap ? 1 : 0 }} 
                showSearch
                filterOption={filterOption}
                >
                {
                  hours.map((hour, index) => 
                    <Option value={index} key={index}>{hour}</Option>
                  )
                }
            </Select>
            )}

            ~

            {form.getFieldDecorator("endHour")(
              <Select 
                placeholder="select" style={{ width: width, opacity: isRideHeatMap ? 1 : 0 }} 
                showSearch
                filterOption={filterOption}
              >
                {
                  hours.map((hour, index) => 
                    <Option value={index} key={index}>{hour}</Option>
                  )
                }
            </Select>
            )}
      </span> }

      {isRideHeatMap &&   <span className={style} style={{opacity: isRideHeatMap ? 1 : 0}}>
        <span> Type : </span> 
          {form.getFieldDecorator("vehicleType")(
              <Select 
                placeholder="select" style={{ width: width }} 
                filterOption={filterOption}
                >
                <Option value={0} >Bike</Option>
                <Option value={1} >Scooter</Option>
                <Option value={2} >E-Bike</Option>
            </Select>
            )}
      </span>  }

      {isMobile && <br />} 

      <div style={{float: "right", marginTop: "1em"}}>


            <Button style={{ marginRight: "1vw" }}  htmlType="submit" onClick={() => { form.resetFields(); clearHeatMap();}} > Reset </Button>

            {shouldShowHeatMap ? <Button type="primary" htmlType="submit" onClick={handleSubmit} > Get HeatMap </Button> : <Spin size="middle" style={{ marginRight: "0.5vw" }} /> }
            
      </div> 
  </div>  );
});


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, areas } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      fieldsValue.vehicleNumber = parseInt(fieldsValue.vehicleNumber, 10);

      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width="700px"
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ID">
        {form.getFieldDecorator("vehicleNumber", {
          rules: [
            {
              required: true,
              message: "At least 8 Digits!",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="IMEI">
        {form.getFieldDecorator("imei", {
          rules: [
            {
              required: true,
              message: "At least 15 Digits!",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Mac Address">
        {form.getFieldDecorator("mac", {
          rules: [
            {
              required: true,
              message: "At least 8 Digits!",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Type">
        {form.getFieldDecorator("vehicleType", {
          rules: [
            {
              required: true,
              message: "You have pick a type"
            }
          ]
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value="0">Bike</Option>
            <Option value="1">Scooter</Option>
            <Option value="2">E-Bike</Option>
          </Select>
        )}
      </FormItem>
      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area">
          {form.getFieldDecorator("areaId", {
            rules: [
              {
                required: true,
                message: "You have pick a area"
              }
            ]
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

        fieldsValue.vehicleNumber = parseInt(fieldsValue.vehicleNumber, 10);

        //filter out unchanged value
        Object.keys(fieldsValue).map(key => {
          if (record[key] === fieldsValue[key] && key !== "areaId") {
            fieldsValue[key] = null;
          }
        });

        handleUpdate(record.id, fieldsValue, record);
      });
    else handleModalVisible();
};
  return (
    <Modal
      destroyOnClose
      title="Update"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ID">
        {form.getFieldDecorator("vehicleNumber", {
          rules: [
            {
              required: true,
              message: "At least 8 Digits!",
              min: 1
            }
          ],
          initialValue: record.vehicleNumber + ""
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Lock Status"
      >
        {form.getFieldDecorator("lockStatus", {
          initialValue: record.lockStatus
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Unlock</Option>
            <Option value={1}>Lock</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Error Status"
      >
        {form.getFieldDecorator("errorStatus", {
          initialValue: record.errorStatus + ""
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            {errorStatus.map((status) => (
              <Option key={status} value={status} disabled={status >= 5}>
                {errorStatusIndexs[status]}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Type">
        {form.getFieldDecorator("vehicleType", {
          rules: [
            {
              required: true,
              message: "You have pick a type"
            }
          ],
          initialValue: record.vehicleType
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Bike</Option>
            <Option value={1}>Scooter</Option>
            <Option value={2}>E-Bike</Option>
          </Select>
        )}
      </FormItem>
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

/* eslint react/no-multi-comp:0 */
@connect(({ vehicles, areas, loading, geo, global }) => ({
  vehicles,
  areas: areas.data,
  selectedAreaId : areas.selectedAreaId,
  loading: loading.models.vehicles,
  areaNames: areas.areaNames,
  isMobile: global.isMobile,
  geo
}))
@Form.create()
class Vehicle extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    vehicleLocations: [],
    filterCriteria: { currentPage: 1, pageSize: 10 },
    selectedRecord: {},
    selectedMarker: null,
    selectedTab: "1",
    shouldShowHeatMap: true,
    shoudlShowVehicles: true,
    heatMapMaxIntensity: 0,
    heatMapRadius: 15
  };

  columns = [
    {
      title: "ID",
      dataIndex: "vehicleNumber"
    },
    {
      title: "Power",
      dataIndex: "power",
      render(val) {
        return <p>{roundTo2Decimal(getPowerPercent(val)) + "%"}</p>;
      }
    },
    {
      title: "Status",
      dataIndex: "connectStatus",
      render: (text, record) => (
        <Fragment>
          <span>{lockStatus[record.lockStatus]}</span>
          <Divider type="vertical" />
          <span>{errorStatusIndexs[record.errorStatus]}</span>
          <Divider type="vertical" />
          <span>{this.isConnected(record)}</span>
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
      title: "Type",
      dataIndex: "vehicleType",
      render(val) {
        return <p>{vehicleType[val]}</p>;
      }
    },
    {
      title: "Vehicle Power",
      dataIndex: "vehiclePower",
      render(val) {
        return <p>{`${val}%`}</p>;
      }
    },
    {
      title: "Chain Lock",
      dataIndex: "chainLockStatus",
      render(val) {
        return <p>{`${(val !== null) ? lockStatus[val] : 'null'}`}</p>;
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

    params.currentPage = current;
    params.pageSize = pageSize;


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

      if ( (type === "vehicles/unlock"  && authority.includes("unlock.vehicle")) || (type === "vehicles/lock" && authority.includes("lock.vehicle"))){
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

    const lockPower = roundTo2Decimal(getPowerPercent(vehicle.power));
    
    const power = vehicle.vehicleType === 0 ? lockPower :  vehicle.vehiclePower;


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

                    <Col span={12}> Vehicle Power : <span style={{color: batteryColor(vehicle.vehiclePower)}}>  {vehicle.vehiclePower} % </span>  </Col>

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
                      <Icon type={vehicle.lockStatus === 1? "lock" : "unlock"} style={{color: (vehicle.lockStatus === 1 ?  "blue" : "orange")}} /> 
                      {" | "}
                    </span> 
                    <span style={{color: (vehicle.errorStatus === 0 ?  "#04e508" : "red")}}>{errorStatusIndexs[vehicle.errorStatus]}</span>
                    {" | "}
                    <span style={{color: (vehicle.connectStatus === 1 ?  "#04e508" : "red")}}>{this.isConnected(vehicle)}</span>
                </Col>
                <Col span={7} >Battery: <span style={{color: batteryColor(power)}}> {power + "%"} </span> </Col>

          </Row>

          {
              isSelected &&
              <Row  style={{marginTop: "1em"}}>
                    
                    <Col span={5}> 

                     {
                       authority.includes("unlock.vehicle") ?

                       <a onClick={() => this.changeLockStatus(vehicle)}>
                        {((vehicle.lockStatus === 0 && vehicle.vehicleType === 1) ?  "Lock" : "Unlock")}
                       </a> 

                       :

                       <span  style={{color: "grey"}}>
                          {((vehicle.lockStatus === 0 && vehicle.vehicleType === 1) ?  "Lock" : "Unlock")}
                       </span> 
                    }

                    
                    </Col>

                    <Col span={5} style={{fontSize: "2.5vw"}}> 

                    {authority.includes("update.vehicle.location") ?
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
                      {authority.includes("alert.vehicle") ?
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

    return vehicle.connectStatus === 1 ? 'online' : 'offline';
  }

  handleGetListVehicles = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "vehicles/getCount",
      payload: filterCriteria
    });

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

    params.currentPage = pagination.current;
    params.pageSize = pagination.pageSize;

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params });

    dispatch({
      type: "vehicles/get",
      payload: params
    });
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
      () => this.handleSearch()
    );
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

  handleSearch = e => {
    typeof e === 'object' && e.preventDefault();

    const { dispatch, form, selectedAreaId } = this.props;
    const { filterCriteria, selectedTab } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = Object.assign({}, filterCriteria, fieldsValue, {
        currentPage: 1,
        pageSize: 10,
        areaId: selectedAreaId
      });
      
      if (fieldsValue.vehiclePowerCustom) {
        values.vehiclePower =  fieldsValue.vehiclePowerCustom;
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
    });
  };

  handleUpdateAllLocations = e => {
    typeof e === 'object' && e.preventDefault();

    const { dispatch, form, selectedAreaId } = this.props;
    const { filterCriteria, selectedTab } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = Object.assign({}, filterCriteria, fieldsValue, {
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
    });
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

    if (!authority.includes("apply.action")) {
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("numberOrImei")(
                <Input placeholder="number or imei" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Battery Status">
              {getFieldDecorator("lockPower")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Low Battery</Option>
                  <Option value="1">Full Battery</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Connection Status">
              {getFieldDecorator("connectStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">offline</Option>
                  <Option value="1">online</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          
          </Row>



        <div style={{ overflow: "hidden" }}>
          <div style={{ float: "right", marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  Reset
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  more <Icon type="down" />
                </a>
                </div>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { areas }= this.props;


    const checkIdleDays = (rule, value, callback) => {
      if (value === undefined || ( value > 0 && Number.isInteger(value))) {
        callback();
        return;
      }
  
      callback("Number must be larger than zero.");
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("numberOrImei")(
                <Input className="number_or_imei_input"  placeholder="number or imei" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Lock Battery Status">
              {getFieldDecorator("lockPower")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Low Battery</Option>
                  <Option value="1">Full Battery</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="Connection Status">
              {getFieldDecorator("connectStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">offline</Option>
                  <Option value="1">online</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={8} sm={24}>
            <FormItem label="Lock Status">
              {getFieldDecorator("lockStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Unlock</Option>
                  <Option value="1">Lock</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Vehicle Type">
              {getFieldDecorator("vehicleType")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value="0">Bike</Option>
                  <Option value="1">Scooter</Option>
                  <Option value="2">e-bike</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Error Status">
              {getFieldDecorator("errorStatus", {initialValue: ["0", "1",  "5", "6", "7"]})(
                <Select
                  mode="multiple"
                  placeholder="select"
                  style={{ width: "100%" }}
                >

                {
                  errorStatus.map((status) => {
                  return <Option value={status} key={status}>{errorStatusIndexs[status]}</Option>;
                  })
                }
                </Select>
              )}
            </FormItem>
            </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
            <FormItem label="Is Using">
              {getFieldDecorator("isUsing")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Vehicle Power Status">
              {getFieldDecorator("vehiclePower")(
                <Select placeholder="select" style={{ width: "100%" }}>
                <Option value="0">Low Battery</Option>
                <Option value="1">Full Battery</Option>
                <Option value={null}>All</Option>
              </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Idle Days">
                {getFieldDecorator("idleDays", {
                  rules: [
                    {
                      validator: checkIdleDays
                    }
                  ]
                })(<InputNumber placeholder="Please Input" />)}
          </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
            <FormItem label="Is Reported">
              {getFieldDecorator("isReported")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Custom Vehicle Power Search:">
              {getFieldDecorator("vehiclePowerCustom")(
                <InputNumber placeholder="power" />
              )} %
            </FormItem>
          </Col>
        </Row>

       
        

        <div style={{ overflow: "hidden" }}>
          <div style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              close <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
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
    const { vehicles, areas, loading, selectedAreaId, geo, areaNames } = this.props;

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
      current: filterCriteria.currentPage,
      pageSize: filterCriteria.pageSize,
      total: vehicles.total
    };

    return (
      <PageHeaderWrapper title="Vehicle List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                Add
              </Button>


            {selectedAreaId >= 1 && authority.includes("update.all.vehicle.location") && 
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
                    {authority.includes("get.area.start.points")  && !this.props.isMobile &&
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

export default Vehicle;
