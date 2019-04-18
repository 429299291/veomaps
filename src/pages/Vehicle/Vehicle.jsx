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
  Checkbox
} from "antd";

const TabPane = Tabs.TabPane;

import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Vehicle.less";
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
const vehicleType = ["Bicycle", "Scooter", "E-Vehicle", "Car"];

import { exportCSVFile } from "../../utils/utils";

const errorStatus = [
  "Normal",
  "Error",
  "Auto Error",
  "Deactivated",
  "Waiting for Activation"
];

const formatTime = val => {
  const local = moment(val).format('YYYY-MM-DD HH:mm:ss');
  return local;
}

import VehicleMap from "@/components/Map/VehicleMap";

const vehicleCsvHeader = {
  vehicleId: "vehicleId",
  vehicleNumber: "vehicleNumber",
  vehicleType: "vehicleType",
  lockStatus: "lockStatus",
  isReported: "isReported",
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
  lng: "lng",
  key: "vehicleId"
};


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

        handleUpdate(record.id, fieldsValue);
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
          initialValue: record.errorStatus
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            {errorStatus.map((status, index) => (
              <Option key={index} value={index}>
                {status}
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
@connect(({ vehicles, areas, loading, geo }) => ({
  vehicles,
  areas: areas.data,
  selectedAreaId : areas.selectedAreaId,
  loading: loading.models.vehicles,
  areaNames: areas.areaNames,
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
    shouldShowHeatMap: false
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
          <span>{errorStatus[record.errorStatus]}</span>
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

  componentDidMount() {
    this.handleSearch();
  }

  isConnected(vehicle) {
    const now = moment.utc();
    const heartime = moment.utc(vehicle.heartTime);
    return now.diff(heartime,'minutes') < 10 ? 'online' : 'offline';
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

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
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
            <FormItem label="Error Status">
              {getFieldDecorator("errorStatus", {initialValue: ["0", "1", "2", "4"]})(
                <Select
                  mode="multiple"
                  placeholder="select"
                  style={{ width: "100%" }}
                >
                  <Option value="0">Normal</Option>
                  <Option value="1">Error</Option>
                  <Option value="2">Auto Error</Option>
                  <Option value="3">Deactivated</Option>
                  <Option value="4">Waiting for Activation</Option>
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
      console.log(value);
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
                <Input placeholder="number or imei" />
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
            <FormItem label="Error Status">
              {getFieldDecorator("errorStatus", {initialValue: ["0", "1", "2", "4"]})(
                <Select
                  mode="multiple"
                  placeholder="select"
                  style={{ width: "100%" }}
                >
                  <Option value="0">Normal</Option>
                  <Option value="1">Error</Option>
                  <Option value="2">Auto Error</Option>
                  <Option value="3">Deactivated</Option>
                  <Option value="4">Waiting for Activation</Option>
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
                {getFieldDecorator("idelDays", {
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

  getAreaStartPoints= () => {
    const { dispatch, selectedAreaId } = this.props;

    dispatch({
      type: "vehicles/getStartPoints",
      areaId: selectedAreaId,
      onSuccess: result => this.setState({areaStartPoints: result})
    });
  }

  handleGetMapData = () => {
    const { selectedAreaId } = this.props;

    if (!(selectedAreaId >= 1)) {
      return;
    }


    this.getVehicleLocations();
    this.getAreaGeoInfo();
    authority.includes("get.area.start.points")  && this.getAreaStartPoints();
  }

  formatCsvData = vehicles => {
    return vehicles.map(vehicle => {
      vehicle.heartTime = moment(vehicle.heartTime).format("YYYY-MM-DD HH:mm:ss");
      return vehicle;
    })

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
      areaStartPoints,
      shouldShowHeatMap
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
              <StandardTable
                loading={loading}
                data={{ list: vehicles.data, pagination: pagination }}
                columns={this.columns}
                onChange={this.handleStandardTableChange}
                scroll={{ x: 1300 }}
              />
              </TabPane>

              {selectedAreaId >= 1 && 
                <TabPane tab="Map View" key="2">
                    {center && fences &&
                    <VehicleMap
                      center={center}
                      vehicles={vehicleLocations}
                      fences={fences}
                      heatMapData={areaStartPoints}
                      shouldShowHeatMap={shouldShowHeatMap}
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
                    { vehicleLocations.length > 0 && <div>
                        <Button style={{marginTop: "1em"}} onClick={() => exportCSVFile(vehicleCsvHeader, this.formatCsvData(vehicleLocations), areaNames[selectedAreaId])} >
                            Export
                        </Button>

                       {authority.includes("get.area.start.points")  && <Checkbox style={{marginTop: "1em", marginLeft: "1em"}} defaultValue={shouldShowHeatMap} onChange={e => this.setState({shouldShowHeatMap: e.target.checked})} >
                            Show HeatMap
                        </Checkbox>}
                      </div>
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


      </PageHeaderWrapper>
    );
  }
}

export default Vehicle;
