import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Steps,
  Radio,
  Divider,
  Popconfirm,
  InputNumber,
  Popover,
  DatePicker,
  message
} from 'antd';

import VehicleDetail from "@/pages/Vehicle/VehicleDetail";
import RideDetail from "@/pages/Vehicle/RideDetail";
import CustomerDetail from "@/pages/Customer/CustomerDetail";

const { RangePicker } = DatePicker;

import { compose, withProps } from "recompose";
import {
  GoogleMap,
  Marker,
  Polygon,
  Polyline,
  withGoogleMap,
  withScriptjs
} from "react-google-maps";


import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './VehicleViolation.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

import {violationStatus} from "@/constant";
import violation from '@/models/violation';

import {formatPhoneNumber} from "@/utils/utils"

import { getAuthority } from "@/utils/authority";
import { reject } from 'lodash';

const authority = getAuthority();

const ViolationLocation = compose(
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
  const { location } = props;

  return (
    <GoogleMap defaultZoom={12} center={location}>
      <Marker position={location} label={"Location"} />
    </GoogleMap>
  );
});
const RenderSimpleForm=(props)=> {
  const [form] = Form.useForm()
  const handleFormReset = ()=>{
    props.handleFormReset()
    form.resetFields()
  }
  // const areas = this.props.areas.data;
  return (
    // <Form onSubmit={e => {typeof e === 'object' && e.preventDefault(); this.getViolations();}} layout="inline">
    <Form form={form} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Customer Phone"
              name='phone'
              rules={
                [
                  {
                      //test phone number format
                  validator: (rule, value, callback) => {
                      if (value === null ||  /^\d{10}$/.test(value) || value === "") {
                        callback();
                        return;
                      }
                  
                      callback("Must be a valid phone number");
                    }
                  }
              ]
              }
            >
                  
                <InputNumber placeholder="Please Phone Number" style={{width: "100%"}}/>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Status"
              name='status'
            >
              <Select placeholder="select" style={{ width: "100%" }}>
                <Option key="0" value="0">Waiting For Review</Option>
                <Option key="1" value="1">Rejected</Option>
                <Option key="2" value="2">Approved</Option>
                <Option key="3" value="3">Reverted</Option>
                <Option value={null}>All</Option>
              </Select>
            </FormItem>
          </Col>
          <Col  md={8} sm={24}>
            <FormItem label="Time" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name='timeRange'>
                <RangePicker style={{width: "90%"}} format="YYYY-MM-DD HH:mm:ss" showTime />
            </FormItem>
          </Col>
          </Row>
          <Row>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={()=>{props.getViolations(form.getFieldsValue(true))}}>
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                Reset
              </Button>
            </span>
          </Col>
      </Row>
    </Form>
  );
}

