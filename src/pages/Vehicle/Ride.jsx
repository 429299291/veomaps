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
  DatePicker,
  message
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import VehicleDetail from "@/pages/Vehicle/VehicleDetail";
import CustomerDetail from "@/pages/Customer/CustomerDetail";
import {formatPhoneNumber} from "@/utils/utils"

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
}


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

const getViolateType = (val, record) => {
  const violateColor = val >= 0 ?  violateTypeColor[val] : "black";
  const limitColor = record.limitType >= 0 ?  violateTypeColor[record.limitType] : "black";
  const violateContent = <span style={{color: violateColor}}>  {(val >= 0 ? violateType[val] : "unknown")  }</span>;
  const limitContent = <span style={{color: limitColor}}> {(record.vehicleType === 1 ? " | " + limitType[record.limitType] : "")}</span>;

  return <span>{violateContent}{limitContent}</span>
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
const rideType = ["USING", "FINISHED"];
const vehicleType = ["Bicycle", "Scooter", "E-Bike", "Car"];
const lockOperationWay = ["GPRS", "BLUETOOTH", "ADMIN", "UNKNOWN"];
const rideState = ["unconfirmed","success","error"];
const rideStateColor = ["#e5bb02","#0be024","#ff0000"];


const violateType = ["Normal", "In restricted fence", "out of geo fence", "out of force parking zone", "unknown"];
const limitType = ["Normal", "No Ride Zone", "limit speed zone", "unknown"];
const violateTypeColor = ["black", "#ff0000", "#b72126","#1300ff", "#f1fc64"];

import {fenceType, fenceTypeColor} from "@/constant";


const refundReason = ["Other", "Lock Issue", "Accidental Deposit", "No Longer in Market", "Fraud", "Scooter Issue", "App Issue", "Phone Issue"];

const queryStatus = ["FROZEN"];

const RefundForm = Form.create()(props => {
  const {
    isModalVisible,
    handleModalVisible,
    form,
    handleRefundRide,
    ride
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        
        return; 

      } else {
        form.resetFields();
      
        handleRefundRide(ride.id, fieldsValue);
      }
    
     
    });
  };

  return (
    <Modal
      destroyOnClose
      title="Refund Ride"
      visible={isModalVisible}
      onOk={() => okHandle()}
      onCancel={() => handleModalVisible(false)}

    >

    <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Refund Type"
      >
        {form.getFieldDecorator("refundType", {
          initialValue: 1
        })(<Select >
            <Option  value={1}>
                Deposit
            </Option>
            <Option  value={2}>
                Credi Card
            </Option>
        </Select>)}
      </FormItem>

      <FormItem
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label="Refund Reason"
      >
        {form.getFieldDecorator("refundReason", {
          initialValue: 1
        })(<Select  style={{ width: 200 }}>
             {refundReason.map((reason, index) => (
                    <Option key={index} value={index}>
                      {reason}
                    </Option>
            ))}
        
        </Select>)}
      </FormItem>
      {form.getFieldValue("refundReason") === 0 && <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Notes"
        >
          {form.getFieldDecorator("note", {
            rules: [
              {
                required: true,
                message: "note can't be empty",
                max: 50,
                min: 1
              }
            ]
          })(<TextArea autosize={{ minRows: 3, maxRows: 10 }} />)}
      </FormItem> }
    </Modal>
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

const RouteMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `250px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const { pathInfo, fences } = props;

  const path = pathInfo.path;

  const distance = pathInfo.distance;

  const center = path[Math.round(path.length / 2)];

  const dashLineDot = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillOpacity: 1,
    scale: 2
  };

  return (
    
    <div style={{position: "relative"}}>
     <div>distance: {Math.round(distance * 100 )/ 100} miles </div>
      <GoogleMap defaultZoom={15} center={center} style={{height: "90%"}}>
        <Marker position={path[0]} label={"start"} />
        <Marker position={path[path.length - 1]} label={"end"}  />
        <Polyline
          path={path}
          geodesic={true}
          options={{
            strokeColor: "#ff0000",
            strokeOpacity: 0.75,
            strokeWeight: 2
          }}
        />

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

        {authority.includes("get.fences") && fences &&  fences.filter(fence => fence.fenceType === 5).map(fence => (
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
        
        
      </GoogleMap>
      
     

     

    </div>
  );
});



/* eslint react/no-multi-comp:0 */
@connect(({ rides, areas, geo, loading }) => ({
  rides,
  areas: areas.data,
  geo,
  selectedAreaId : areas.selectedAreaId,
  areaNames: areas.areaNames,
  loading: loading.models.rides
}))
@Form.create()
class Ride extends PureComponent {
  state = {
    isEndRideVisible: false,
    filterCriteria: { currentPage: 1, pageSize: 10 },
    selectedRecord: null,
  };

  columns = [
    {
      title: "Phone",
      render: (text,record) => <a onClick={() => this.setState({selectedCustomerId: record.customerId},() =>  this.handleCustomerDetailModalVisible(true))}>{formatPhoneNumber(record.phone+"")}</a>
    },
    {
      title: "Vehicle Number",
      render: (text,record) => <a onClick={() => this.setState({selectedVehicleId: record.vehicleId},() =>  this.handleVehicleDetailModalVisible(true))}>{record.vehicleNumber}</a>
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      render: val => <span>{vehicleType[val]}</span>
    },
    {
      title: "Lock Way",
      dataIndex: "lockMethod",
      render: val => <span>{lockOperationWay[val]}</span>
    },
    {
      title: "Charge",
      dataIndex: "charge",
    },
    {
      title: "Violate Type",
      dataIndex: "violateType",
      render: getViolateType
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
      render: (val, record) => {

        const endTime = val ?  moment(val).format("YYYY-MM-DD HH:mm:ss") : "not finished";

        const metaData = JSON.parse(record.metaData);

        const endBy = metaData && metaData.adminEmail;

        return <span>{endTime + (endBy ? ("|" + endBy) : "")}</span>
        
      }
    },
    {
      title: "Minutes",
      render: (text, record) =>  { 
        const minutsDiff = (record.end ? moment(record.end) : moment()).diff(moment(record.start), 'minutes'); 
        return <span>{minutsDiff}</span>
      }
    },
    {
      title: "Distance",
      dataIndex: "distance",
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

            <a onClick={() =>  this.handleDetailModalVisible(true, record)}>
              Detail
            </a>

        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleSearch();
  }
   

  isRideRefundable = (ride) => {

    const meta = JSON.parse(ride.metaData);

    return (authority.includes("refund.ride")) && ride.end && (!meta || !meta.refunded);

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
        
        fieldsValue.rideStart = moment(fieldsValue.timeRange[0]).utcOffset(0).format(
          "MM-DD-YYYY HH:mm:ss"
        );
        fieldsValue.rideEnd = moment(fieldsValue.timeRange[1]).utcOffset(0).format(
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

  handleVehicleDetailModalVisible = flag => this.setState({vehicleDetailModalVisible: flag})


  handleCustomerDetailModalVisible = flag => this.setState({customerDetailModalVisible: flag})

  handleRefundModalVisible = (flag, record) => {

    this.setState({
      isRefundModalVisible: !!flag,
      selectedRecord: record
    });

  }

  handleDetailModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    const { filterCriteria, rideImageUrl } = this.state;

    if (!!flag) {

      authority.includes("get.ride.image") && record.imageId && dispatch({
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

      if (authority.includes("get.ride.route")) {


        dispatch({
          type: "rides/getRoute",
          rideId: record.id,
          onSuccess: pathInfo =>
            this.setState({
              selectedRidePathInfo: pathInfo,
            })
        });
        authority.includes("get.fences") && dispatch({
          type: "geo/getFences",
          areaId: record.areaId
        });
        
      } 
        this.setState({
          detailModalVisible: true,
          selectedRecord: record,
        });
      


    } else {
      this.setState({
        detailModalVisible: false,
        selectedRecord: undefined,
        selectedRidePathInfo: undefined,
        rideImageUrl: undefined
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


  handleRefundRide = (rideId, fieldValues) => {
    const { dispatch } = this.props;

    if (!authority.includes("refund.ride"))
      return;

    dispatch({
      type: "rides/refund",
      payload: fieldValues,
      id: rideId,
      onSuccess: this.handleGetRides
    });

    this.handleRefundModalVisible();
  }

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
                  <Option value={null}>All</Option>
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
                  <Option value={null}>All</Option>
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
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={7} md={12} sm={24}>
            <FormItem label="Time" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} >
              {getFieldDecorator("timeRange")(
                <RangePicker style={{width: "90%"}} format="YYYY-MM-DD HH:mm:ss" showTime />
              )}
            </FormItem>
          </Col>
          <Col lg={7} md={12} sm={24}>
            <FormItem label="Vehicle Type" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator("vehicleType")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {vehicleType.map((status, index) => (
                    <Option key={index} value={index}>
                      {vehicleType[index]}
                    </Option>
                  ))}
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            {`count: ${this.props.rides.total}`}
          </Col>
          <Col md={{ span: 8, offset: 12 }} sm={24}>
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

  formatCsvData = rides => {
    const {areaNames, selectedAreaId} = this.props;

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
        start: moment(ride.start).format("MM-DD-YYYY HH:mm:ss"),
        end: moment(ride.end).format("MM-DD-YYYY HH:mm:ss"),
        area: areaNames[ride.areaId],
        state: ride.state,
        areaId: ride.areaId,
        created: moment(ride.created).format("MM-DD-YYYY HH:mm:ss"),
        vehicleId: ride.vehicleId,
        customerId: ride.customerId,
        distance: ride.distance
      }
    })
  }


  handleExportData = () => {

    const { form, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.timeRange) {
        
        fieldsValue.rideStart = moment(fieldsValue.timeRange[0]).utcOffset(0).format(
          "MM-DD-YYYY HH:mm:ss"
        );
        fieldsValue.rideEnd = moment(fieldsValue.timeRange[1]).utcOffset(0).format(
          "MM-DD-YYYY HH:mm:ss"
        );
        fieldsValue.timeRange = undefined;
      }

      const values = Object.assign({}, filterCriteria, {areaId: selectedAreaId}  ,fieldsValue, {
        currentPage: null,
        pageSize: null,
        areaId: selectedAreaId
      });

      this.setState(
        {
          filterCriteria: values
        },
        this.finishExportData
      );
    });
  }

  finishExportData() {
    const { filterCriteria } = this.state;
    const { areaNames, selectedAreaId, dispatch } = this.props;
    dispatch({
      type: "rides/getAll",
      payload: filterCriteria,
      onSuccess: data => {
        exportCSVFile(rideCsvHeader, this.formatCsvData(data), areaNames[selectedAreaId])
      }
    })
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
      isRefundModalVisible
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
              scroll={{ x: 1400 }}
            />

            {selectedAreaId >= 1 && <div>
                        <Button style={{marginTop: "1em"}} onClick={this.handleExportData} >
                            Export
                        </Button>
                      </div>
            }
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
              width={"50%"}
              onCancel={() => this.handleDetailModalVisible()}
              onOk={() => this.handleDetailModalVisible()}
            >
            <Row width={800}>

              <Col xs={24} sm={12} style={{fontSize: "0.7em"}}>
                {Object.keys(selectedRecord).map(key => (
                  <p key={key}>{`${key} : ${selectedRecord[key]}`}</p>
                ))}
              </Col>

              <Col xs={24} sm={12}>

              {selectedRidePathInfo &&
                selectedRidePathInfo.distance > 0 && (
                  <RouteMap
                    pathInfo={selectedRidePathInfo}
                    fences={geo.fences}
                  />
                )}

               

                {
                  rideImageUrl &&
                    
                    <div style={{width: "90%", height: "480px"}}>
                       <img  src={rideImageUrl} style={{ maxWidth: "130%", maxHeight: "435px",  marginTop: "70px", marginLeft: "-40px"}} className={styles.rotate90} />
                    </div>
                   
                }
                  
              </Col>
             
             
            </Row>
             


               
             
            </Modal>
          )}

        {vehicleDetailModalVisible && selectedVehicleId && authority.includes("get.vehicle") && (
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

      {isRefundModalVisible && 
        <RefundForm 
          isModalVisible={isRefundModalVisible}
          handleModalVisible={this.handleRefundModalVisible}
          handleRefundRide={this.handleRefundRide}
          ride={selectedRecord}
        />
      }

      </PageHeaderWrapper>
    );
  }
}

export default Ride;
