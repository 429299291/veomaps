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
import RideDetail from "@/pages/Vehicle/RideDetail";
import CustomerDetail from "@/pages/Customer/CustomerDetail";
import { formatPhoneNumber } from "@/utils/utils"

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
  const violateColor = val >= 0 ? violateTypeColor[val] : "black";
  const limitColor = record.limitType >= 0 ? violateTypeColor[record.limitType] : "black";
  const violateContent = <span style={{ color: violateColor }}>  {(val >= 0 ? violateType[val] : "unknown")}</span>;
  const limitContent = <span style={{ color: limitColor }}> {(record.vehicleType === 1 ? " | " + limitType[record.limitType] : "")}</span>;

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
const vehicleType = ["Bicycle", "Scooter", "E-Bike", "COSMO"];
const lockOperationWay = ["GPRS", "BLUETOOTH", "ADMIN", "ABORT", "TIMEOUT", "PRE_AUTH_FAIL", "REACH_MAX"];
const rideState = ["unconfirmed", "success", "error"];
const rideStateColor = ["#e5bb02", "#0be024", "#ff0000"];


const violateType = ["Normal", "In restricted fence", "out of geo fence", "out of force parking zone", "unknown"];
const limitType = ["Normal", "No Ride Zone", "limit speed zone", "unknown"];
const violateTypeColor = ["black", "#ff0000", "#b72126", "#1300ff", "#f1fc64"];

import { fenceType, fenceTypeColor } from "@/constant";


const refundReason = ["Other", "Lock Issue", "Accidental Deposit", "No Longer in Market", "Fraud", "Scooter Issue", "App Issue", "Phone Issue"];

const queryStatus = ["FROZEN"];

const RefundForm = Form.create()(props => {
  const {
    isModalVisible,
    handleModalVisible,
    form,
    handleRefundRide,
    ride,
    handleGetRideRefundCalculateResult,
    rideRefundCalculateResult
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {

        return;

      } else {
        form.resetFields();

        const payload = {
          refundType: fieldsValue.refundType, 
          refundReason: refundReason[fieldsValue.refundReason],
          note: fieldsValue.note
        }

        if (rideRefundCalculateResult) {
          const refundDetail = rideRefundCalculateResult.refundDetail;
          payload.refundDetail = refundDetail;
        }

        //console.log(payload);

        handleRefundRide(ride.id, payload);

      }


    });
  };

  const shouldOkButtonDisable = form.getFieldValue("refundWay") === "PARTIAL_REFUND" && !rideRefundCalculateResult;

  return (
    <Modal
      destroyOnClose
      title="Refund Ride"
      visible={isModalVisible}
      width="800px"
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      okButtonProps={{disabled:  shouldOkButtonDisable}}
      okText="Refund"
    >

      <FormItem
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label="Refund Type"
      >
        {form.getFieldDecorator("refundType", {
          initialValue: "DEPOSIT"
        })(<Select >
          <Option value={"DEPOSIT"}>
            Deposit
            </Option>
          <Option value={"CREDIT_CARD"}>
            Credit Card
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
        })(<Select style={{ width: 200 }}>
          {refundReason.map((reason, index) => (
            <Option key={index} value={index}>
              {reason}
            </Option>
          ))}

        </Select>)}
      </FormItem>
      {form.getFieldValue("refundReason") === 0 && <FormItem
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
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
      </FormItem>}
      <FormItem
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label="Refund Way"
      >
        {form.getFieldDecorator("refundWay", {
          initialValue: "FULLY_REFUND"
        })(<Select >
          <Option value={"FULLY_REFUND"}>
            Fully Refund
              </Option>
          <Option value={"PARTIAL_REFUND"}>
            Partial Refund
            </Option>
        </Select>)}
      </FormItem>
      {form.getFieldValue("refundWay") === "PARTIAL_REFUND" &&
        <Row>
          <Col span={6} />
          <Col span={18} >
            <span> originally {ride.minutes} minutes. </span>
            <span>
              Refund Ride as
                {form.getFieldDecorator("minutes", {
                initialValue: 1
              })(<InputNumber style={{margin: "0.5em", width:"10%"}} />)}
              minutes
            </span>
            <Button 
              style={{marginLeft: "2em"}}
              type="primary"
              onClick={() => {

                const minutes = form.getFieldValue("minutes");
                const refundType = form.getFieldValue("refundType");

                handleGetRideRefundCalculateResult(ride.id, { minutes: minutes, refundType: refundType });

              }}
            > 
            Estimate
            </Button>
          </Col>
        </Row>
      }

      {
        rideRefundCalculateResult && form.getFieldValue("refundWay") === "PARTIAL_REFUND" &&
        <Row>
          <Col span={6} />
          <Col span={18}>
            {rideRefundCalculateResult.info &&  <div style={{marginTop: "0.5em"}}> <Icon type="warning"  /> {rideRefundCalculateResult.info}  </div>}
            
            <table className={styles.refundTable} style={{marginTop: "0.5em"}} >
                            
              <tbody>
                <tr>
                  <th>original total amount</th>
                  <th>new total amount</th>
                  <th>total to refund</th>
                  {/* <th>mfm</th>
                      <th>mfrm</th>
                      <th>charge frequency</th>
                      <th>charge price</th>
                      <th>unlock fee</th>
                      <th>is low income</th>
                      <th> max charge </th> */}
                </tr>
                <tr>
                  <th>${-1 * (rideRefundCalculateResult.rideTransaction.depositChange
                    + rideRefundCalculateResult.rideTransaction.rideCreditChange
                    - rideRefundCalculateResult.rideTransaction.paymentCharge)
                  }</th>
                  <th>${rideRefundCalculateResult.billingInfo.subTotal
                    + rideRefundCalculateResult.billingInfo.tax}</th>

                  <th>${-1 * (rideRefundCalculateResult.rideTransaction.depositChange
                    + rideRefundCalculateResult.rideTransaction.rideCreditChange
                    - rideRefundCalculateResult.rideTransaction.paymentCharge)
                    - rideRefundCalculateResult.billingInfo.subTotal
                    - rideRefundCalculateResult.billingInfo.tax}</th>
                </tr>
              </tbody>
            </table>
            
            <div style={{marginTop: "0.5em"}}>estimated refund transaction: </div>
            
              <table className={styles.refundTable} style={{marginTop: "0.5em"}} >
                <tbody>
                  <tr>
                    <th>refund to deposit</th>
                    <th>refund to ride credit</th>
                    <th>refund to credit card</th>
                  </tr>
                  <tr>
                    <th>${rideRefundCalculateResult.refundDetail.refundToDeposit}</th>
                    <th>${rideRefundCalculateResult.refundDetail.refundToRideCredit}</th>
                    <th>${rideRefundCalculateResult.refundDetail.refundToCard}</th>
                  </tr>
                </tbody>
              </table>
            
          </Col>                  
        </Row>
      }
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