const UpdateForm = ((props) => {
  const {
    modalVisible,
    handleUpdate,
    handleUpdateReject,
    handleUpdateApprove,
    handleModalVisible,
    record,
    recordDetail
  } = props;
  const [form] = Form.useForm()
  
  const validateFormAndUpdate = newState => {
    // newState   2:approve  1:reject
      const fieldsValue = form.getFieldsValue(true)
        // fieldsValue.type = newState;
        newState == 1 ? handleUpdateReject(record.id, fieldsValue) : handleUpdateApprove(record.id, fieldsValue)
        form.resetFields();
        handleModalVisible();
  };

  const cancelUpdate = () => {

    form.resetFields();

    handleModalVisible();
  }

  const violationStatusIndex = {
    WAITING: 0,
    REJECT: 1,
    APPROVE: 2,
    REVERT: 3
  };
  
  const footer = [];


  const getRevertOrRejectButton = (shoudlDisable, name) => {


    let statusChange;

    let button;

    if (name === "Reject") {

      button =  <Button key="reject" style={{color: "white", backgroundColor: "#e8380c", margin: "0 0.5em"}} disabled={shoudlDisable} onClick={() => validateFormAndUpdate(violationStatusIndex.REJECT)}>
                  Reject
            </Button>

    } else if (name === "Revert") {

      button =   <Button key="revert" type="danger" disabled={shoudlDisable} style={{ margin: "0 0.5em"}}  onClick={() => validateFormAndUpdate(violationStatusIndex.REVERT)}>
          Revert
      </Button>

    } else {
      
      return undefined;

    }


    return shoudlDisable ? <Popover content={`You have to edit Reject/Revert Note in order to ${name} this violation.`}>{button}</Popover> : button;

      
  }


  // const isAdmidNoteUpdated = form.isFieldTouched("adminNote") && form.getFieldValue("adminNote") !== "" ;
  const isAdmidNoteUpdated = form.getFieldValue("adminNote") !== "" ;

  //wait for review
  if (record.status === violationStatusIndex.WAITING) {

    footer.push(<Button key="approve" style={{color: "white", backgroundColor: "#51B5AA"}} onClick={() => validateFormAndUpdate(violationStatusIndex.APPROVE)}>
        Approve
    </Button>);

    footer.push(getRevertOrRejectButton(!isAdmidNoteUpdated, "Reject"));
    
  }

  //approved state
  if (record.status === violationStatusIndex.APPROVE) {

    footer.push(getRevertOrRejectButton(!isAdmidNoteUpdated, "Revert"));


  }

   footer.push(<Button key="cancel"  onClick={cancelUpdate}>
        Cancel
    </Button>);

   const isReviewEditable = (record.status === violationStatusIndex.WAITING || record.status === violationStatusIndex.APPROVE);

  return (
    <Modal
      destroyOnClose
      title="Detail"
      visible={modalVisible}
      onCancel={cancelUpdate}
      width={960}
      forceRender
      footer={footer}
    >
      <Form form={form}>
      <Row>
        <Col xs={24} sm={12} style={{height: "90%"}}> 
        {recordDetail && recordDetail.violationTechnicianInfo &&
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Technician Note">
          {<span>{recordDetail.violationTechnicianInfo.technicianNote}</span>}
          </FormItem>
        }

      {

        recordDetail && recordDetail.phone &&
        <FormItem labelCol={{ span: 8}} wrapperCol={{ span: 12 }} label="Technician Number">
            {<span>{recordDetail.phone}</span>}
        </FormItem>
      }
      {
        recordDetail &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12}} label="Customer Violations">
            {<span>{recordDetail.customerViolationCount}</span>}
        </FormItem>
      }
      {
        recordDetail &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12}} label="Ride Start">
            {<span>{moment(recordDetail.start).format('YYYY-MM-DD HH:mm:ss') }</span>}
        </FormItem>
      }
      {
        recordDetail &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12}} label="Ride End">
            {<span>{moment(recordDetail.end).format('YYYY-MM-DD HH:mm:ss') }</span>}
        </FormItem>
      }
      {
        recordDetail &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12}} label="Ride Duration">
            {<span>{recordDetail.minutes} mins</span>}
        </FormItem>
      }
      {
        record && record.phone &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12}} label="Customer Phone">
            {<span>{record.phone}</span>}
        </FormItem>
      }
      {
        recordDetail && recordDetail.firstName &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Technician">
            {<span>{recordDetail.firstName+' '+recordDetail.lastName}</span>}
        </FormItem>
      }


      {
        record &&  record.status >= 0 &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Status">
            {<span style={{color: violationStatus[record.status].color}}>{violationStatus[record.status].name}</span>}
        </FormItem>
      }

      {
        recordDetail && record.status >= 0 &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label={`${violationStatus[record.status].name} By`}>
            {<span>{recordDetail.email}</span>}
        </FormItem>
      }
      {
        record.adminNote &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Admin Note">
            {<span>{record.adminNote}</span>}
        </FormItem>
      }
      { isReviewEditable && <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} style={{marginTop: "160px"}} label="Reject/Revert Note" name='adminNote'>
        <TextArea placeholder="Please Input" />
      </FormItem> }
        
        
      </Col>

        <Col xs={24} sm={12}> 
        
            {
            recordDetail && recordDetail.location &&
            <ViolationLocation 
             style={{height: "100px"}}
              location={{lat: recordDetail.location.lat, lng: recordDetail.location.lng}}
            />

            }
            {
              recordDetail &&  recordDetail.downloadUrl &&
                <Row style={{height: "420px", textAlign: "center"}}>
                          
                  <img  src={recordDetail.downloadUrl} style={{ maxWidth: "90%", maxHeight: "420px",  marginTop: "10px"}}  />

                </Row>
            }
        
        </Col>
      </Row>
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
class VehicleViolation extends PureComponent {
  state = {
    selectedCustomerId: undefined,
    selectedVehicleId: undefined,
    modalVisible: false,
    updateModalVisible: false,
    filterCriteria: {currentPage: 1, pageSize: 10 },
    selectedRecord: {},
    selectedRecordDetail: {},
  };

