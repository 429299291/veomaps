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
  InputNumber
} from 'antd';

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

const ViolationLocation = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const { location } = props;

  return (
    <GoogleMap defaultZoom={15} center={location}>
      <Marker position={location} label={"start"} />
    </GoogleMap>
  );
});

const UpdateForm = Form.create()((props) => {
  const {
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    record,
    recordDetail
  } = props;
  
  const validateFormAndUpdate = newState => {
    form.validateFields((err, fieldsValue) => {
        if (err) return;

        fieldsValue.type = newState;
        
        handleUpdate(record.id, fieldsValue);
        
        form.resetFields();

        handleModalVisible();
    });

  
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

  //wait for review
  if (record.status === violationStatusIndex.WAITING) {

    footer.push(<Button key="approve" style={{color: "white", backgroundColor: "#53bab6"}} onClick={() => validateFormAndUpdate(violationStatusIndex.APPROVE)}>
        Approve
    </Button>);

    footer.push(<Button key="reject" style={{color: "white", backgroundColor: "#e8380c"}} onClick={() => validateFormAndUpdate(violationStatusIndex.REJECT)}>
        Reject
    </Button>);
    
  }

  //approved state
  if (record.status === violationStatusIndex.APPROVE) {

    footer.push(<Button key="revert" type="danger"  onClick={() => validateFormAndUpdate(violationStatusIndex.REVERT)}>
        Revert
    </Button>);

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
      footer={footer}
    >
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Technician Note">
        {<span>{record.techNote}</span>}
      </FormItem>

      <FormItem labelCol={{ span: 8}} wrapperCol={{ span: 12 }} label="Vehicle Number">
        {<span>{record.vehicleNumber}</span>}
      </FormItem>

      {

        recordDetail && recordDetail.techPhone &&
        <FormItem labelCol={{ span: 8}} wrapperCol={{ span: 12 }} label="Technician Number">
            {<span>{recordDetail.techPhone}</span>}
        </FormItem>
      }
      {
        recordDetail && recordDetail.customerViolationCount >= 0 &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12}} label="Customer Violations">
            {<span>{recordDetail.customerViolationCount}</span>}
        </FormItem>
      }
      {
        record && record.phone &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12}} label="Customer Phone">
            {<span>{record.phone}</span>}
        </FormItem>
      }
      {
        recordDetail && recordDetail.techName &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Technician">
            {<span>{recordDetail.techName}</span>}
        </FormItem>
      }


      {
        record &&  record.status >= 0 &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Status">
            {<span style={{color: violationStatus[record.status].color}}>{violationStatus[record.status].name}</span>}
        </FormItem>
      }

      {
        record.lat &&  record.lng &&
        <ViolationLocation 
          location={{lat: record.lat, lng: record.lng}}
        />

      }
      {
                 recordDetail &&  recordDetail.imageUrl &&
                  <Row style={{height: "620px"}}>
                    
                  <img  src={recordDetail.imageUrl} style={{ width: "600px", maxHeight: "460px", marginLeft: "-60px", marginTop: "80px"}} className={styles.rotate90} />

                  </Row>
      }
      {
        recordDetail && recordDetail.operatedBy && recordDetail.operatedBy.adminEmail &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label={`${violationStatus[record.status].name} By`}>
            {<span>{recordDetail.operatedBy.adminEmail}</span>}
        </FormItem>
      }
      {
        record.adminNote &&
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="Admin Note">
            {<span>{record.adminNote}</span>}
        </FormItem>
      }
      { isReviewEditable && <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} style={{marginTop: "20px"}} label="Note">
        {form.getFieldDecorator('adminNote')(<TextArea placeholder="Please Input" />)}
      </FormItem> }
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({
  areas, loading, vehicleViolations,
}) => ({
  areas,
  violations: vehicleViolations.data,
  loading: loading.models.vehicleViolations,
  total: vehicleViolations.total,
  selectedAreaId: areas.selectedAreaId,
}))
@Form.create()
class VehicleViolation extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    filterCriteria: {currentPage: 1, pageSize: 10 },
    selectedRecord: {},
    selectedRecordDetail: {},
  };

  columns = [
    {
        title: 'Tech Note',
        dataIndex: 'techNote',
      },
    {
      title: 'Vehicle Number',
      dataIndex: 'vehicleNumber',
    },
    {
      title: 'Customer Phone',
      dataIndex: 'phone',
    },
    {
        title: 'Created',
        dataIndex: 'created',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: 'Status',
        dataIndex: "status",
        render: val => <span style={{color: violationStatus[val].color}}> {violationStatus[val].name} </span>
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
              this.handleGetViolationDetail(record.id);
              }}>
                Review

          </a>
        </div>
      ),
    },
  ];


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.getViolations();
    }
  }

    getViolations = () => {
      const { dispatch, form, selectedAreaId } = this.props;
      const { filterCriteria } = this.state;

      form.validateFields((err, fieldsValue) => {

        if (err) return;

        if (filterCriteria.phone === "") {
            filterCriteria.phone = null;
        }

        const values = Object.assign({}, {
            currentPage: 1,
            pageSize: 10,
            areaId: selectedAreaId
          }, 
          filterCriteria, 
          fieldsValue);

        dispatch({
            type: 'vehicleViolations/get',
            payload: values,
          });

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


  handleGetViolationDetail = id => {
      
      const { dispatch } = this.props;
      
      dispatch({
        type: 'vehicleViolations/getDetail',
        id: id,
        onSuccess: detail => this.setState({selectedRecordDetail: detail}),
      });

  }


  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vehicleViolations/update',
      payload: fields,
      id,
      onSuccess: this.getViolations,
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const areas = this.props.areas.data;
    return (
      <Form onSubmit={e => {typeof e === 'object' && e.preventDefault(); this.getViolations();}} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                label="Customer Phone"
              >
                {getFieldDecorator('phone', {
                    rules: [
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
                    ],
                    initialValue: null
                })(
                    
                  <InputNumber placeholder="Please Phone Number" style={{width: "100%"}}/>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                label="Status"
              >
               {getFieldDecorator("status")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Option key="0" value="0">Waiting For Review</Option>
                  <Option key="1" value="1">Rejected</Option>
                  <Option key="2" value="2">Approved</Option>
                  <Option key="3" value="3">Reverted</Option>
                  <Option value={null}>All</Option>
                </Select>
              )}
              </FormItem>
            </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
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
      () => this.getViolations()
    );
  };


  render() {
    const {
      areas, violations , loading, total
    } = this.props;
    const {
      updateModalVisible,
      selectedRecord,
      filterCriteria,
      selectedRecordDetail
    } = this.state;


    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
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
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
      </PageHeaderWrapper>
    );
  }
}

export default VehicleViolation;