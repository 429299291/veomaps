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
  Steps,
  Radio, Divider, Popconfirm, Dropdown, DatePicker, message
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import { getAuthority } from "@/utils/authority";

import VehicleDetail from "@/pages/Vehicle/VehicleDetail";
import CustomerDetail from "@/pages/Customer/CustomerDetail";

import {formatPhoneNumber} from "@/utils/utils"

const authority = getAuthority();

const { RangePicker } = DatePicker;

import styles from "./Notification.less";

const Option = Select.Option;

const FormItem = Form.Item;

const TextArea = Input.TextArea;

const messageTypes = ["push notification", "sms message"];
const RenderSimpleForm=(props)=> {
  const [form] = Form.useForm()
  return (
    <Form form={form} layout="inline">
      <Row>
        <Col span={9}>
          <FormItem label="Keywords" name='email'>
              <Input placeholder="Email" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Type"
            name='type'
          >
              <Select placeholder="select" style={{ width: "100%" }}>
                {messageTypes.map((type,index) => (
                  <Option key={index} value={index}>
                    {type}
                  </Option>
                ))}
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        <Col span={3}>
          <span className={styles.submitButtons}>
            <Button onClick={()=>{props.handleSearch(form.getFieldsValue(true))}}>
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={props.handleFormReset}>
              Reset
            </Button>
          </span>
        </Col>
      </Row>

    </Form>
  );
}

const MessageAreaSender = (props => {
    const {
      areaId,
      handleSendNotifications
    } = props;
    const [form] = Form.useForm()
    const okHandle = () => {
          const fieldsValue = form.getFieldsValue(true)
          if(fieldsValue.message&&fieldsValue.type === 0){
            handleSendNotifications(fieldsValue.message, fieldsValue.type);
            form.resetFields()
          }else if(!fieldsValue.message){
            message.error('Please select message')
          }else{
            message.error('Please select type')
          }
    };
  
    return (
        <div style={{marginBottom: "3rem"}}>
          <Form form={form}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom: "1rem"}}>
                    <Col md={8} sm={24}>
                        <FormItem name='message'
                          rules={
                            [
                              {
                              required: true,
                              message: "Message cant be null",
                              min: 1
                              }
                            ]
                          }
                        >
                        <TextArea autosize={{minRows: 5, maxRows: 23}} placeholder="message:"/>
                        </FormItem>
                    </Col>
                    <Col span={5}>
                  <FormItem rules='type'
                  name='type'
                    rules={
                      [
                        {
                        required: true,
                        message: "You have pick a type"
                        }
                    ]
                    }
                  >
                    <Select placeholder="select" style={{ width: "100%" }}>
                        <Option value={0}>Push Notification</Option>
                        {/* <Option value="1">SMS Message</Option> */}
                    </Select>
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <Button 
                        type="primary"
                        onClick={okHandle}
                        disabled={!areaId}
                        style={{marginRight: "1em", marginTop: "0.5em"}}
                    >
                    Send
                    </Button>
                </Col>
            </Row>
            </Form>
        </div  >
    );
  });



/* eslint react/no-multi-comp:0 */
class Notifications extends PureComponent {
  state = {
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {
      pagination:{
        page:1,
        pageSize:10,
        sort:{
          direction:'desc',
          sortBy:'created'
        }
      }
    },
    total:null,
    selectedRecord: {}
  };

  columns = [
    {
      title: "Sender",
      dataIndex: "adminEmail"
    },
    {
      title: "Content",
      dataIndex: "message",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: val => <span>{messageTypes[val]}</span>
    },
    {
      title: "Date",
      dataIndex: "created",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  ];

  componentDidMount() {
    this.handleGetSentNotifications();
  }

  handleGetSentNotifications = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;
    filterCriteria.pagination.page ? filterCriteria.pagination.page = filterCriteria.pagination.page-1 : null
    filterCriteria.pagination.sort={
        direction:'desc',
        sortBy:'created'
    }
    dispatch({
      type: "notifications/getForCustomer",
      payload: selectedAreaId ? Object.assign(filterCriteria, {areaId: selectedAreaId}, ) : filterCriteria,
      onSuccess: (data,total,page) => {
        this.setState({selectedRows:data})
        this.setState({total:total})
        this.setState({
          filterCriteria:{
            pagination:{
              page:page,
              ...filterCriteria.pagination
            }
          }
        })
    }
    });
  };



  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { filterCriteria } = this.state;
    const paginationData={
      page:pagination.current,
      pageSize:pagination.pageSize
    }
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }
    this.setState({ filterCriteria:{
      pagination:paginationData
    } }, () => this.handleGetSentNotifications());
  };

  handleFormReset = () => {
    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetSentNotifications()
    );
  };

  handleSearch = fieldsValue => {

    const { dispatch } = this.props;
    const { filterCriteria } = this.state;
      const values = Object.assign({}, filterCriteria, fieldsValue);
      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetSentNotifications()
      );
  };


  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetSentNotifications();
    }
  }

  handleSendNotifications = (content, messageType) => {

    const { dispatch, selectedAreaId } = this.props;
    
    dispatch({
        type: "notifications/sendForCustomers",
        payload:  content,
        areaId: selectedAreaId,
        messageType: messageType,
        onSuccess: this.handleGetSentNotifications 
      });
  }
  render() {
    const { notifications, loading, selectedAreaId } = this.props;
    const {
      selectedRows,
      selectedRecord,
      errorImages,
      vehicleDetailModalVisible,
      selectedVehicleId,
      customerDetailModalVisible,
      selectedCustomerId,
      filterCriteria,
      total
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    return (
      <PageHeaderWrapper title="Notification List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              
            <MessageAreaSender 
                    areaId={selectedAreaId}
                    handleSendNotifications={this.handleSendNotifications}
                />
              
              {/* <RenderSimpleForm handleFormReset={this.handleFormReset} handleSearch={this.handleSearch} /> */}
             
            </div>
          
            <StandardTable
              loading={loading}
              data={{ list: notifications, pagination: {
                current:filterCriteria.pagination.page +1,
                total:total,
                showTotal: ((total) => {
                  return `count: ${total}`;
                })
              }}}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{x:1300}}
            />
          </div>
        </Card>

       
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ notifications , loading, areas }) => {
  return {
    notifications: notifications.customer,
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.notifications
    }
}
export default connect(mapStateToProps)(Notifications) 