  columns = [
    {
      title: "Customer Phone",
      render: (text,record) => <a onClick={() => this.setState({selectedCustomerId: record.customerId},() =>  this.handleCustomerDetailModalVisible(true))}>{formatPhoneNumber(record.phone+"")}</a>
    },
    {
      title: "Vehicle Number",
      render: (text,record) => <a onClick={() => this.setState({selectedVehicleId: record.vehicleId},() =>  this.handleVehicleDetailModalVisible(true))}>{record.vehicleNumber}</a>
    },
    {
        title: 'Created',
        dataIndex: 'created',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: 'Status',
        dataIndex: "status",
        render: (val,record) => <span style={{color: violationStatus[val].color}}> {`${violationStatus[val].name} ${ val === 0 ? "" : `(${ moment(record.updated).format('YYYY-MM-DD HH:mm:ss')})` }`} </span>
      },
      {
        title: 'Area',
        dataIndex: 'areaId',
        render: areaId => <span>{this.props.areas.areaNames[areaId]}</span>,
      },
    {
      title: 'Operation',
      render: (text, record) => (
        <div>
          <a onClick={() => { 
              this.handleUpdateModalVisible(true, record);
              this.handleGetViolationDetail(record.id,record);
              }}>
                Review
          </a>
          <Divider  type="vertical" />
          <a onClick={() => { 
                this.props.dispatch({
                  type: "rides/violationRideDetail",
                  id: record.id,
                  onSuccess: result => this.handleRideModalVisible(true, result),
                  onError: () => {
                    message.error("backend error: can't get ride detail.")
                  }
                });
              }}>
                Ride Detail
          </a>
        </div>
      ),
    },
  ];

  handleRideModalVisible = (flag, record) => {
    const { dispatch } = this.props;

    if (!!flag) {

      this.setState({selectedRide: record});

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
      dispatch({
        type: "geo/getFences",
        areaId: record.areaId
      });

      
      this.setState({
        rideModalVisible: true,
        selectedRide: record,
      });


    } else {
      this.setState({
        rideModalVisible: false,
        selectedRide: undefined,
        selectedRidePathInfo: undefined,
        rideImageUrl: undefined
      });
    }
  };


  handleVehicleDetailModalVisible = flag => this.setState({vehicleDetailModalVisible: flag})


