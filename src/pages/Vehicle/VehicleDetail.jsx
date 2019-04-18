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
import errorVehicle from "../../assets/bike_report_lock.png";
import errorVehicleUnlock from "../../assets/bike_report.png";
import lowBattery from "../../assets/bike_mark_low_lock.png";
import vehicleUnlock from "../../assets/bike_mark.png";
import ebike from "../../assets/ebike_mark.png";
import bike from "../../assets/bike_mark_lock.png";
import { compose, withProps } from "recompose";
import { GoogleMap, Marker, withGoogleMap, withScriptjs, Polygon, Polyline } from "react-google-maps";

const FormItem = Form.Item;

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

import {fenceType, fenceTypeColor} from "@/constant";

const authority = getAuthority();

const errorStatus = ["NORMAL", "FROZEN", "ERROR"];

const vehicleType = ["Bicycle", "Scooter", "E-Bike", "Car"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const vehicleOrders = ["","sign in", "heart", "unlock", "lock", "location", "info", "find", "version", "ip", "error", "alert", "heart period", "iccid", "shut down","ok","mac info"];


const getVehicleIcon = (vehicleDetail) => {
  if (vehicleDetail.errorStatus === 1) {
    if (vehicleDetail.lockStatus === 1) {
      return errorVehicle;
    } else {
      return errorVehicleUnlock;
    }
  }

  if (vehicleDetail.power <=350) {
    return lowBattery;
  }

  if (vehicleDetail.lockStatus === 0) {
    return vehicleUnlock;
  }

  if (vehicleDetail.vehicleType === 2) {
    return ebike;
  }

  return bike;
}

const LocationMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPnV_7djRAy8m_RuM5T0QIHU5R-07s3Ic&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const { record, fences,  vehicleDetail } = props;

  const location = (({ x, y }) => ({ lat: y, lng:x }))(vehicleDetail.location);

  const dashLineDot = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillOpacity: 1,
    scale: 2
  };

  return (
    <GoogleMap defaultZoom={15} center={location}>
      {fences.map(fence => (
        <Polygon
          path={fence.fenceCoordinates}
          geodesic={true}
          key={fence.id}
          options={{
            strokeColor: fenceTypeColor[fence.fenceType],
            strokeOpacity: fence.fenceType === 5 ? 0 : 0.75,
            strokeWeight: fence.fenceType === 5 ? 0 : 2,
            fillColor: fenceTypeColor[fence.fenceType],
            fillOpacity:
              fence.fenceType === 0 || fence.fenceType === 5 ? 0 : 0.35
          }}
        />
      ))}

    {authority.includes("get.fences") && fences && fences.map(fence => (
        <Polygon
          path={fence.fenceCoordinates}
          geodesic={true}
          key={fence.id}
          options={{
            strokeColor: fenceTypeColor[fence.fenceType],
            strokeOpacity: fence.fenceType === 5 ? 0 : 0.75,
            strokeWeight: fence.fenceType === 5 ? 0 : 2,
            fillColor: fenceTypeColor[fence.fenceType],
            fillOpacity:
              fence.fenceType === 0 || fence.fenceType === 5 ? 0 : 0.35
          }}
        />
      ))}

      {authority.includes("get.fences") && fences && fences.filter(fence => fence.fenceType === 5).map(fence => (
        <Polyline
          path={fence.fenceCoordinates}
          geodesic={true}
          key={fence.id}
          options={{
            strokeColor: fenceTypeColor[fence.fenceType],
            strokeOpacity: 0.75,
            strokeWeight: 2,
            icons: [
              {
                icon: dashLineDot,
                offset: "0",
                repeat: "10px"
              }
            ],
            fillColor: fenceTypeColor[5],
            fillOpacity: 0
          }}
        />
      ))}

      <Marker
        position={location}
        icon={getVehicleIcon(record)}
      />
    </GoogleMap>
  );
});


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
  const { form, handleUpdate, areas, record, unlockVehicle, updateLocation, alertVehicle } = props;
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
          {form.getFieldDecorator("errorStatus", {
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
        label="Mac"
      >
        <div>
          {record.mac}
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
            style={{marginRight: "1em", marginTop: "0.5em"}}
          >
            Update Vehicle
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={unlockVehicle}
            disabled={!authority.includes("unlock.vehicle")}
            style={{marginRight: "1em", marginTop: "0.5em"}}
          >
            Unlock Remotely
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={alertVehicle}
            disabled={!authority.includes("alert.vehicle")}
            style={{marginRight: "1em", marginTop: "0.5em"}}
          >
            Beep Remotely
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={updateLocation}
            disabled={!authority.includes("update.vehicle.location")}
            style={{marginTop: "0.5em"}}
          >
            Update Location
          </Button>
        </Col>
      </Row>
    </div>
  );
});



@connect(({ coupons, areas, geo, loading }) => ({
  areas,
  geo,
  loading: loading.models.geo || loading.models.areas
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
    authority.includes("get.vehicles.detail") &&
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

  unlockVehicle = () => {
    const { dispatch, vehicleId, handleGetVehicles } = this.props;
    dispatch({
      type: "vehicles/unlock",
      id: vehicleId,
      onSuccess: () => {
        handleGetVehicles && handleGetVehicles();
        setTimeout(() => {
          this.handleGetVehicleDetail(vehicleId);
          this.handleGetVehicleOrders(vehicleId);
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


  


  updateLocation = () => {
    const { dispatch, vehicleId } = this.props;
    dispatch({
      type: "vehicles/updateLocation",
      id: vehicleId,
      onSuccess: () => {
        setTimeout(() => {
          this.handleGetVehicleDetail(vehicleId);
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
      vehicleDetail
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
                  unlockVehicle={this.unlockVehicle}
                  updateLocation={this.updateLocation}
                  alertVehicle={this.alertVehicle}
                />}
              </Card>


            {
              authority.includes("get.vehicles.detail") && vehicleDetail && vehicleDetail.location && record &&
              <Card title="Location">
                <LocationMap
                  vehicleDetail={vehicleDetail}
                  fences={geo.fences}
                  record={record}
                />
              </Card>
            }


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