/* eslint react/no-multi-comp:0 */
@connect(({ rides, areas, geo, loading }) => ({
  rides,
  areas: areas.data,
  geo,
  selectedAreaId: areas.selectedAreaId,
  areaNames: areas.areaNames,
  loading: loading.models.rides
}))
@Form.create()
class Ride extends PureComponent {
  state = {
    isEndRideVisible: false,
    filterCriteria: { currentPage: 1, pageSize: 10 },
    selectedRecord: null,
    rideRefundCalculateResult: null
  };

  columns = [
    {
      title: "Phone",
      render: (text, record) => <a onClick={() => this.setState({ selectedCustomerId: record.customerId }, () => this.handleCustomerDetailModalVisible(true))}>{formatPhoneNumber(record.phone + "")}</a>
    },
    {
      title: "Vehicle Number",
      render: (text, record) => <a onClick={() => this.setState({ selectedVehicleId: record.vehicleId }, () => this.handleVehicleDetailModalVisible(true))}>{record.vehicleNumber}</a>
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
      title: "Tax",
      dataIndex: "tax",
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

        const endTime = val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "not finished";

        const metaData = JSON.parse(record.metaData);

        const endBy = metaData && metaData.adminEmail;

        return <span>{endTime + (endBy ? ("|" + endBy) : "")}</span>

      }
    },
    {
      title: "Minutes",
      render: (text, record) => {
        const minutsDiff = record.end ? record.minutes : moment().diff(moment(record.start), 'minutes');
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


  isRideRefundable = (ride) => {

    const meta = JSON.parse(ride.metaData);

    // return (authority.includes("refund.ride")) && ride.end && (!meta || !meta.refunded);
    return  ride.end && (!meta || !meta.refunded);

  }



  handleGetRides = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

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

  handleVehicleDetailModalVisible = flag => this.setState({ vehicleDetailModalVisible: flag })


  handleCustomerDetailModalVisible = flag => this.setState({ customerDetailModalVisible: flag })

  handleRefundModalVisible = (flag, record) => {

    this.setState({
      isRefundModalVisible: !!flag,
      selectedRecord: record,
      rideRefundCalculateResult: null
    });

  }

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
              selectedRidePathInfo: pathInfo,
            })
        });
<<<<<<< HEAD

        authority.includes("get.fences") && dispatch({
=======
        dispatch({
>>>>>>> develop_davis
          type: "geo/getFences",
          areaId: record.areaId
        });

<<<<<<< HEAD
      }

      dispatch({
        type: "rides/billingInfo",
        id: record.id,
        
        onSuccess: billingInfo =>
          this.setState({
            selectedRideBillingInfo: billingInfo,
          })
      });


=======
>>>>>>> develop_davis
      this.setState({
        detailModalVisible: true,
        selectedRecord: record,
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


  handleRefundRide = (rideId, payload) => {
    const { dispatch } = this.props;

    dispatch({
      type: "rides/refund",
      payload: payload,
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
                <RangePicker style={{ width: "90%" }} format="YYYY-MM-DD HH:mm:ss" showTime />
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

      const values = Object.assign({}, filterCriteria, { areaId: selectedAreaId }, fieldsValue, {
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
              <Button style={{ marginTop: "1em" }} onClick={this.handleExportData} >
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
            <RideDetail
              isVisible={detailModalVisible}
              ride={selectedRecord}
              ridePath={selectedRidePathInfo}
              rideImageUrl={rideImageUrl}
              billingInfo={selectedRideBillingInfo}
              handleDetailModalVisible={this.handleDetailModalVisible}
            />
          )}


        {vehicleDetailModalVisible && selectedVehicleId && (
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
            handleGetRideRefundCalculateResult={this.handleGetRideRefundCalculateResult}
            rideRefundCalculateResult={rideRefundCalculateResult}

          />
        }

      </PageHeaderWrapper>
    );
  }
}

export default Ride;
