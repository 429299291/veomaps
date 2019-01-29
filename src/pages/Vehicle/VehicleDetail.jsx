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
  Table
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import Vehicle from "./Vehicle";

const FormItem = Form.Item;

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const authority = getAuthority();

const errorStatus = ["NORMAL", "FROZEN", "ERROR"];

const vehicleType = ["Bicycle", "Scooter", "E-Ride", "Car"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const vehicleOrders = ["sign in", "heart", "unlock", "lock", "location", "info", "find", "version", "ip", "error", "alert", "heart period", "iccid", "shut down","ok","mac info"];

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

const UpdateForm = Form.create()(props => {
  const { form, handleUpdate, areas, record, unlockVehicle } = props;
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
      {errorStatus && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Status"
        >
          {form.getFieldDecorator("status", {
            rules: [
              {
                required: true,
                message: "You have pick a status"
              }
            ],
            initialValue: record.errorStatus
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {errorStatus.map((status, index) => (
                <Option key={index} value={index}>
                  {errorStatus[index]}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Status"
      >
        <div>
          {record.lockStatus === 0 ? "Unlock" : "Lock"}
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
            style={{marginRight: "1em"}}
          >
            Update Vehicle
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={unlockVehicle}
            disabled={!authority.includes("unlock.vehicle")}
          >
            Unlock Remotely
          </Button>
        </Col>
      </Row>
    </div>
  );
});



@connect(({ coupons, areas, loading }) => ({
  areas,
  loading: loading.models.geo
}))
class VehicleDetail extends PureComponent {
  state = {
    vehicleDetail: null,
    vehicleRides: null,
    isEndRideVisible: false,
    selectedRide: null,
    vehicleOrders: []
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

  vehicleOrdersColumn  = [
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
    this.handleGetVehicleDetail(this.props.vehicleId);
    this.handleGetVehicleOrders(this.props.vehicleId);
    this.handleGetVehicleRides(this.props.vehicleId);
  };

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



  handleGetVehicleDetail = vehicleId => {
    const { dispatch } = this.props;
    dispatch({
      type: "vehicles/getVehicleDetail",
      vehicleId: vehicleId,
      onSuccess: response => this.setState({ vehicleDetail: response })
    });
  };

  handleGetVehicleOrders = id => {
    const { dispatch } = this.props;

    authority.includes("get.vehicle.orders") &&
    dispatch({
      type: "vehicles/getOrders",
      id: id,
      onSuccess: response => this.setState({ vehicleOrders: response })
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
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/update",
      payload: fields,
      id: id,
      onSuccess: () => {
        this.props.handleGetVehicles();
        this.handleGetVehicleDetail(vehicleId);
      }
    });
  };

  unlockVehicle = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/unlock",
      id: vehicleId,
      onSuccess: () => {
        this.props.handleGetVehicles();
        this.handleGetVehicleDetail(vehicleId);
      }
    });
  };

  render() {
    const {
      vehicleRides,
      isEndRideVisible,
      vehicleOrders,
      selectedRide,
    } = this.state;

    const {
      areas,
      coupons,
      isVisible,
      handleDetailVisible,
      vehicle,
      record
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
                <UpdateForm
                  areas={areas.data}
                  record={record}
                  handleUpdate={this.handleUpdate}
                  unlockVehicle={this.unlockVehicle}
                />
              </Card>

            {authority.includes("get.rides")  &&
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
              />
            </Card>
            }

          </div>
      </Modal>
    );
  }
}

export default VehicleDetail;