  handleCustomerDetailModalVisible = flag => this.setState({customerDetailModalVisible: flag})


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.getViolations();
    }
  }

    getViolations = (fieldsValue) => {
      const { dispatch, selectedAreaId } = this.props;
      const { filterCriteria } = this.state;

      if(fieldsValue){
        if (filterCriteria.phone === "") {
          filterCriteria.phone = null;
      }
      if (fieldsValue.timeRange) {
      
        // fieldsValue.timeRange.start = moment(fieldsValue.timeRange[0]).utcOffset(0).format(
        //   "MM-DD-YYYY HH:mm:ss"
        // );
        // fieldsValue.timeRange.end = moment(fieldsValue.timeRange[1]).utcOffset(0).format(
        //   "MM-DD-YYYY HH:mm:ss"
        // );
        // fieldsValue.timeRange = undefined;
        fieldsValue.timeRange={
          start:moment(fieldsValue.timeRange[0]).utcOffset(0).format(
            "YYYY-MM-DDTHH:mm:ssZ"
          ),
          end:moment(fieldsValue.timeRange[1]).utcOffset(0).format(
            "YYYY-MM-DDTHH:mm:ssZ"
          )
        }
      }
      }
      console.log(fieldsValue);
      let values = Object.assign({}, {
        currentPage: 1,
        pageSize: 10,
      }, 
      filterCriteria, 
      fieldsValue);
      selectedAreaId ? values = {...values,areaIds:[selectedAreaId]} : null
    dispatch({
        type: 'vehicleViolations/get',
        payload: values,
      });
     
    }

    componentDidMount() {
      this.getViolations();
    }

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {},
    });

    if (!record) {
      this.setState({
        selectedRecordDetail: null,
      });
    }

  };


  handleGetViolationDetail = (id,record) => {
      const { dispatch } = this.props;
      
      dispatch({
        type: 'vehicleViolations/getDetail',
        id: id,
        onSuccess: detail => this.setState({selectedRecordDetail: detail}),
      });
      // dispatch({
      //   type: 'vehicleViolations/getDetail',
      //   id: id,
      //   onSuccess: detail => this.setState({selectedRecordDetail: detail}),
      // });

  }


  handleUpdateReject = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vehicleViolations/updateReject',
      payload: fields,
      id,
      onSuccess: this.getViolations,
    });

    this.handleUpdateModalVisible();
  };
  handleUpdateApprove = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vehicleViolations/updateApprove',
      payload: fields,
      id,
      onSuccess: this.getViolations,
    });

    this.handleUpdateModalVisible();
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

    this.setState({ filterCriteria: params }, this.getViolations);

  };

  handleFormReset = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    const params = {
      currentPage: 1,
      pageSize: filterCriteria.pageSize
    };

    this.setState(
      {
        filterCriteria: params
      },
      () => this.getViolations()
    );
  };


  render() {
    const {
      areas, violations , loading, total,technicians
    } = this.props;
    const {
      updateModalVisible,
      selectedRecord,
      filterCriteria,
      selectedRecordDetail,
      vehicleDetailModalVisible,
      selectedVehicleId,
      customerDetailModalVisible,
      selectedCustomerId,
      selectedRide,
      rideModalVisible,
      selectedRidePathInfo,
      rideImageUrl
    } = this.state;
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleUpdateApprove : this.handleUpdateApprove,
      handleUpdateReject : this.handleUpdateReject
    };

    const pagination = {
        defaultCurrent: 1,
        current: filterCriteria.currentPage,
        pageSize: filterCriteria.pageSize,
        total: total
      };


    return (
      <PageHeaderWrapper title="Violation List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}><RenderSimpleForm getViolations={this.getViolations} handleFormReset={this.handleFormReset} /></div> 
            <div>Count: {total}</div>
            <StandardTable
              loading={loading}
              data={{ list: violations, pagination: pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          recordDetail={selectedRecordDetail}
        />

        {vehicleDetailModalVisible && selectedVehicleId && (
          <VehicleDetail
            isVisible={vehicleDetailModalVisible}
            handleDetailVisible={this.handleVehicleDetailModalVisible}
            vehicleId={selectedVehicleId}
          />
        )}

        {selectedRide && rideModalVisible && (
            <RideDetail
              isVisible={rideModalVisible}
              ride={selectedRide}
              ridePath={selectedRidePathInfo}
              rideImageUrl={rideImageUrl}
              handleDetailModalVisible={this.handleRideModalVisible}
            />
          )}

        {customerDetailModalVisible && selectedCustomerId && (
          <CustomerDetail
            isVisible={customerDetailModalVisible}
            handleDetailVisible={this.handleCustomerDetailModalVisible}
            customerId={selectedCustomerId}
            handleGetRides={this.handleGetRides}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ areas, loading, vehicleViolations,technicians }) => {
  return {
    areas,
    violations: vehicleViolations.data,
    loading: loading.models.vehicleViolations,
    total: vehicleViolations.total,
    selectedAreaId: areas.selectedAreaId,
    technicians:technicians.newData
      }
}
export default connect(mapStateToProps)(VehicleViolation) 