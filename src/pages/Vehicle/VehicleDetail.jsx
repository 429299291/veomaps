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

const vehicleType = ["Bicycle", "Scooter", "E-Bike", "Car"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const vehicleOrders = ["", "sign in", "heart", "unlock", "lock", "location", "info", "find", "version", "ip", "error", "alert", "heart period", "iccid", "shut down", "ok", "mac info", "connect", "disconnect", "version update", "Report", "External Device"];


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

const VehicleControlForm = Form.create()(props => {
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleControl(record.id, fieldsValue);
      });
  };

  const {
    form,
    record,
    handleControl,
  } = props;

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
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Light"
      >
        {form.getFieldDecorator("changeLight", {
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Mode"
      >
        {form.getFieldDecorator("changeMode", {
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Cruise Control"
      >
        {form.getFieldDecorator("cruiseControl")(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Inch Status"
      >
        {form.getFieldDecorator("inchStatus")(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Start Type"
      >
        {form.getFieldDecorator("startType", {
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Non-Zero Start</Option>
            <Option value={2}>Zero Start</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="High Speed Limit"
      >
        {form.getFieldDecorator("highSpeedLimit", {
        })(
          <Slider defaultValue={0} max={25} step={null} marks={marks} />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Med Speed Limit"
      >
        {form.getFieldDecorator("midSpeedLimit", {
        })(
          <Slider defaultValue={0} max={25} step={null} marks={marks} />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Low Speed Limit"
      >
        {form.getFieldDecorator("lowSpeedLimit", {
        })(
          <Slider defaultValue={0} max={25} step={null} marks={marks} />
        )}
      </FormItem>
      <Button
        icon="plus"
        type="primary"
        onClick={okHandle}
        disabled={!form.isFieldsTouched() && !authority.includes("vehicle.control.extension")}
        style={{ marginRight: "1em", marginTop: "0.5em" }}
      >
        Update Control
      </Button>
    </div>
  );
});

const VehicleControlExtensionForm = Form.create()(props => {
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleControlExtension(record.id, fieldsValue);
      });
  };

  const {
    form,
    record,
    handleControlExtension,
  } = props;

  return (
    <div>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Headlight"
      >
        {form.getFieldDecorator("headLight", {
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Taillight"
      >
        {form.getFieldDecorator("tailLight", {
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Speed Mode"
      >
        {form.getFieldDecorator("speedMode", {
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Low Speed</Option>
            <Option value={2}>Medium Speed</Option>
            <Option value={3}>High Speed</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Throttle"
      >
        {form.getFieldDecorator("throttleStatus", {
        })(
          <Select defaultValue='Not Set' placeholder="select" style={{ width: "100%" }}>
            <Option value={0}>Not Set</Option>
            <Option value={1}>Off</Option>
            <Option value={2}>On</Option>
          </Select>
        )}
      </FormItem>
      <Button
        icon="plus"
        type="primary"
        onClick={okHandle}
        disabled={!form.isFieldsTouched() && !authority.includes("vehicle.control.extension")}
        style={{ marginRight: "1em", marginTop: "0.5em" }}
      >
        Update Control Extension
      </Button>
    </div>
  )
});


const UpdateForm = Form.create()(props => {
  const { form, handleUpdate, areas, record, changeLockStatus, updateLocation, alertVehicle, getVehicleStatus, restartVehicle } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleUpdate(record.id, fieldsValue);
      });
  };

  return (
    <div>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Vehicle Id"
      >
        <div>
          {record.id}
        </div>
      </FormItem>

      {errorStatus && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Status"
        >
          <div>


            {form.getFieldDecorator("errorStatus", {
              rules: [
                {
                  required: true,
                  message: "You have pick a area"
                }
              ],
              initialValue: record.errorStatus
            })(
              <Select placeholder="select" style={{ width: "100%" }}>

                <Option value={0} >Normal</Option>

                <Option value={1} >Error</Option>

                <Option disabled={true} value={3} >Deativated</Option>

                <Option disabled={true} value={5} >Rebalance</Option>

                <Option disabled={true} value={6} >Maintain</Option>

                <Option disabled={true} value={7} >Out of Service</Option>


              </Select>
            )}

          </div>
        </FormItem>
      )}

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Connect Status"
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
        label="Is Connected"
      >
        <div>
          {record.connectStatus === 1 ? "true" : "false"}
        </div>
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

      <Row>
        <Col>
          <Button
            icon="plus"
            type="primary"
            onClick={okHandle}
            disabled={!form.isFieldsTouched() && !authority.includes("update.vehicle.detail")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Update Vehicle
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={changeLockStatus}
            disabled={!authority.includes("unlock.vehicle")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            {(record.lockStatus === 1 ? "Unlock" : "Lock") + " Vehicle"}
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={alertVehicle}
            disabled={!authority.includes("alert.vehicle")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Beep Remotely
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={updateLocation}
            disabled={!authority.includes("update.vehicle.location")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Update Location
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            icon="plus"
            type="primary"
            onClick={getVehicleStatus}
            disabled={!form.isFieldsTouched() && !authority.includes("get.status")}
            style={{ marginRight: "1em", marginTop: "0.5em" }}
          >
            Get Status
          </Button>

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
    </div>
  );
});



@connect(({ coupons, areas, geo, loading }) => ({
  areas,
  loading: loading.models.areas
}))
class VehicleDetail extends PureComponent {
  state = {
    vehicleRides: null,
    isEndRideVisible: false,
    selectedRide: null,
    vehicleOrders: [],
    orderTablePagination: null
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
            authority.includes("end.vehicle.ride") && (
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

  vehicleOrdersColumn = [
    {
      title: "Type",
      dataIndex: "orderId",
      render: val => <span>{vehicleOrders[val]}</span>
    },
    {
      title: "Content",
      dataIndex: "content"
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
    this.handleGetVehicleOrders(this.props.vehicleId);
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
      onSuccess: response => this.setState({ record: response }, () => this.getAreaGeoInfo(response.areaId))
    });
  };

  getVehicleStatus = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/getStatus",
      vehicleId: vehicleId,
      onSuccess: () => {
        setTimeout(() => {
          this.handleGetVehicleOrders(vehicleId);
        }, 4000)
      }
    });
  }

  restartVehicle = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/restart",
      vehicleId: vehicleId,
      onSuccess: () => {
        setTimeout(() => {
          this.handleGetVehicleOrders(vehicleId);
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

  handleGetVehicleOrders = id => {
    const { dispatch } = this.props;

    authority.includes("get.vehicle.orders") &&
      dispatch({
        type: "vehicles/getOrders",
        id: id,
        onSuccess: response => this.setState({ vehicleOrders: response, orderTablePagination: { current: Math.round((response.length / 10) + 1) } })
      });
  };

  handleGetVehicleRides = vehicleId => {
    const { dispatch } = this.props;

    authority.includes("get.rides") &&
      dispatch({
        type: "rides/getVehicleRides",
        vehicleId: vehicleId,
        onSuccess: response => this.setState({ vehicleRides: response })
      });
  };

  handleUpdate = (id, fields) => {
    const { dispatch, vehicleId, handleGetVehicles } = this.props;
    dispatch({
      type: "vehicles/update",
      payload: fields,
      id: id,
      onSuccess: () => {
        handleGetVehicles && handleGetVehicles();
        this.handleGetVehicle(vehicleId);
      }
    });
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



    if ((type === "vehicles/unlock" && authority.includes("unlock.vehicle")) || (type === "vehicles/lock" && authority.includes("lock.vehicle"))) {
      dispatch({
        type: type,
        id: vehicleId,
        onSuccess: () => {
          handleGetVehicles && handleGetVehicles();
          setTimeout(() => {
            this.handleGetVehicleOrders(vehicleId);
          }, 1500)
        }
      });
    }

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
        setTimeout(() => {
          this.handleGetVehicleOrders(vehicleId);
        }, 3000)
      }
    });
  }

  render() {
    const {
      vehicleRides,
      isEndRideVisible,
      vehicleOrders,
      selectedRide,
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
              alertVehicle={this.alertVehicle}
            />}
          </Card>

          {record && <Card title="Location">
            <LocationMap
              record={record}
            />
          </Card>}


          {authority.includes("get.rides") &&
            <Card title="Vehicle Rides" style={{ marginTop: "2em" }}>
              <Table
                dataSource={vehicleRides}
                columns={this.vehicleRideColumns}
                scroll={{ x: 1300 }}
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

          {authority.includes("get.vehicle.orders") &&
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
          {authority.includes("vehicle.control") &&
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
          }
        </div>
      </Modal>
    );
  }
}

export default VehicleDetail;