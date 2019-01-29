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
  Modal,
  Divider,
  Steps,
  Radio,
  InputNumber,
  DatePicker
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

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
const rideType = ["USING", "FINISHED"];
const vehicleType = ["Bicycle", "Scooter", "E-Ride", "Car"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];

const rideStatus = ["NORMAL", "FROZEN", "ERROR"];

const queryStatus = ["FROZEN"];

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

const RouteMap = compose(
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
  const { path } = props;

  const center = path[Math.round(path.length / 2)];

  return (
    <GoogleMap defaultZoom={11} center={center}>
      <Marker position={path[0]} />
      <Marker position={path[path.length - 1]} />
      <Polyline
        path={path}
        geodesic={true}
        options={{
          strokeColor: "#ff0000",
          strokeOpacity: 0.75,
          strokeWeight: 2
        }}
      />
    </GoogleMap>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ rides, areas, loading }) => ({
  rides,
  areas: areas.data,
  selectedAreaId : areas.selectedAreaId,
  loading: loading.models.rides
}))
@Form.create()
class Ride extends PureComponent {
  state = {
    isEndRideVisible: false,
    filterCriteria: { currentPage: 1, pageSize: 10 },
    selectedRecord: null
  };

  columns = [
    {
      title: "Phone",
      dataIndex: "phone"
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber"
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
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "End",
      dataIndex: "end",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
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
          {!record.end && <Divider type="vertical" />}

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

  handleGetRides = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "rides/get",
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
      type: "rides/get",
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
      () => this.handleGetRides()
    );
  };

  handleSearch = e => {
    typeof e === 'object' && e.preventDefault();

    const { form, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.timeRange) {
        fieldsValue.rideStart = fieldsValue.timeRange[0].format(
          "MM-DD-YYYY HH:mm:ss"
        );
        fieldsValue.rideEnd = fieldsValue.timeRange[1].format(
          "MM-DD-YYYY HH:mm:ss"
        );
        fieldsValue.timeRange = undefined;
      }

      const values = Object.assign({}, filterCriteria, fieldsValue, {
        currentPage: 1,
        pageSize: 10,
        areaId: selectedAreaId
      });

      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetRides()
      );
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleDetailModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    if (!!flag) {

      if (authority.includes("get.ride.route")) {
        dispatch({
          type: "rides/getRoute",
          rideId: record.id,
          onSuccess: path =>
            this.setState({
              selectedRidePath: path,
              detailModalVisible: true,
              selectedRecord: record
            })
        });
      } else {
        this.setState({
          detailModalVisible: true,
          selectedRecord: record
        });
      }


    } else {
      this.setState({
        detailModalVisible: false,
        selectedRecord: null,
        selectedRidePath: null
      });
    }
  };

  handleEndRide = (rideId, minutes) => {
    const { dispatch } = this.props;
    dispatch({
      type: "rides/endRide",
      rideId: rideId,
      minutes: minutes,
      onSuccess: () => this.handleGetRides()
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
      onSuccess: this.handleGetRides
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
          <Col md={6} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("numberOrPhone")(
                <Input placeholder="NUMBER PHONE" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="Type">
              {getFieldDecorator("type")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {rideType.map((status, index) => (
                    <Option key={index} value={index}>
                      {rideType[index]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="Lock Way">
              {getFieldDecorator("lockWay")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {lockOperationWay.map((status, index) => (
                    <Option key={index} value={index}>
                      {lockOperationWay[index]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="Unlock Way">
              {getFieldDecorator("unlockWay")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {lockOperationWay.map((status, index) => (
                    <Option key={index} value={index}>
                      {lockOperationWay[index]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem label="Time">
              {getFieldDecorator("timeRange")(
                <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={{ span: 8, offset: 16 }} sm={24}>
            <span className={styles.submitButtons} style={{ float: "right" }}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleEndRideVisible = (flag, record) => {
    this.setState({
      isEndRideVisible: !!flag,
      selectedRecord: record
    });
  };

  render() {
    const { rides, areas, loading } = this.props;
    const {
      isEndRideVisible,
      detailModalVisible,
      selectedRecord,
      filterCriteria,
      selectedRidePath
    } = this.state;

    const endRideMethod = {
      handleEndRide: this.handleEndRide,
      handleEndRideVisible: this.handleEndRideVisible
    };

    const pagination = {
      defaultCurrent: 1,
      current: filterCriteria.currentPage,
      pageSize: filterCriteria.pageSize,
      total: rides.total
    };

    return (
      <PageHeaderWrapper title="Ride List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              loading={loading}
              data={{ list: rides.data, pagination: pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1300 }}
            />
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
            <Modal
              destroyOnClose
              title="Detail"
              visible={detailModalVisible}
              onCancel={() => this.handleDetailModalVisible()}
              onOk={() => this.handleDetailModalVisible()}
            >
              {Object.keys(selectedRecord).map(key => (
                <p key={key}>{`${key} : ${selectedRecord[key]}`}</p>
              ))}
              {selectedRidePath &&
                selectedRidePath.length >= 2 && (
                  <RouteMap path={selectedRidePath} />
                )}
            </Modal>
          )}
      </PageHeaderWrapper>
    );
  }
}

export default Ride;
